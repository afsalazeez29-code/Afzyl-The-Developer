<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    Color,
    Points,
    BufferGeometry,
    Float32BufferAttribute,
    PointsMaterial,
    SphereGeometry,
    MeshBasicMaterial,
    InstancedMesh,
    Matrix4,
    Group,
    Vector3,
    NormalBlending,
  } from "three";

  // ── Props ─────────────────────────────────────────────────────────────────
  export let particlesCount: number = 10000;
  export let particleScale: number = 4;
  export let speed: number = 20;
  export let smoothing: number = 7;
  export let scale: number = 10;
  export let stopOnHover: boolean = false;
  export let rotationDirection: "clockwise" | "anticlockwise" = "clockwise";
  export let dragSpeed: number = 5;
  export let drag: boolean = true;
  export let cursorOn: boolean = true;
  export let cursorRadiusUI: number = 75;
  export let cursorStrengthUI: number = 10;
  export let clickForce: number = 5;
  export let sphereColor: string = "rgba(255, 25, 45, 0.85)";
  // ── DOM ref ───────────────────────────────────────────────────────────────
  let container: HTMLDivElement;

  // ── Cleanup function returned from onMount ────────────────────────────────
  let cleanup: (() => void) | null = null;

  // ── Utilities ─────────────────────────────────────────────────────────────
  const cssVariableRegex =
    /var\s*\(\s*(--[\w-]+)(?:\s*,\s*((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*))?s*\)/;

  function extractDefaultValue(cssVar: string): string {
    if (!cssVar || !cssVar.startsWith("var(")) return cssVar;
    const match = cssVariableRegex.exec(cssVar);
    if (!match) return cssVar;
    const fallback = (match[2] || "").trim();
    if (fallback.startsWith("var(")) return extractDefaultValue(fallback);
    return fallback || cssVar;
  }

  function resolveTokenColor(input: string): string {
    if (!input.startsWith("var(")) return input;
    return extractDefaultValue(input);
  }

  function parseColorToRgba(input: string): {
    r: number;
    g: number;
    b: number;
    a: number;
  } {
    if (!input || input.trim() === "") return { r: 0, g: 0, b: 0, a: 0 };
    const str = input.trim();
    const rgbaMatch = str.match(
      /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)/i,
    );
    if (rgbaMatch) {
      return {
        r: Math.max(0, Math.min(255, parseFloat(rgbaMatch[1]))) / 255,
        g: Math.max(0, Math.min(255, parseFloat(rgbaMatch[2]))) / 255,
        b: Math.max(0, Math.min(255, parseFloat(rgbaMatch[3]))) / 255,
        a:
          rgbaMatch[4] !== undefined
            ? Math.max(0, Math.min(1, parseFloat(rgbaMatch[4])))
            : 1,
      };
    }
    const hex = str.replace(/^#/, "");
    if (hex.length === 8)
      return {
        r: parseInt(hex.slice(0, 2), 16) / 255,
        g: parseInt(hex.slice(2, 4), 16) / 255,
        b: parseInt(hex.slice(4, 6), 16) / 255,
        a: parseInt(hex.slice(6, 8), 16) / 255,
      };
    if (hex.length === 6)
      return {
        r: parseInt(hex.slice(0, 2), 16) / 255,
        g: parseInt(hex.slice(2, 4), 16) / 255,
        b: parseInt(hex.slice(4, 6), 16) / 255,
        a: 1,
      };
    if (hex.length === 3)
      return {
        r: parseInt(hex[0] + hex[0], 16) / 255,
        g: parseInt(hex[1] + hex[1], 16) / 255,
        b: parseInt(hex[2] + hex[2], 16) / 255,
        a: 1,
      };
    return { r: 0, g: 0, b: 0, a: 1 };
  }

  function mapLinear(
    value: number,
    inMin: number,
    inMax: number,
    outMin: number,
    outMax: number,
  ): number {
    if (inMax === inMin) return outMin;
    const t = (value - inMin) / (inMax - inMin);
    return outMin + t * (outMax - outMin);
  }

  function mapSpeedUiToInternal(ui: number): number {
    return mapLinear(ui, 0.1, 1.0, 0.01, 0.05);
  }

  function mapScaleUiToMultiplier(ui: number): number {
    return mapLinear(Math.max(0, Math.min(1, ui)), 0, 1.0, 0.25, 1.25);
  }

  function mapParticleSizeUiToInternal(ui: number): number {
    return mapLinear(Math.max(0.1, Math.min(1, ui)), 0.1, 1.0, 0.01, 0.1);
  }

  function mapCursorStrengthUiToMultiplier(ui: number): number {
    return mapLinear(Math.max(0, Math.min(1, ui)), 0, 1.0, 0, 15);
  }

  const CURSOR_PHYSICS = {
    RETURN_FORCE: 0.015,
    FRICTION: 0.94,
  } as const;

  // ── Init Three.js scene ───────────────────────────────────────────────────
  function initScene(containerEl: HTMLDivElement): () => void {
    const speedN = speed / 10;
    const smoothingN = smoothing / 10;
    const scaleN = scale / 10;
    const dragN = dragSpeed / 10;
    const sizeN = particleScale / 10;
    const strengthN = cursorStrengthUI / 10;

    const rotationSpeed =
      rotationDirection === "anticlockwise"
        ? -mapSpeedUiToInternal(speedN)
        : mapSpeedUiToInternal(speedN);
    const scaleMultiplier = mapScaleUiToMultiplier(scaleN);
    const particleSize = mapParticleSizeUiToInternal(sizeN);
    const cursorRadius = Math.max(0, Math.min(600, cursorRadiusUI));
    const cursorStrength = mapCursorStrengthUiToMultiplier(strengthN);

    const cursorConfig = {
      enabled: cursorOn,
      radius: cursorRadius,
      strength: cursorStrength,
      clickForce,
    };

    const containerWidth =
      containerEl.clientWidth || containerEl.offsetWidth || 400;
    const containerHeight =
      containerEl.clientHeight || containerEl.offsetHeight || 400;

    const canvasOverflowMultiplier = 2.5;
    const canvasWidth = containerWidth * canvasOverflowMultiplier;
    const canvasHeight = containerHeight * canvasOverflowMultiplier;

    // Scene
    const scene = new Scene();

    // Camera with adjusted FOV for canvas overflow
    const baseFOV = 50;
    const adjustedFOV =
      2 *
      Math.atan(
        Math.tan((baseFOV * Math.PI) / 180 / 2) * canvasOverflowMultiplier,
      ) *
      (180 / Math.PI);

    const camera = new PerspectiveCamera(
      adjustedFOV,
      canvasWidth / canvasHeight,
      0.1,
      1000,
    );
    const baseCameraDistance = 3.0;
    const cameraDistance = Math.max(
      baseCameraDistance,
      1.0 * scaleMultiplier + 1.0,
    );
    camera.position.z = cameraDistance;

    // Renderer
    const renderer = new WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(canvasWidth, canvasHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = "srgb";

    const canvas = renderer.domElement;
    const offsetX = (canvasWidth - containerWidth) / 2;
    const offsetY = (canvasHeight - containerHeight) / 2;
    canvas.style.position = "absolute";
    canvas.style.left = `-${offsetX}px`;
    canvas.style.top = `-${offsetY}px`;
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;
    canvas.style.display = "block";
    containerEl.appendChild(canvas);

    // Color parsing — safely separate RGB from alpha
    const resolvedColor = resolveTokenColor(sphereColor);
    const sphereRgba = parseColorToRgba(resolvedColor || sphereColor);
    const baseColorObj = new Color(sphereRgba.r, sphereRgba.g, sphereRgba.b);
    const particleOpacity = sphereRgba.a;

    // Fibonacci sphere particle positions
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    const sphereR = 1.0 * scaleMultiplier;
    const vertices: number[] = [];
    const baseParticlePositions: Vector3[] = [];
    const particleDisplacements: Vector3[] = [];
    const particleScatterVelocities: Vector3[] = [];

    for (let i = 0; i < particlesCount; i++) {
      const y = 1 - (i / (particlesCount - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = goldenAngle * i;
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;
      const posX = x * sphereR;
      const posY = y * sphereR;
      const posZ = z * sphereR;
      vertices.push(posX, posY, posZ);
      baseParticlePositions.push(new Vector3(posX, posY, posZ));
      particleDisplacements.push(new Vector3(0, 0, 0));
      particleScatterVelocities.push(new Vector3(0, 0, 0));
    }

    // Particle mesh (InstancedMesh for round particles)
    const pSphereRadius = particleSize * 0.45;

    const pSphereGeometry = new SphereGeometry(pSphereRadius, 8, 8);

    const pSphereMaterial = new MeshBasicMaterial({
      color: 0xff192d,
      blending: NormalBlending,
      transparent: true,
      opacity: particleOpacity,
      depthWrite: false,
    });

    const particles = new InstancedMesh(
      pSphereGeometry,
      pSphereMaterial,
      particlesCount,
    );

    const matrix = new Matrix4();
    for (let i = 0; i < particlesCount; i++) {
      const idx = i * 3;
      matrix.setPosition(vertices[idx], vertices[idx + 1], vertices[idx + 2]);
      particles.setMatrixAt(i, matrix);
    }
    particles.instanceMatrix.needsUpdate = true;

    const instanceColors = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      instanceColors[i * 3] = baseColorObj.r;
      instanceColors[i * 3 + 1] = baseColorObj.g;
      instanceColors[i * 3 + 2] = baseColorObj.b;
    }
    particles.instanceColor = new Float32BufferAttribute(
      instanceColors,
      3,
    ) as any;
    (particles.instanceColor as any).needsUpdate = true;

    const particlesGroup = new Group();
    particlesGroup.add(particles);
    scene.add(particlesGroup);

    // Rotation state
    const rotation = { x: 0, y: 0 };
    const targetRotation = { x: 0, y: 0 };
    const velocity = { x: 0, y: 0 };
    let isDragging = false;
    let isHovering = false;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let lastDragTime = 0;
    let animationFrameId: number | null = null;
    let lastFrameTime = performance.now();
    const targetDeltaTime = 1000 / 60;

    const lerpFactor =
      smoothingN === 0 ? 1 : mapLinear(smoothingN, 0, 1, 0.4, 0.03);
    const velocityDecay = mapLinear(smoothingN, 0, 1, 0.7, 0.96);

    let mouse: { x: number; y: number } | null = null;

    const startAnimation = () => {
      if (animationFrameId === null) {
        lastFrameTime = performance.now();
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    const animate = () => {
      const now = performance.now();
      const deltaTime = now - lastFrameTime;
      lastFrameTime = now;
      const deltaFactor = deltaTime / targetDeltaTime;

      const threshold = 0.01;

      if (!isDragging && rotationSpeed !== 0 && (!stopOnHover || !isHovering)) {
        targetRotation.x += rotationSpeed * 0.1 * deltaFactor;
      }

      if (!isDragging && smoothingN > 0) {
        if (
          Math.abs(velocity.x) > threshold ||
          Math.abs(velocity.y) > threshold
        ) {
          targetRotation.x += velocity.x * deltaFactor;
          targetRotation.y += velocity.y * deltaFactor;
          targetRotation.y = Math.max(
            -Math.PI / 2,
            Math.min(Math.PI / 2, targetRotation.y),
          );
          const decayFactor = Math.pow(velocityDecay, deltaFactor);
          velocity.x *= decayFactor;
          velocity.y *= decayFactor;
        } else {
          velocity.x = 0;
          velocity.y = 0;
        }
      }

      const dx = targetRotation.x - rotation.x;
      const dy = targetRotation.y - rotation.y;

      if (
        Math.abs(dx) > threshold ||
        Math.abs(dy) > threshold ||
        rotationSpeed !== 0 ||
        isDragging
      ) {
        const timeLerpFactor = 1 - Math.pow(1 - lerpFactor, deltaFactor);
        rotation.x += dx * timeLerpFactor;
        rotation.y += dy * timeLerpFactor;
        rotation.y = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotation.y));
      }

      particlesGroup.rotation.y = rotation.x;
      particlesGroup.rotation.x = rotation.y;
      particlesGroup.updateMatrixWorld(true);

      const currentW = containerEl.clientWidth || 400;
      const currentH = containerEl.clientHeight || 400;
      const currentCanvasW = currentW * canvasOverflowMultiplier;
      const currentCanvasH = currentH * canvasOverflowMultiplier;
      const cursorRadiusSq = cursorRadius * cursorRadius;

      // Cursor repulsion
      if (cursorConfig.enabled && baseParticlePositions.length > 0) {
        for (let i = 0; i < baseParticlePositions.length; i++) {
          const basePos = baseParticlePositions[i];
          const displacement = particleDisplacements[i];

          if (mouse) {
            const currentLocalPos = new Vector3()
              .copy(basePos)
              .add(displacement);
            const worldPos = new Vector3()
              .copy(currentLocalPos)
              .applyMatrix4(particlesGroup.matrixWorld);
            const projected = worldPos.clone().project(camera);
            const screenX = (projected.x * 0.5 + 0.5) * currentCanvasW;
            const screenY = (-projected.y * 0.5 + 0.5) * currentCanvasH;
            const ddx = mouse.x - screenX;
            const ddy = mouse.y - screenY;
            const distSq = ddx * ddx + ddy * ddy;

            if (distSq < cursorRadiusSq && distSq > 0 && worldPos.z > 0) {
              const distance = Math.sqrt(distSq);
              const force = (cursorRadius - distance) / cursorRadius;
              const angle = Math.atan2(ddy, ddx);
              const cameraRight = new Vector3()
                .setFromMatrixColumn(camera.matrixWorld, 0)
                .normalize();
              const cameraUp = new Vector3()
                .setFromMatrixColumn(camera.matrixWorld, 1)
                .normalize();
              const repulsion2D =
                force * cursorConfig.strength * speedN * deltaFactor;
              const repulsionX = -Math.cos(angle) * repulsion2D * 0.01;
              const repulsionY = Math.sin(angle) * repulsion2D * 0.01;
              const worldRepulsion = new Vector3()
                .addScaledVector(cameraRight, repulsionX)
                .addScaledVector(cameraUp, repulsionY);
              const inverseMatrix = new Matrix4()
                .copy(particlesGroup.matrixWorld)
                .invert();
              const localRepulsion = worldRepulsion
                .clone()
                .applyMatrix4(inverseMatrix);
              displacement.add(localRepulsion);
            }
          }

          const frictionFactor = Math.pow(CURSOR_PHYSICS.FRICTION, deltaFactor);
          const returnForce =
            CURSOR_PHYSICS.RETURN_FORCE * speedN * deltaFactor;
          displacement.multiplyScalar(frictionFactor * (1 - returnForce));
        }
      }

      // Scatter velocity decay
      for (let i = 0; i < particleScatterVelocities.length; i++) {
        const sv = particleScatterVelocities[i];
        const disp = particleDisplacements[i];
        disp.addScaledVector(sv, deltaFactor * 0.1);
        const scatterFriction = Math.pow(0.95, deltaFactor);
        sv.multiplyScalar(
          scatterFriction *
            (1 - CURSOR_PHYSICS.RETURN_FORCE * speedN * deltaFactor),
        );
      }

      // Update instanced mesh positions
      const m = new Matrix4();
      for (let i = 0; i < baseParticlePositions.length; i++) {
        const finalPos = new Vector3()
          .copy(baseParticlePositions[i])
          .add(particleDisplacements[i]);
        m.setPosition(finalPos.x, finalPos.y, finalPos.z);
        particles.setMatrixAt(i, m);
      }
      particles.instanceMatrix.needsUpdate = true;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    startAnimation();

    // ── Mouse/drag handlers ─────────────────────────────────────────────────
    const handleMouseDown = (event: MouseEvent) => {
      if (!drag) return;
      isDragging = true;
      velocity.x = 0;
      velocity.y = 0;
      lastMouseX = event.clientX;
      lastMouseY = event.clientY;
      lastDragTime = performance.now();
      startAnimation();

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const currentTime = performance.now();
        const timeSinceLastMove = currentTime - lastDragTime;
        const sensitivity = mapLinear(dragN, 0, 1, 0.001, 0.02);
        const ddx = moveEvent.clientX - lastMouseX;
        const ddy = moveEvent.clientY - lastMouseY;
        targetRotation.x += ddx * sensitivity;
        targetRotation.y += ddy * sensitivity;
        targetRotation.y = Math.max(
          -Math.PI / 2,
          Math.min(Math.PI / 2, targetRotation.y),
        );
        if (timeSinceLastMove > 0) {
          const timeNorm = targetDeltaTime / timeSinceLastMove;
          velocity.x = ddx * sensitivity * 0.3 * timeNorm;
          velocity.y = ddy * sensitivity * 0.3 * timeNorm;
        }
        lastMouseX = moveEvent.clientX;
        lastMouseY = moveEvent.clientY;
        lastDragTime = currentTime;
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        isDragging = false;
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };

    if (drag) canvas.addEventListener("mousedown", handleMouseDown);

    // Hover-stop
    const handleMouseMoveHover = (event: MouseEvent) => {
      if (!stopOnHover) return;
      const rect = containerEl.getBoundingClientRect();
      const mx = event.clientX - rect.left;
      const my = event.clientY - rect.top;
      isHovering = mx >= 0 && mx <= rect.width && my >= 0 && my <= rect.height;
    };
    if (stopOnHover) canvas.addEventListener("mousemove", handleMouseMoveHover);

    // Cursor repulsion tracking
    const handleMouseMoveCursor = (event: MouseEvent) => {
      const rect = containerEl.getBoundingClientRect();
      const mx = event.clientX - rect.left;
      const my = event.clientY - rect.top;
      if (mx >= 0 && mx <= rect.width && my >= 0 && my <= rect.height) {
        mouse = { x: mx + offsetX, y: my + offsetY };
        startAnimation();
      } else {
        mouse = null;
      }
    };

    const handleMouseLeaveCursor = () => {
      mouse = null;
    };

    // Touch repulsion tracking
    const handleTouchMove = (event: TouchEvent) => {
      event.preventDefault();
      const rect = containerEl.getBoundingClientRect();
      const touch = event.touches[0];
      if (touch) {
        const tx = touch.clientX - rect.left;
        const ty = touch.clientY - rect.top;
        if (tx >= 0 && tx <= rect.width && ty >= 0 && ty <= rect.height) {
          mouse = { x: tx + offsetX, y: ty + offsetY };
          startAnimation();
        } else {
          mouse = null;
        }
      }
    };

    const handleTouchEnd = () => {
      mouse = null;
    };

    // Click scatter
    const handleClick = (event: MouseEvent) => {
      if (!cursorConfig.enabled || !cursorConfig.clickForce) return;
      particlesGroup.updateMatrixWorld(true);
      const rect = containerEl.getBoundingClientRect();
      const cW = containerEl.clientWidth || 400;
      const cH = containerEl.clientHeight || 400;
      const clickCanvasW = cW * canvasOverflowMultiplier;
      const clickCanvasH = cH * canvasOverflowMultiplier;
      const clickX = event.clientX - rect.left + offsetX;
      const clickY = event.clientY - rect.top + offsetY;
      const clickRay = new Vector3(
        (clickX / clickCanvasW) * 2 - 1,
        1 - (clickY / clickCanvasH) * 2,
        0.5,
      ).unproject(camera);
      const camPos = new Vector3().setFromMatrixPosition(camera.matrixWorld);
      const dir = new Vector3().subVectors(clickRay, camPos).normalize();
      const toCenter = new Vector3().subVectors(new Vector3(0, 0, 0), camPos);
      const clickWorldPos = camPos
        .clone()
        .addScaledVector(dir, toCenter.length());

      const rSq = cursorRadiusUI * cursorRadiusUI;

      for (let i = 0; i < baseParticlePositions.length; i++) {
        const finalPos = new Vector3()
          .copy(baseParticlePositions[i])
          .add(particleDisplacements[i]);
        const worldPos = finalPos
          .clone()
          .applyMatrix4(particlesGroup.matrixWorld);
        const proj = worldPos.clone().project(camera);
        const sx = (proj.x * 0.5 + 0.5) * clickCanvasW;
        const sy = (-proj.y * 0.5 + 0.5) * clickCanvasH;
        const ddx = clickX - sx;
        const ddy = clickY - sy;
        const dSq = ddx * ddx + ddy * ddy;
        if (dSq < rSq && dSq > 0) {
          const screenDist = Math.sqrt(dSq);
          const force =
            ((cursorRadius - screenDist) / cursorRadius) * clickForce;
          const radial = new Vector3().subVectors(worldPos, clickWorldPos);
          const radialDist = radial.length();
          if (radialDist > 0.001) {
            radial.normalize().multiplyScalar(force * 0.5);
            const inv = new Matrix4().copy(particlesGroup.matrixWorld).invert();
            particleScatterVelocities[i].add(radial.clone().applyMatrix4(inv));
          }
        }
      }
      startAnimation();
    };

    // Touch scatter
    const handleTouchStart = (event: TouchEvent) => {
      if (!cursorConfig.enabled || !cursorConfig.clickForce) return;
      event.preventDefault();
      particlesGroup.updateMatrixWorld(true);
      const rect = containerEl.getBoundingClientRect();
      const touch = event.touches[0];
      if (!touch) return;
      const cW = containerEl.clientWidth || 400;
      const cH = containerEl.clientHeight || 400;
      const tCanvasW = cW * canvasOverflowMultiplier;
      const tCanvasH = cH * canvasOverflowMultiplier;
      const tx = touch.clientX - rect.left + offsetX;
      const ty = touch.clientY - rect.top + offsetY;
      const touchRay = new Vector3(
        (tx / tCanvasW) * 2 - 1,
        1 - (ty / tCanvasH) * 2,
        0.5,
      ).unproject(camera);
      const camPos = new Vector3().setFromMatrixPosition(camera.matrixWorld);
      const dir = new Vector3().subVectors(touchRay, camPos).normalize();
      const toCenter = new Vector3().subVectors(new Vector3(0, 0, 0), camPos);
      const touchWorldPos = camPos
        .clone()
        .addScaledVector(dir, toCenter.length());
      const rSq = cursorRadiusUI * cursorRadiusUI;

      for (let i = 0; i < baseParticlePositions.length; i++) {
        const finalPos = new Vector3()
          .copy(baseParticlePositions[i])
          .add(particleDisplacements[i]);
        const worldPos = finalPos
          .clone()
          .applyMatrix4(particlesGroup.matrixWorld);
        const proj = worldPos.clone().project(camera);
        const sx = (proj.x * 0.5 + 0.5) * tCanvasW;
        const sy = (-proj.y * 0.5 + 0.5) * tCanvasH;
        const ddx = tx - sx;
        const ddy = ty - sy;
        const dSq = ddx * ddx + ddy * ddy;
        if (dSq < rSq && dSq > 0) {
          const screenDist = Math.sqrt(dSq);
          const force =
            ((cursorRadius - screenDist) / cursorRadius) * clickForce;
          const radial = new Vector3().subVectors(worldPos, touchWorldPos);
          if (radial.length() > 0.001) {
            radial.normalize().multiplyScalar(force * 0.5);
            const inv = new Matrix4().copy(particlesGroup.matrixWorld).invert();
            particleScatterVelocities[i].add(radial.clone().applyMatrix4(inv));
          }
        }
      }
      startAnimation();
    };

    if (cursorConfig.enabled) {
      canvas.addEventListener("mousemove", handleMouseMoveCursor);
      canvas.addEventListener("mouseleave", handleMouseLeaveCursor);
      canvas.addEventListener("click", handleClick);
      canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
      canvas.addEventListener("touchstart", handleTouchStart, {
        passive: false,
      });
      canvas.addEventListener("touchend", handleTouchEnd);
      canvas.addEventListener("touchcancel", handleTouchEnd);
    }

    // ── Resize handler ─────────────────────────────────────────────────────
    const handleResize = () => {
      const newW = containerEl.clientWidth || containerEl.offsetWidth || 400;
      const newH = containerEl.clientHeight || containerEl.offsetHeight || 400;
      const newCanvasW = newW * canvasOverflowMultiplier;
      const newCanvasH = newH * canvasOverflowMultiplier;
      const newOffsetX = (newCanvasW - newW) / 2;
      const newOffsetY = (newCanvasH - newH) / 2;

      camera.aspect = newCanvasW / newCanvasH;
      camera.updateProjectionMatrix();
      renderer.setSize(newCanvasW, newCanvasH);
      canvas.style.left = `-${newOffsetX}px`;
      canvas.style.top = `-${newOffsetY}px`;
      canvas.style.width = `${newCanvasW}px`;
      canvas.style.height = `${newCanvasH}px`;
      renderer.render(scene, camera);
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(containerEl);
    window.addEventListener("resize", handleResize);

    // ── Cleanup ────────────────────────────────────────────────────────────
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
      if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
      if (drag) canvas.removeEventListener("mousedown", handleMouseDown);
      if (stopOnHover)
        canvas.removeEventListener("mousemove", handleMouseMoveHover);
      if (cursorConfig.enabled) {
        canvas.removeEventListener("mousemove", handleMouseMoveCursor);
        canvas.removeEventListener("mouseleave", handleMouseLeaveCursor);
        canvas.removeEventListener("click", handleClick);
        canvas.removeEventListener("touchmove", handleTouchMove);
        canvas.removeEventListener("touchstart", handleTouchStart);
        canvas.removeEventListener("touchend", handleTouchEnd);
        canvas.removeEventListener("touchcancel", handleTouchEnd);
      }
      renderer.dispose();
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      pSphereGeometry.dispose();
      pSphereMaterial.dispose();
    };
  }

  onMount(() => {
    if (typeof window === "undefined") return;
    // ≤430px hard guard — skip expensive Three.js on small phones
    if (window.innerWidth <= 430) return;
    cleanup = initScene(container);
  });

  onDestroy(() => {
    cleanup?.();
  });
</script>

<!-- ── Template ─────────────────────────────────────────────────────────── -->
<div class="sun-orbit-wrapper" aria-hidden="true">
  <div class="sun-orbit-container" bind:this={container}></div>
</div>

<style>
  .sun-orbit-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: visible;
  }

  .sun-orbit-container {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: visible;
  }
</style>
