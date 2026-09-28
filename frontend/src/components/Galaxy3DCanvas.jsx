import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Galaxy3DCanvas({ chunks = [], activeCitations = [], onSelectChunk }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const nodesRef = useRef([]);
  const laserGroupRef = useRef(null);
  const controlsRef = useRef(null);

  const docColors = [
    0x00f0ff, // Cyan
    0xa855f7, // Violet
    0x10b981, // Emerald
    0xf59e0b, // Amber
    0xec4899, // Pink
    0x3b82f6  // Blue
  ];

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05070f, 0.006);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 20, 65);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 3. Simple Manual Orbit Drag Controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let spherical = { radius: 65, theta: 0, phi: Math.PI / 3 };
    let autoRotate = true;

    const updateCameraFromSpherical = () => {
      camera.position.x = spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta);
      camera.position.y = spherical.radius * Math.cos(spherical.phi);
      camera.position.z = spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta);
      camera.lookAt(0, 0, 0);
    };

    container.addEventListener('mousedown', (e) => {
      isDragging = true;
      autoRotate = false;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      spherical.theta -= deltaX * 0.008;
      spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi - deltaY * 0.008));

      updateCameraFromSpherical();
      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    container.addEventListener('wheel', (e) => {
      e.preventDefault();
      spherical.radius = Math.max(15, Math.min(180, spherical.radius + e.deltaY * 0.05));
      updateCameraFromSpherical();
    }, { passive: false });

    // 4. Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const cyanLight = new THREE.PointLight(0x00f0ff, 2.0, 100);
    cyanLight.position.set(20, 30, 20);
    scene.add(cyanLight);

    const purpleLight = new THREE.PointLight(0xa855f7, 2.0, 100);
    purpleLight.position.set(-20, -20, -20);
    scene.add(purpleLight);

    // 5. Starfield Background
    const starCount = 1200;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
      starPos[i] = (Math.random() - 0.5) * 300;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ size: 1.0, color: 0x7dd3fc, transparent: true, opacity: 0.4 });
    const starfield = new THREE.Points(starGeo, starMat);
    scene.add(starfield);

    // 6. Laser Group for Query Targeting
    const laserGroup = new THREE.Group();
    scene.add(laserGroup);
    laserGroupRef.current = laserGroup;

    // 7. Raycaster for Selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    container.addEventListener('click', (e) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
      mouse.y = -(((e.clientY - rect.top) / container.clientHeight) * 2 - 1);

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodesRef.current);
      if (intersects.length > 0) {
        const clickedMesh = intersects[0].object;
        if (onSelectChunk && clickedMesh.userData.chunk) {
          onSelectChunk(clickedMesh.userData.chunk);
        }
      }
    });

    // 8. Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // 9. Animation Loop
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (autoRotate) {
        spherical.theta += 0.003;
        updateCameraFromSpherical();
      }

      starfield.rotation.y += 0.0003;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update nodes when chunks change
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Remove existing nodes
    nodesRef.current.forEach((m) => scene.remove(m));
    nodesRef.current = [];

    // Map doc_id to colors
    const docMap = new Map();
    let cIdx = 0;
    chunks.forEach((c) => {
      if (!docMap.has(c.doc_id)) {
        docMap.set(c.doc_id, docColors[cIdx % docColors.length]);
        cIdx++;
      }
    });

    const sphereGeo = new THREE.SphereGeometry(1.2, 16, 16);

    chunks.forEach((chunk) => {
      const color = docMap.get(chunk.doc_id) || 0x00f0ff;
      const mat = new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.6,
        roughness: 0.2
      });
      const mesh = new THREE.Mesh(sphereGeo, mat);
      mesh.position.set(chunk.x || 0, chunk.y || 0, chunk.z || 0);
      mesh.userData = { chunk };

      // Outer glow shell
      const glowGeo = new THREE.SphereGeometry(1.7, 12, 12);
      const glowMat = new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: 0.25 });
      mesh.add(new THREE.Mesh(glowGeo, glowMat));

      scene.add(mesh);
      nodesRef.current.push(mesh);
    });
  }, [chunks]);

  // Animate lasers on active citations
  useEffect(() => {
    const laserGroup = laserGroupRef.current;
    if (!laserGroup) return;

    while (laserGroup.children.length > 0) {
      laserGroup.remove(laserGroup.children[0]);
    }

    if (!activeCitations || activeCitations.length === 0) return;

    // Central query sphere
    const queryGeo = new THREE.SphereGeometry(2.0, 16, 16);
    const queryMat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
    const queryMesh = new THREE.Mesh(queryGeo, queryMat);
    laserGroup.add(queryMesh);

    // Connect lasers to retrieved nodes
    const laserMat = new THREE.LineBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.8 });

    activeCitations.forEach((cit) => {
      const target = nodesRef.current.find((m) => m.userData.chunk?.chunk_id === cit.chunk_id);
      if (target) {
        const lineGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, 0, 0),
          target.position
        ]);
        laserGroup.add(new THREE.Line(lineGeo, laserMat));

        // Flash target
        target.material.emissiveIntensity = 2.0;
        target.scale.set(1.5, 1.5, 1.5);
        setTimeout(() => {
          if (target && target.material) {
            target.material.emissiveIntensity = 0.6;
            target.scale.set(1.0, 1.0, 1.0);
          }
        }, 3000);
      }
    });
  }, [activeCitations]);

  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <div ref={mountRef} className="w-full h-full" />
      <div className="absolute bottom-4 left-4 glass-panel px-3 py-1.5 rounded-full text-xs font-mono text-cyan-400 border border-cyan-500/30 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
        Click & Drag to Orbit | Scroll to Zoom | Click Node to Inspect
      </div>
    </div>
  );
}
