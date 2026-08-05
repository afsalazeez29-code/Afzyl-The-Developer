<script lang="ts">
  import {
    AdditiveBlending,
    BufferAttribute,
    BufferGeometry,
    Clock,
    DataTexture,
    FloatType,
    GLSL3,
    Mesh,
    MeshBasicMaterial,
    NearestFilter,
    OrthographicCamera,
    PerspectiveCamera,
    PlaneGeometry,
    Points,
    Raycaster,
    RGBAFormat,
    Scene,
    ShaderMaterial,
    Vector2,
    WebGLRenderer,
    WebGLRenderTarget
  } from 'three';
  import gsap from 'gsap';

  const SIMULATION_SIZE = 256;
  const SIMULATION_PARTICLES = SIMULATION_SIZE * SIMULATION_SIZE;
  const FIELD_HALF_SIZE = 0.225;
  const MESH_SCALE = 5;

  let canvas: HTMLCanvasElement;
  let root: HTMLElement;
  let failed = $state(false);

  const passVertexShader = /* glsl */ `
    out vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = vec4(position.xy, 0.0, 1.0);
    }
  `;

  const copyFragmentShader = /* glsl */ `
    precision highp float;
    uniform sampler2D uPositionTexture;
    uniform sampler2D uVelocityTexture;
    in vec2 vUv;
    layout(location = 0) out vec4 outPosition;
    layout(location = 1) out vec4 outVelocity;

    void main() {
      outPosition = texture(uPositionTexture, vUv);
      outVelocity = texture(uVelocityTexture, vUv);
    }
  `;

  const simulationFragmentShader = /* glsl */ `
    precision highp float;

    uniform sampler2D uPositionState;
    uniform sampler2D uVelocityState;
    uniform sampler2D uOrigins;
    uniform vec2 uPointer;
    uniform float uPointerActivity;
    uniform float uTime;
    uniform float uDelta;
    uniform float uMotion;
    in vec2 vUv;
    layout(location = 0) out vec4 outPosition;
    layout(location = 1) out vec4 outVelocity;

    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

    float snoise(vec3 v) {
      const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      i = mod289(i);
      vec4 p = permute(permute(permute(
        i.z + vec4(0.0, i1.z, i2.z, 1.0)) +
        i.y + vec4(0.0, i1.y, i2.y, 1.0)) +
        i.x + vec4(0.0, i1.x, i2.x, 1.0));
      float n_ = 0.142857142857;
      vec3 ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);
      vec4 x = x_ * ns.x + ns.yyyy;
      vec4 y = y_ * ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);
      vec4 s0 = floor(b0) * 2.0 + 1.0;
      vec4 s1 = floor(b1) * 2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m *= m;
      return 42.0 * dot(m * m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }

    void main() {
      vec4 previous = texture(uPositionState, vUv);
      vec4 velocityData = texture(uVelocityState, vUv);
      vec4 originData = texture(uOrigins, vUv);
      vec2 position = previous.xy;
      vec2 origin = originData.xy;
      vec2 velocity = velocityData.xy;
      float scale = previous.b;
      float dt = min(uDelta, 0.033);

      vec2 noisePosition = position + origin * 0.38;
      float largeNoiseX = snoise(vec3(noisePosition * 7.0 + vec2(4.1, 1.7), uTime * 0.045));
      float largeNoiseY = snoise(vec3(noisePosition * 7.0 + vec2(-2.8, 6.3), uTime * 0.045));
      float mediumNoiseX = snoise(vec3(noisePosition * 23.0 + vec2(8.4, -3.2), uTime * 0.08));
      float mediumNoiseY = snoise(vec3(noisePosition * 23.0 + vec2(-5.1, 9.6), uTime * 0.08));
      float fineNoiseX = snoise(vec3(noisePosition * 67.0 + vec2(2.6, 7.3), uTime * 0.13));
      float fineNoiseY = snoise(vec3(noisePosition * 67.0 + vec2(-9.7, -1.4), uTime * 0.13));

      vec2 flow = vec2(
        largeNoiseX * 0.56 + mediumNoiseX * 0.31 + fineNoiseX * 0.13,
        largeNoiseY * 0.56 + mediumNoiseY * 0.31 + fineNoiseY * 0.13
      );
      flow += vec2(
        sin(uTime * 0.17 + origin.y * 18.0),
        cos(uTime * 0.14 + origin.x * 17.0)
      ) * 0.16;

      vec2 fromPointer = position - uPointer;
      float pointerDistance = length(fromPointer);
      vec2 radialDirection = fromPointer / max(pointerDistance, 0.00001);
      float animatedRadius = 0.047 + sin(uTime * 0.72) * 0.0028 + cos(uTime * 0.39) * 0.0018;
      float ringWidth = 0.034;
      float secondaryWidth = 0.012;
      float ringDistance = abs(pointerDistance - animatedRadius);
      float outerRing = 1.0 - smoothstep(ringWidth * 0.42, ringWidth, ringDistance);
      float innerDistance = abs(pointerDistance - (animatedRadius - secondaryWidth * 0.72));
      float innerRing = 1.0 - smoothstep(secondaryWidth * 0.22, secondaryWidth, innerDistance);
      float innerFill = 1.0 - smoothstep(0.0, animatedRadius * 0.82, pointerDistance);
      float ringInfluence = (outerRing * 0.56 + innerRing * 0.82 + innerFill * 0.14) * uPointerActivity;

      vec2 homeForce = (origin - position) * mix(2.1, 1.45, ringInfluence);
      vec2 ringForce = radialDirection * ringInfluence * 0.085;
      vec2 driftForce = flow * 0.016 * uMotion;
      vec2 acceleration = homeForce + ringForce + driftForce;

      float damping = exp(-dt * mix(3.4, 2.55, ringInfluence));
      velocity = velocity * damping + acceleration * dt;
      float rawSpeed = length(velocity);
      float maxSpeed = mix(0.034, 0.072, ringInfluence);
      if (rawSpeed > maxSpeed) velocity *= maxSpeed / rawSpeed;
      position += velocity * dt * mix(0.25, 1.0, uMotion);

      vec2 displacement = position - origin;
      float displacementLength = length(displacement);
      const float maxDisplacement = 0.046;
      if (displacementLength > maxDisplacement) {
        vec2 normal = displacement / max(displacementLength, 0.00001);
        position = origin + normal * maxDisplacement;
        velocity -= normal * max(dot(velocity, normal), 0.0) * 0.82;
      }

      float speed = clamp(length(velocity) / 0.072, 0.0, 1.0);

      float targetScale = originData.b * (1.0 + ringInfluence * 0.72 + speed * 0.12);
      scale = mix(scale, targetScale, 1.0 - exp(-dt * 4.0));
      outPosition = vec4(position, scale, speed);
      outVelocity = vec4(velocity, 0.0, 1.0);
    }
  `;

  const renderVertexShader = /* glsl */ `
    precision highp float;

    attribute vec2 aReference;
    uniform sampler2D uState;
    uniform vec2 uPointer;
    uniform float uPixelRatio;
    uniform float uParticleScale;
    uniform float uTime;

    varying float vAngle;
    varying float vSpeed;
    varying float vBrightness;

    float hash21(vec2 p) {
      p = fract(p * vec2(123.34, 456.21));
      p += dot(p, p + 45.32);
      return fract(p.x * p.y);
    }

    void main() {
      vec4 state = texture2D(uState, aReference);
      vec3 particlePosition = vec3(state.xy, 0.0);
      vec2 radial = state.xy - uPointer;
      float baseAngle = atan(radial.y, radial.x);
      float rotationalNoise = (hash21(aReference) - 0.5) * 0.42;

      vec4 viewPosition = modelViewMatrix * vec4(particlePosition, 1.0);
      gl_Position = projectionMatrix * viewPosition;
      gl_PointSize = clamp(
        state.b * uParticleScale * 7.5 * uPixelRatio * (3.1 / max(1.0, -viewPosition.z)),
        1.2 * uPixelRatio,
        11.0 * uPixelRatio
      );

      vAngle = baseAngle + rotationalNoise + sin(uTime * 0.11 + hash21(aReference) * 6.2831) * 0.08;
      vSpeed = state.a;
      vBrightness = 0.34 + hash21(aReference + 0.31) * 0.34 + state.a * 0.52;
    }
  `;

  const renderFragmentShader = /* glsl */ `
    precision highp float;

    varying float vAngle;
    varying float vSpeed;
    varying float vBrightness;

    float roundedBoxSdf(vec2 point, vec2 halfSize, float radius) {
      vec2 q = abs(point) - halfSize + radius;
      return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - radius;
    }

    void main() {
      vec2 point = gl_PointCoord - 0.5;
      float c = cos(vAngle);
      float s = sin(vAngle);
      point = mat2(c, -s, s, c) * point;

      float dashLength = mix(0.30, 0.43, clamp(vSpeed, 0.0, 1.0));
      float distanceToDash = roundedBoxSdf(point, vec2(dashLength, 0.105), 0.09);
      float core = 1.0 - smoothstep(-0.018, 0.035, distanceToDash);
      float glow = (1.0 - smoothstep(0.02, 0.23, distanceToDash)) * 0.24;

      if (core + glow < 0.025) discard;

      vec3 deepBlue = vec3(0.15, 0.34, 0.82);
      vec3 iceWhite = vec3(0.84, 0.92, 1.0);
      vec3 color = mix(deepBlue, iceWhite, clamp(vSpeed * 0.82 + vBrightness * 0.28, 0.0, 1.0));
      float alpha = (core * 0.72 + glow) * clamp(vBrightness, 0.24, 1.0);
      gl_FragColor = vec4(color, alpha);
    }
  `;

  const createSeededRandom = (seed = 0x6d2b79f5) => {
    let value = seed >>> 0;
    return () => {
      value += 0x6d2b79f5;
      let result = value;
      result = Math.imul(result ^ (result >>> 15), result | 1);
      result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
      return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
    };
  };

  const generatePoissonPoints = (count: number) => {
    const random = createSeededRandom();
    const min = -FIELD_HALF_SIZE;
    const width = FIELD_HALF_SIZE * 2;
    const minimumDistance = 0.00092;
    const cellSize = minimumDistance / Math.SQRT2;
    const gridSize = Math.ceil(width / cellSize);
    const grid = new Int32Array(gridSize * gridSize);
    grid.fill(-1);
    const points = new Float32Array(count * 2);
    const active = new Int32Array(count);
    let pointCount = 1;
    let activeCount = 1;

    points[0] = 0;
    points[1] = 0;
    active[0] = 0;
    grid[Math.floor(FIELD_HALF_SIZE / cellSize) * gridSize + Math.floor(FIELD_HALF_SIZE / cellSize)] = 0;

    const fits = (x: number, y: number) => {
      const gridX = Math.floor((x - min) / cellSize);
      const gridY = Math.floor((y - min) / cellSize);
      for (let offsetY = -2; offsetY <= 2; offsetY += 1) {
        for (let offsetX = -2; offsetX <= 2; offsetX += 1) {
          const neighbourX = gridX + offsetX;
          const neighbourY = gridY + offsetY;
          if (neighbourX < 0 || neighbourY < 0 || neighbourX >= gridSize || neighbourY >= gridSize) continue;
          const neighbour = grid[neighbourY * gridSize + neighbourX];
          if (neighbour < 0) continue;
          const dx = points[neighbour * 2] - x;
          const dy = points[neighbour * 2 + 1] - y;
          if (dx * dx + dy * dy < minimumDistance * minimumDistance) return false;
        }
      }
      return true;
    };

    while (activeCount > 0 && pointCount < count) {
      const activeSlot = Math.floor(random() * activeCount);
      const parentIndex = active[activeSlot];
      const parentX = points[parentIndex * 2];
      const parentY = points[parentIndex * 2 + 1];
      let accepted = false;

      for (let attempt = 0; attempt < 20; attempt += 1) {
        const angle = random() * Math.PI * 2;
        const distance = minimumDistance * (1 + random());
        const x = parentX + Math.cos(angle) * distance;
        const y = parentY + Math.sin(angle) * distance;
        if (x < min || y < min || x > FIELD_HALF_SIZE || y > FIELD_HALF_SIZE || !fits(x, y)) continue;

        points[pointCount * 2] = x;
        points[pointCount * 2 + 1] = y;
        active[activeCount++] = pointCount;
        const gridX = Math.floor((x - min) / cellSize);
        const gridY = Math.floor((y - min) / cellSize);
        grid[gridY * gridSize + gridX] = pointCount;
        pointCount += 1;
        accepted = true;
        break;
      }

      if (!accepted) {
        active[activeSlot] = active[activeCount - 1];
        activeCount -= 1;
      }
    }

    while (pointCount < count) {
      points[pointCount * 2] = min + random() * width;
      points[pointCount * 2 + 1] = min + random() * width;
      pointCount += 1;
    }

    // Bridson sampling grows outward from its seed. Shuffle the completed set so
    // adaptive draw counts remain spatially uniform rather than centre-weighted.
    for (let index = count - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(random() * (index + 1));
      const x = points[index * 2];
      const y = points[index * 2 + 1];
      points[index * 2] = points[swapIndex * 2];
      points[index * 2 + 1] = points[swapIndex * 2 + 1];
      points[swapIndex * 2] = x;
      points[swapIndex * 2 + 1] = y;
    }

    return { points, random };
  };

  $effect(() => {
    if (!canvas || !root) return;

    let renderer: WebGLRenderer | undefined;
    let renderGeometry: BufferGeometry | undefined;
    let renderMaterial: ShaderMaterial | undefined;
    let simulationGeometry: PlaneGeometry | undefined;
    let simulationMaterial: ShaderMaterial | undefined;
    let copyMaterial: ShaderMaterial | undefined;
    let originTexture: DataTexture | undefined;
    let initialPositionTexture: DataTexture | undefined;
    let initialVelocityTexture: DataTexture | undefined;
    let raycastGeometry: PlaneGeometry | undefined;
    let raycastMaterial: MeshBasicMaterial | undefined;
    let targetA: WebGLRenderTarget | undefined;
    let targetB: WebGLRenderTarget | undefined;
    let frame = 0;
    let running = false;
    let inView = true;
    let destroyed = false;
    let entrance: gsap.core.Tween | undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
    const clock = new Clock();
    const pointerNdc = new Vector2(0, 0);
    const pointerTarget = new Vector2(0, 0);
    const pointer = new Vector2(0, 0);
    const raycaster = new Raycaster();
    const pointerActivity = { current: reduceMotion ? 0 : 0.22, target: reduceMotion ? 0 : 0.22 };

    try {
      renderer = new WebGLRenderer({
        canvas,
        alpha: true,
        antialias: false,
        powerPreference: 'high-performance'
      });
      const gl = renderer.getContext();
      if (!renderer.capabilities.isWebGL2 || !gl.getExtension('EXT_color_buffer_float')) {
        throw new Error('Floating-point render targets are unavailable.');
      }
    } catch {
      renderer?.dispose();
      failed = true;
      return;
    }

    const scene = new Scene();
    const camera = new PerspectiveCamera(40, 1, 0.1, 20);
    camera.position.z = 3.1;

    const simulationScene = new Scene();
    const simulationCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    simulationGeometry = new PlaneGeometry(2, 2);

    const poisson = generatePoissonPoints(SIMULATION_PARTICLES);
    const originData = new Float32Array(SIMULATION_PARTICLES * 4);
    const velocityData = new Float32Array(SIMULATION_PARTICLES * 4);
    for (let index = 0; index < SIMULATION_PARTICLES; index += 1) {
      originData[index * 4] = poisson.points[index * 2];
      originData[index * 4 + 1] = poisson.points[index * 2 + 1];
      originData[index * 4 + 2] = 0.58 + poisson.random() * 0.48;
      originData[index * 4 + 3] = 0;
      velocityData[index * 4] = 0;
      velocityData[index * 4 + 1] = 0;
      velocityData[index * 4 + 2] = 0;
      velocityData[index * 4 + 3] = 1;
    }

    originTexture = new DataTexture(originData, SIMULATION_SIZE, SIMULATION_SIZE, RGBAFormat, FloatType);
    originTexture.minFilter = NearestFilter;
    originTexture.magFilter = NearestFilter;
    originTexture.needsUpdate = true;
    initialPositionTexture = originTexture.clone();
    initialPositionTexture.needsUpdate = true;
    initialVelocityTexture = new DataTexture(velocityData, SIMULATION_SIZE, SIMULATION_SIZE, RGBAFormat, FloatType);
    initialVelocityTexture.minFilter = NearestFilter;
    initialVelocityTexture.magFilter = NearestFilter;
    initialVelocityTexture.needsUpdate = true;

    const renderTargetOptions = {
      type: FloatType,
      format: RGBAFormat,
      minFilter: NearestFilter,
      magFilter: NearestFilter,
      depthBuffer: false,
      stencilBuffer: false,
      count: 2
    };
    targetA = new WebGLRenderTarget(SIMULATION_SIZE, SIMULATION_SIZE, renderTargetOptions);
    targetB = new WebGLRenderTarget(SIMULATION_SIZE, SIMULATION_SIZE, renderTargetOptions);

    copyMaterial = new ShaderMaterial({
      glslVersion: GLSL3,
      vertexShader: passVertexShader,
      fragmentShader: copyFragmentShader,
      uniforms: {
        uPositionTexture: { value: initialPositionTexture },
        uVelocityTexture: { value: initialVelocityTexture }
      },
      depthTest: false,
      depthWrite: false
    });
    const simulationQuad = new Mesh(simulationGeometry, copyMaterial);
    simulationScene.add(simulationQuad);
    renderer.setRenderTarget(targetA);
    renderer.render(simulationScene, simulationCamera);
    renderer.setRenderTarget(targetB);
    renderer.render(simulationScene, simulationCamera);
    renderer.setRenderTarget(null);
    initialPositionTexture.dispose();
    initialVelocityTexture.dispose();
    initialPositionTexture = undefined;
    initialVelocityTexture = undefined;

    simulationMaterial = new ShaderMaterial({
      glslVersion: GLSL3,
      vertexShader: passVertexShader,
      fragmentShader: simulationFragmentShader,
      uniforms: {
        uPositionState: { value: targetA.textures[0] },
        uVelocityState: { value: targetA.textures[1] },
        uOrigins: { value: originTexture },
        uPointer: { value: pointer },
        uPointerActivity: { value: pointerActivity.current },
        uTime: { value: 0 },
        uDelta: { value: 0.016 },
        uMotion: { value: reduceMotion ? 0.06 : coarsePointer ? 0.62 : 1 }
      },
      depthTest: false,
      depthWrite: false
    });
    simulationQuad.material = simulationMaterial;
    copyMaterial.dispose();
    copyMaterial = undefined;

    const desktopCount = 220 * 220;
    const renderedParticleCount = window.innerWidth >= 1100
      ? desktopCount
      : window.innerWidth >= 700
        ? 180 * 180
        : 120 * 120;
    const references = new Float32Array(renderedParticleCount * 2);
    for (let index = 0; index < renderedParticleCount; index += 1) {
      references[index * 2] = (index % SIMULATION_SIZE + 0.5) / SIMULATION_SIZE;
      references[index * 2 + 1] = (Math.floor(index / SIMULATION_SIZE) + 0.5) / SIMULATION_SIZE;
    }

    renderGeometry = new BufferGeometry();
    renderGeometry.setAttribute('position', new BufferAttribute(new Float32Array(renderedParticleCount * 3), 3));
    renderGeometry.setAttribute('aReference', new BufferAttribute(references, 2));
    renderMaterial = new ShaderMaterial({
      vertexShader: renderVertexShader,
      fragmentShader: renderFragmentShader,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      uniforms: {
        uState: { value: targetA.textures[0] },
        uPointer: { value: pointer },
        uPixelRatio: { value: 1 },
        uParticleScale: { value: 0.65 },
        uTime: { value: 0 }
      }
    });

    const particleMesh = new Points(renderGeometry, renderMaterial);
    particleMesh.frustumCulled = false;
    scene.add(particleMesh);

    raycastGeometry = new PlaneGeometry(12.5, 12.5);
    raycastMaterial = new MeshBasicMaterial({ visible: false });
    const raycastPlane = new Mesh(raycastGeometry, raycastMaterial);
    raycastPlane.updateMatrixWorld(true);

    let readTarget = targetA;
    let writeTarget = targetB;

    const resize = () => {
      if (!renderer || !renderMaterial) return;
      const bounds = root.getBoundingClientRect();
      const width = Math.max(1, bounds.width);
      const height = Math.max(1, bounds.height);
      const aspect = width / height;
      const pixelRatio = Math.min(window.devicePixelRatio, coarsePointer ? 1.35 : 2);

      camera.aspect = aspect;
      camera.updateProjectionMatrix();
      particleMesh.scale.set(MESH_SCALE * aspect, MESH_SCALE, MESH_SCALE);
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(width, height, false);
      renderMaterial.uniforms.uPixelRatio.value = pixelRatio;
      if (reduceMotion) {
        renderMaterial.uniforms.uState.value = readTarget.textures[0];
        renderer.setRenderTarget(null);
        renderer.render(scene, camera);
      }
    };

    const updatePointerTarget = () => {
      raycaster.setFromCamera(pointerNdc, camera);
      const hit = raycaster.intersectObject(raycastPlane, false)[0];
      if (!hit) return;
      const aspect = Math.max(0.0001, camera.aspect);
      pointerTarget.set(hit.point.x / (MESH_SCALE * aspect), hit.point.y / MESH_SCALE);
    };

    const handlePointer = (event: PointerEvent) => {
      if (reduceMotion) return;
      const bounds = root.getBoundingClientRect();
      const inside = event.clientX >= bounds.left && event.clientX <= bounds.right &&
        event.clientY >= bounds.top && event.clientY <= bounds.bottom;
      if (!inside) {
        pointerActivity.target = 0.22;
        return;
      }
      pointerNdc.set(
        (event.clientX - bounds.left) / bounds.width * 2 - 1,
        -((event.clientY - bounds.top) / bounds.height * 2 - 1)
      );
      updatePointerTarget();
      pointerActivity.target = coarsePointer ? 0.68 : 1;
    };

    const handlePointerLeave = () => {
      pointerActivity.target = reduceMotion ? 0 : 0.22;
    };

    const tick = () => {
      if (!renderer || !simulationMaterial || !renderMaterial || destroyed) return;
      const delta = Math.min(clock.getDelta(), 0.033);
      const elapsed = clock.elapsedTime;
      const pointerLerp = pointerActivity.target > 0.3 ? 0.02 : 0.01;
      pointer.lerp(pointerTarget, pointerLerp);
      pointerActivity.current += (pointerActivity.target - pointerActivity.current) * 0.025;

      simulationMaterial.uniforms.uPositionState.value = readTarget.textures[0];
      simulationMaterial.uniforms.uVelocityState.value = readTarget.textures[1];
      simulationMaterial.uniforms.uPointer.value.copy(pointer);
      simulationMaterial.uniforms.uPointerActivity.value = pointerActivity.current;
      simulationMaterial.uniforms.uTime.value = elapsed;
      simulationMaterial.uniforms.uDelta.value = delta;
      renderer.setRenderTarget(writeTarget);
      renderer.render(simulationScene, simulationCamera);
      renderer.setRenderTarget(null);

      const previousReadTarget = readTarget;
      readTarget = writeTarget;
      writeTarget = previousReadTarget;
      renderMaterial.uniforms.uState.value = readTarget.textures[0];
      renderMaterial.uniforms.uPointer.value.copy(pointer);
      renderMaterial.uniforms.uTime.value = elapsed;
      renderer.render(scene, camera);
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running || destroyed || !inView || document.hidden) return;
      if (reduceMotion) {
        renderMaterial!.uniforms.uState.value = readTarget.textures[0];
        renderer!.setRenderTarget(null);
        renderer!.render(scene, camera);
        return;
      }
      running = true;
      clock.start();
      frame = requestAnimationFrame(tick);
    };

    const stop = () => {
      if (!running) return;
      running = false;
      cancelAnimationFrame(frame);
      clock.stop();
    };

    const syncActivity = () => {
      if (document.hidden || !inView) stop();
      else start();
    };

    const observer = new IntersectionObserver(([entry]) => {
      inView = entry?.isIntersecting ?? false;
      syncActivity();
    }, { threshold: 0.01 });

    const handleContextLoss = (event: Event) => {
      event.preventDefault();
      stop();
      failed = true;
    };

    resize();
    updatePointerTarget();
    observer.observe(root);
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', handlePointer, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave);
    document.addEventListener('visibilitychange', syncActivity);
    canvas.addEventListener('webglcontextlost', handleContextLoss);
    entrance = gsap.fromTo(canvas, { opacity: 0 }, {
      opacity: 1,
      duration: reduceMotion ? 0 : 1.2,
      ease: 'power2.out'
    });
    start();

    return () => {
      destroyed = true;
      stop();
      entrance?.kill();
      observer.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointer);
      window.removeEventListener('pointerleave', handlePointerLeave);
      document.removeEventListener('visibilitychange', syncActivity);
      canvas.removeEventListener('webglcontextlost', handleContextLoss);
      renderGeometry?.dispose();
      renderMaterial?.dispose();
      simulationGeometry?.dispose();
      simulationMaterial?.dispose();
      copyMaterial?.dispose();
      originTexture?.dispose();
      initialPositionTexture?.dispose();
      initialVelocityTexture?.dispose();
      raycastGeometry?.dispose();
      raycastMaterial?.dispose();
      targetA?.dispose();
      targetB?.dispose();
      renderer?.dispose();
    };
  });
