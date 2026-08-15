<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    SphereGeometry,
    MeshBasicMaterial,
    Mesh,
    TextureLoader,
    SRGBColorSpace,
    Raycaster,
    Vector2,
  } from "three";

  // ── Props (kept for API compatibility) ──
  export let speed: number = 6;
  export let smoothing: number = 0.1;
  export let stopOnHover: boolean = true;
  export let dragSpeed: number = 2;
  export let fill: string = "solid";
  export let fillColor: string = "#ff192d";
  export let oceanColor: string = "#FAFAFA";
  export let outlineColor: string = "#020D19";
  export let showOutline: boolean = true;
  export let outlineWidth: number = 1;
  export let graticuleColor: string = "rgba(220,70,50,0.1)";
  export let showGrid: boolean = true;
  export let scale: number = 8.2;
  export let direction: string = "left";
  export let initialLatitude: number = 23;
  export let initialLongitude: number = -23;

  // ── Internal state ──
  let containerEl: HTMLDivElement;
  let animFrameId: number | null = null;
  let rendererRef: WebGLRenderer | null = null;
  let cameraRef: PerspectiveCamera | null = null;
  let geometryRef: SphereGeometry | null = null;
  let materialRef: MeshBasicMaterial | null = null;
  let globeRef: Mesh | null = null;
  let observerRef: IntersectionObserver | null = null;
  let resizeObs: ResizeObserver | null = null;

  let isVisible = true;
  let isDragging = false;
  let isHovering = false;
  let initialized = false;

  let lastMouseX = 0;
  let lastMouseY = 0;

  // Rotation states (radians)
  const initialLongRad = (initialLongitude * Math.PI) / 180;
  const initialLatRad = (initialLatitude * Math.PI) / 180;

  const rotation = {
    x: initialLongRad, // Horizontal / Y-axis rotation
    y: initialLatRad, // Vertical / X-axis pitch
  };

  const targetRotation = {
    x: initialLongRad,
    y: initialLatRad,
  };

  const velocity = {
    x: 0,
    y: 0,
  };

  // Raycaster for precise sphere-surface hover detection
  const raycaster = new Raycaster();
  const mouseVec = new Vector2();

  function mapLinear(
    v: number,
    i0: number,
    i1: number,
    o0: number,
    o1: number,
  ) {
    if (i1 === i0) return o0;
    return o0 + ((v - i0) / (i1 - i0)) * (o1 - o0);
  }

  // ── Mouse / Pointer Drag Handlers ──
  function handlePointerDown(event: PointerEvent) {
    if (event.button !== 0) return; // Primary click only
    isDragging = true;
    velocity.x = 0;
    velocity.y = 0;
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;

    if (typeof window !== "undefined") {
      window.addEventListener("pointermove", handlePointerMoveDrag);
      window.addEventListener("pointerup", handlePointerUp);
      window.addEventListener("pointercancel", handlePointerUp);
    }
  }

  function handlePointerMoveDrag(event: PointerEvent) {
    if (!isDragging) return;
    const sensitivity = mapLinear(
      Math.max(0.1, Math.min(10, dragSpeed)),
      0.1,
      10,
      0.001,
      0.015,
    );
    const dx = event.clientX - lastMouseX;
    const dy = event.clientY - lastMouseY;

    // Horizontal drag updates horizontal rotation (Three.js Y-axis) — NO CLAMP
    targetRotation.x += dx * sensitivity;

    // Vertical drag updates vertical pitch (Three.js X-axis) — with safe clamp
    targetRotation.y += dy * sensitivity;
    const maxPitch = Math.PI / 2.2;
    targetRotation.y = Math.max(
      -maxPitch,
      Math.min(maxPitch, targetRotation.y),
    );

    // Calculate momentum velocity
    velocity.x = dx * sensitivity * 0.35;
    velocity.y = dy * sensitivity * 0.35;

    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
  }

  function handlePointerUp() {
    isDragging = false;
    if (typeof window !== "undefined") {
      window.removeEventListener("pointermove", handlePointerMoveDrag);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    }
  }

  // ── Raycaster Hover Handler (over container) ──
  function handlePointerMoveHover(event: PointerEvent) {
    if (!stopOnHover || isDragging || !globeRef || !cameraRef || !containerEl) {
      isHovering = false;
      return;
    }
    const rect = containerEl.getBoundingClientRect();
    mouseVec.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouseVec.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouseVec, cameraRef);
    const intersects = raycaster.intersectObject(globeRef);
    isHovering = intersects.length > 0;
  }

  function handlePointerLeave() {
    isHovering = false;
  }

  function initGlobe() {
    if (initialized || !containerEl) return;
    initialized = true;

    const W = containerEl.clientWidth || 500;
    const H = containerEl.clientHeight || 500;
    const scaleM = mapLinear(Math.max(1, Math.min(20, scale)), 1, 20, 0.2, 2);
    const globeR = scaleM;
    const camDist = 2.5 / scaleM;
    const rotSpd =
      mapLinear(Math.max(0, Math.min(10, speed)), 0, 10, 0, 0.009) *
      (direction === "left" ? -1 : 1);
    const lerpFactor = mapLinear(
      Math.max(0.01, Math.min(1, smoothing)),
      0.01,
      1,
      0.02,
      0.25,
    );

    // ── Scene & Camera ──
    const scene = new Scene();
    const camera = new PerspectiveCamera(50, W / H, 0.1, 1000);
    camera.position.set(0, 0, camDist);
    camera.lookAt(0, 0, 0);
    cameraRef = camera;

    // ── Renderer ──
    rendererRef = new WebGLRenderer({ antialias: true, alpha: true });
    rendererRef.setSize(W, H);
    rendererRef.setPixelRatio(1);
    rendererRef.outputColorSpace = "srgb";
    const canvas = rendererRef.domElement;
    canvas.style.cssText =
      "position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none;opacity:0;transition:opacity 0.6s;";
    containerEl.appendChild(canvas);

    // ── Attach Interaction Event Listeners to Container ──
    containerEl.addEventListener("pointerdown", handlePointerDown);
    containerEl.addEventListener("pointermove", handlePointerMoveHover);
    containerEl.addEventListener("pointerleave", handlePointerLeave);

    // ── Load static equirectangular texture ──
    const loader = new TextureLoader();
    loader.load(
      "/data/project-world-globe.jpg",
      (texture) => {
        texture.flipY = true;
        texture.colorSpace = SRGBColorSpace;
        texture.needsUpdate = true;

        // ── ONE geometry, ONE material, ONE mesh ──
        geometryRef = new SphereGeometry(globeR, 48, 48);
        materialRef = new MeshBasicMaterial({
          map: texture,
          color: 0xfafafa,
          transparent: false,
          opacity: 1,
        });
        const globe = new Mesh(geometryRef, materialRef);
        globeRef = globe;

        // Initial orientation
        globe.rotation.y = rotation.x;
        globe.rotation.x = rotation.y;

        scene.add(globe);
        canvas.style.opacity = "1";

        // ── Single Animation Loop ──
        function animate() {
          animFrameId = requestAnimationFrame(animate);
          if (!isVisible) return;

          // 1. Auto-rotation (only when not dragging and not hover-paused)
          if (!isDragging && (!stopOnHover || !isHovering)) {
            targetRotation.x += rotSpd;
          }

          // 2. Momentum decay after drag release
          if (!isDragging) {
            if (
              Math.abs(velocity.x) > 0.00001 ||
              Math.abs(velocity.y) > 0.00001
            ) {
              targetRotation.x += velocity.x;
              targetRotation.y += velocity.y;
              velocity.x *= 0.92;
              velocity.y *= 0.92;
            }
          }

          // 3. Clamp vertical pitch only (horizontal Y-rotation is unclamped for true 360° continuous rotation)
          const maxPitch = Math.PI / 2.2;
          targetRotation.y = Math.max(
            -maxPitch,
            Math.min(maxPitch, targetRotation.y),
          );

          // 4. Smooth Damping (LERP from current to target)
          rotation.x += (targetRotation.x - rotation.x) * lerpFactor;
          rotation.y += (targetRotation.y - rotation.y) * lerpFactor;

          // 5. Apply to Three.js globe:
          // targetRotation.x -> globe.rotation.y (Horizontal 360°)
          // targetRotation.y -> globe.rotation.x (Vertical pitch)
          globe.rotation.y = rotation.x;
          globe.rotation.x = rotation.y;

          rendererRef!.render(scene, camera);
        }
        animate();
      },
      undefined,
      () => {
        // Fallback: make canvas visible so it doesn't stay hidden
        canvas.style.opacity = "1";
      },
    );

    // ── ResizeObserver ──
    resizeObs = new ResizeObserver(() => {
      const nW = containerEl.clientWidth;
      const nH = containerEl.clientHeight;
      if (!nW || !nH) return;
      camera.aspect = nW / nH;
      camera.updateProjectionMatrix();
      rendererRef!.setSize(nW, nH);
    });
    resizeObs.observe(containerEl);

    // ── IntersectionObserver — stop rendering when off-screen ──
    observerRef = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0 },
    );
    observerRef.observe(containerEl);
  }

  onMount(() => {
    // ≤430px hard guard — no Three.js on small phones
    if (typeof window !== "undefined" && window.innerWidth <= 430) return;
    initGlobe();
  });

  onDestroy(() => {
    // SSR safety guard
    if (typeof window === "undefined") return;

    // Remove window drag listeners if unmounted mid-drag
    window.removeEventListener("pointermove", handlePointerMoveDrag);
    window.removeEventListener("pointerup", handlePointerUp);
    window.removeEventListener("pointercancel", handlePointerUp);

    // Remove container listeners
    containerEl?.removeEventListener("pointerdown", handlePointerDown);
    containerEl?.removeEventListener("pointermove", handlePointerMoveHover);
    containerEl?.removeEventListener("pointerleave", handlePointerLeave);

    // Cancel animation frame
    if (animFrameId !== null) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }

    // Disconnect observers
    observerRef?.disconnect();
    resizeObs?.disconnect();

    // Dispose WebGL resources
    globeRef = null;
    cameraRef = null;
    geometryRef?.dispose();
    materialRef?.map?.dispose();
    materialRef?.dispose();
    rendererRef?.dispose();
  });
</script>

<div
  bind:this={containerEl}
  class="pw-globe-root"
  class:is-dragging={isDragging}
  aria-hidden="true"
></div>

<style>
  .pw-globe-root {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    pointer-events: auto;
    cursor: grab;
    user-select: none;
    touch-action: none;
  }

  .pw-globe-root.is-dragging {
    cursor: grabbing;
  }
</style>
