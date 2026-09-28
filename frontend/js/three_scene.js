/**
 * ContextOS - 3D WebGL Neural Galaxy & Interactive Pipeline Visualizer
 * Powered by Three.js
 */

class GalaxyVisualizer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2(-1000, -1000);

    // Objects & Groups
    this.starfield = null;
    this.nodeGroup = new THREE.Group();
    this.lineGroup = new THREE.Group();
    this.laserGroup = new THREE.Group();
    this.pipelineGroup = new THREE.Group();
    this.queryOrb = null;

    // State
    this.nodes = [];
    this.chunksData = [];
    this.hoveredNode = null;
    this.activeMode = 'galaxy'; // 'galaxy' | 'pipeline'
    this.clock = new THREE.Clock();

    // Document Color Palettes
    this.docColors = [
      0x00f0ff, // Neon Cyan
      0xa855f7, // Cosmic Purple
      0x10b981, // Emerald Green
      0xf59e0b, // Amber Gold
      0xec4899, // Pink Rose
      0x3b82f6  // Royal Blue
    ];

    this.init();
  }

  init() {
    if (!this.canvas) return;

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x05070d, 0.008);

    // 2. Camera
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
    this.camera.position.set(0, 20, 65);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 4. OrbitControls
    if (window.THREE && window.THREE.OrbitControls) {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.maxDistance = 200;
      this.controls.minDistance = 10;
      this.controls.autoRotate = true;
      this.controls.autoRotateSpeed = 0.6;
    }

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00f0ff, 2.5, 150);
    pointLight.position.set(0, 30, 20);
    this.scene.add(pointLight);

    const purpleLight = new THREE.PointLight(0xa855f7, 2.0, 150);
    purpleLight.position.set(-30, -20, -10);
    this.scene.add(purpleLight);

    // 6. Groups
    this.scene.add(this.nodeGroup);
    this.scene.add(this.lineGroup);
    this.scene.add(this.laserGroup);
    this.scene.add(this.pipelineGroup);

    // 7. Background Starfield
    this.createStarfield();

    // 8. Event Listeners
    window.addEventListener('resize', () => this.onWindowResize());
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));
    this.canvas.addEventListener('click', (e) => this.onClick(e));

    // 9. Start Render Loop
    this.animate();
  }

  createStarfield() {
    const starCount = 1500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 350;
      positions[i + 1] = (Math.random() - 0.5) * 350;
      positions[i + 2] = (Math.random() - 0.5) * 350;

      // Subtle cyan & purple stars
      const isCyan = Math.random() > 0.5;
      colors[i] = isCyan ? 0.2 : 0.6;
      colors[i + 1] = isCyan ? 0.8 : 0.3;
      colors[i + 2] = isCyan ? 1.0 : 0.9;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 1.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.7
    });

    this.starfield = new THREE.Points(geometry, material);
    this.scene.add(this.starfield);
  }

  updateChunks(chunks) {
    this.chunksData = chunks;

    // Clear previous nodes & lines
    while (this.nodeGroup.children.length > 0) {
      const obj = this.nodeGroup.children[0];
      this.nodeGroup.remove(obj);
    }
    while (this.lineGroup.children.length > 0) {
      const obj = this.lineGroup.children[0];
      this.lineGroup.remove(obj);
    }

    this.nodes = [];

    // Map doc_id to color
    const docMap = new Map();
    let colorIdx = 0;

    chunks.forEach((chunk) => {
      if (!docMap.has(chunk.doc_id)) {
        docMap.set(chunk.doc_id, this.docColors[colorIdx % this.docColors.length]);
        colorIdx++;
      }
    });

    // Create 3D spheres for each chunk
    const sphereGeo = new THREE.SphereGeometry(1.2, 16, 16);

    chunks.forEach((chunk, i) => {
      const color = docMap.get(chunk.doc_id) || 0x00f0ff;
      const material = new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.5,
        roughness: 0.3,
        metalness: 0.7
      });

      const mesh = new THREE.Mesh(sphereGeo, material);
      mesh.position.set(chunk.x || 0, chunk.y || 0, chunk.z || 0);
      mesh.userData = { chunkIndex: i, chunkData: chunk };

      // Add a subtle outer glow shell
      const glowGeo = new THREE.SphereGeometry(1.7, 12, 12);
      const glowMat = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.2,
        wireframe: true
      });
      const glowMesh = new THREE.Mesh(glowGeo, glowMat);
      mesh.add(glowMesh);

      this.nodeGroup.add(mesh);
      this.nodes.push(mesh);
    });

    // Draw semantic synapse connecting lines between nearby chunks
    this.createSynapseLines();
  }

  createSynapseLines() {
    if (this.nodes.length < 2) return;

    const lineMat = new THREE.LineBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.15
    });

    const linePositions = [];
    const maxConnDist = 16;

    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        const p1 = this.nodes[i].position;
        const p2 = this.nodes[j].position;
        const dist = p1.distanceTo(p2);

        // Connect if close or belonging to same doc
        const sameDoc = this.nodes[i].userData.chunkData.doc_id === this.nodes[j].userData.chunkData.doc_id;
        if (dist < maxConnDist || (sameDoc && dist < maxConnDist * 1.5)) {
          linePositions.push(p1.x, p1.y, p1.z);
          linePositions.push(p2.x, p2.y, p2.z);
        }
      }
    }

    if (linePositions.length > 0) {
      const lineGeo = new THREE.BufferGeometry();
      lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
      const lineMesh = new THREE.LineSegments(lineGeo, lineMat);
      this.lineGroup.add(lineMesh);
    }
  }

  animateQueryRetrieval(retrievedCitations) {
    // Clear old lasers
    while (this.laserGroup.children.length > 0) {
      this.laserGroup.remove(this.laserGroup.children[0]);
    }

    if (!retrievedCitations || retrievedCitations.length === 0) return;

    // Create central query core
    const coreGeo = new THREE.SphereGeometry(2.0, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true
    });
    if (!this.queryOrb) {
      this.queryOrb = new THREE.Mesh(coreGeo, coreMat);
      this.laserGroup.add(this.queryOrb);
    }
    this.queryOrb.position.set(0, 0, 0);

    // Laser conduits to top retrieved chunks
    const laserMat = new THREE.LineBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.85,
      linewidth: 2
    });

    retrievedCitations.forEach((cit) => {
      // Find matching node
      const targetNode = this.nodes.find(n => n.userData.chunkData.chunk_id === cit.chunk_id);
      if (targetNode) {
        const lineGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, 0, 0),
          targetNode.position
        ]);
        const laserLine = new THREE.Line(lineGeo, laserMat);
        this.laserGroup.add(laserLine);

        // Highlight matching node with bright pulse
        targetNode.material.emissiveIntensity = 2.0;
        targetNode.scale.set(1.6, 1.6, 1.6);
        setTimeout(() => {
          if (targetNode && targetNode.material) {
            targetNode.material.emissiveIntensity = 0.5;
            targetNode.scale.set(1.0, 1.0, 1.0);
          }
        }, 3000);
      }
    });

    // Gently pan camera to encompass query & retrieved nodes
    if (this.controls) {
      this.controls.autoRotate = false;
    }
  }

  resetCamera() {
    if (this.camera && this.controls) {
      this.camera.position.set(0, 20, 65);
      this.controls.target.set(0, 0, 0);
      this.controls.autoRotate = true;
    }
  }

  toggleAutoRotate(state) {
    if (this.controls) {
      this.controls.autoRotate = state !== undefined ? state : !this.controls.autoRotate;
    }
  }

  onMouseMove(event) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Raycast on nodes
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.nodes);

    if (intersects.length > 0) {
      const node = intersects[0].object;
      if (this.hoveredNode !== node) {
        if (this.hoveredNode) {
          this.hoveredNode.scale.set(1.0, 1.0, 1.0);
        }
        this.hoveredNode = node;
        this.hoveredNode.scale.set(1.4, 1.4, 1.4);
        document.body.style.cursor = 'pointer';

        // Trigger tooltip event
        const chunk = node.userData.chunkData;
        if (window.onChunkHover) {
          window.onChunkHover(chunk, event.clientX, event.clientY);
        }
      }
    } else {
      if (this.hoveredNode) {
        this.hoveredNode.scale.set(1.0, 1.0, 1.0);
        this.hoveredNode = null;
        document.body.style.cursor = 'default';
        if (window.onChunkLeave) {
          window.onChunkLeave();
        }
      }
    }
  }

  onClick(event) {
    if (this.hoveredNode && window.onChunkClick) {
      window.onChunkClick(this.hoveredNode.userData.chunkData);
    }
  }

  onWindowResize() {
    if (!this.camera || !this.renderer) return;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();

    // Slowly rotate starfield
    if (this.starfield) {
      this.starfield.rotation.y += 0.0003;
    }

    // Slowly oscillate query orb
    if (this.queryOrb) {
      this.queryOrb.rotation.y += 0.02;
      this.queryOrb.rotation.x += 0.01;
    }

    if (this.controls) {
      this.controls.update();
    }

    this.renderer.render(this.scene, this.camera);
  }
}

// Simple Web Audio Sci-Fi Sound Synthesizer
class SoundFX {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  }

  playClick() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.06);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch (e) {}
  }

  playBeam() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.2);
    } catch (e) {}
  }
}

window.soundFX = new SoundFX();