</script>

<section bind:this={root} class:fallback={failed} class="particle-field" aria-label="Interactive anti-gravity particle field">
  <canvas bind:this={canvas} aria-hidden="true"></canvas>
  <div class="fallback-field" aria-hidden="true"></div>
  <div class="lab-chrome" aria-hidden="true">
    <p>Particle Study / 002</p>
    <p>Move your pointer</p>
    <span>GPU Feedback × GLSL</span>
  </div>
</section>

<style lang="scss">
  .particle-field {
    position: relative;
    width: 100%;
    height: 100svh;
    min-height: 32rem;
    overflow: hidden;
    isolation: isolate;
    background:
      radial-gradient(circle at 50% 48%, rgba(17, 34, 72, 0.2), transparent 42%),
      linear-gradient(140deg, #020308 0%, #050814 48%, #020308 100%);
  }

  canvas,
  .fallback-field {
    position: absolute;
    inset: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  .fallback-field {
    display: none;
    background-image:
      radial-gradient(circle at 50% 48%, rgba(64, 112, 235, 0.16), transparent 27%),
      radial-gradient(circle, rgba(101, 151, 255, 0.46) 0 0.7px, transparent 1px);
    background-size: auto, 11px 13px;
    mask-image: radial-gradient(circle at 50% 48%, black, transparent 74%);
  }

  .fallback canvas { display: none; }
  .fallback .fallback-field { display: block; }

  .lab-chrome {
    position: absolute;
    z-index: 2;
    inset: 0;
    padding: clamp(1.25rem, 3vw, 3rem);
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-rows: auto 1fr auto;
    color: rgba(224, 234, 255, 0.58);
    pointer-events: none;
    font: 400 0.62rem/1.3 'DM Mono', monospace;
    letter-spacing: 0.13em;
    text-transform: uppercase;
  }

  .lab-chrome p { margin: 0; }
  .lab-chrome p:nth-child(2) { text-align: right; }
  .lab-chrome span { grid-row: 3; grid-column: 1 / -1; align-self: end; }

  @media (max-width: 700px) {
    .lab-chrome { font-size: 0.54rem; }
  }
</style>
