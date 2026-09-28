import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Compass, RotateCw, ZoomIn, Eye, Sparkles, Filter, Shield } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export default function Interactive3DKnowledgeMap({ chunks = [], onSelectChunk }) {
  const mountRef = useRef(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [clusterFilter, setClusterFilter] = useState('ALL');
  const [orbitSpeed, setOrbitSpeed] = useState(0.003);
  const [spatialSpread, setSpatialSpread] = useState(1.2);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);

  // Generate synthetic sample nodes if chunks empty
  const activeNodes = (chunks && chunks.length > 0) ? chunks : [
    { chunk_id: 'c1', doc_name: 'Academic_RAG_Survey.pdf', page: 4, x: -15, y: 12, z: 8, snippet: 'Dense vector retrieval over unstructured text preserves semantic hierarchies without keyword mismatch.', category: 'ACADEMIC' },
    { chunk_id: 'c2', doc_name: 'Academic_RAG_Survey.pdf', page: 9, x: -12, y: 8, z: 14, snippet: 'Recursive character windowing with 120-char boundary overlap prevents token truncation at period separators.', category: 'ACADEMIC' },
    { chunk_id: 'c3', doc_name: 'AirGap_Security_Spec.docx', page: 2, x: 18, y: -10, z: -8, snippet: 'Local inference ensures 0 outbound WAN packets. Model weights remain memory-pinned in local VRAM.', category: 'SECURITY' },
    { chunk_id: 'c4', doc_name: 'AirGap_Security_Spec.docx', page: 7, x: 14, y: -14, z: -4, snippet: 'Physical hardware killswitches isolate the loopback bus from external network interface cards.', category: 'SECURITY' },
    { chunk_id: 'c5', doc_name: 'Financial_Q3_Balance.csv', page: 1, x: 2, y: 18, z: -16, snippet: 'Gross operating margin increased 24.8% due to complete elimination of remote per-token cloud API billing.', category: 'FINANCIAL' },
    { chunk_id: 'c6', doc_name: 'Vector_DMA_Conduit.rs', page: 3, x: -8, y: -16, z: 12, snippet: 'Direct memory access pipeline streams IEEE 754 float32 embeddings directly into the cosine dot product unit.', category: 'ENGINE' },
    { chunk_id: 'c7', doc_name: 'Vector_DMA_Conduit.rs', page: 8, x: -4, y: -18, z: 6, snippet: 'Zero-copy memory mapped ring buffer sustains sub-millisecond nearest neighbor search over 100k vectors.', category: 'ENGINE' }
  ];

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 420;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 15, 65);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Coordinate Grid Ring (Instrument Scope Style)
    const gridHelper = new THREE.PolarGridHelper(35, 16, 8, 32, 0x06b6d4, 0x1e293b);
    gridHelper.position.y = -20;
    scene.add(gridHelper);

    // Node Group
    const nodeGroup = new THREE.Group();
    scene.add(nodeGroup);

    // Spheres for nodes
    const nodeObjects = [];
    const sphereGeo = new THREE.SphereGeometry(1.4, 24, 24);

    activeNodes.forEach((node, i) => {
      const color = node.doc_name.includes('Academic') ? 0x06b6d4 
                  : node.doc_name.includes('Security') ? 0x10b981 
                  : node.doc_name.includes('Financial') ? 0xf59e0b 
                  : 0xa855f7;

      const mat = new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.45,
        roughness: 0.2,
        metalness: 0.8
      });

      const mesh = new THREE.Mesh(sphereGeo, mat);
      mesh.position.set(
        (node.x || Math.sin(i * 1.5) * 18) * spatialSpread,
        (node.y || Math.cos(i * 2.2) * 14) * spatialSpread,
        (node.z || Math.sin(i * 0.8) * 16) * spatialSpread
      );
      mesh.userData = node;
      nodeGroup.add(mesh);
      nodeObjects.push(mesh);
    });

    // Neural Connection Lines
    const lineMat = new THREE.LineBasicMaterial({ color: 0x0ea5e9, transparent: true, opacity: 0.25 });
    for (let i = 0; i < nodeObjects.length; i++) {
      for (let j = i + 1; j < nodeObjects.length; j++) {
        const dist = nodeObjects[i].position.distanceTo(nodeObjects[j].position);
        if (dist < 26 * spatialSpread) {
          const points = [nodeObjects[i].position, nodeObjects[j].position];
          const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
          const line = new THREE.Line(lineGeo, lineMat);
          nodeGroup.add(line);
        }
      }
    }

    // Ambient & Point Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00f0ff, 2.5, 120);
    pointLight.position.set(20, 30, 40);
    scene.add(pointLight);

    const secondaryLight = new THREE.PointLight(0xa855f7, 1.8, 100);
    secondaryLight.position.set(-25, -20, -30);
    scene.add(secondaryLight);

    // Raycasting & Mouse Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerMove = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeObjects);

      if (intersects.length > 0) {
        const target = intersects[0].object.userData;
        if (!hoveredNode || hoveredNode.chunk_id !== target.chunk_id) {
          setHoveredNode(target);
          sounds.playKnobTick();
        }
      } else {
        setHoveredNode(null);
      }
    };

    const onPointerClick = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeObjects);
      if (intersects.length > 0) {
        sounds.playKeyClick();
        if (onSelectChunk) {
          onSelectChunk(intersects[0].object.userData);
        }
      }
    };

    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('click', onPointerClick);

    // Animation Loop
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      nodeGroup.rotation.y += orbitSpeed;
      nodeGroup.rotation.x = Math.sin(Date.now() * 0.0005) * 0.1;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('click', onPointerClick);
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [chunks, orbitSpeed, spatialSpread]);

  return (
    <div className="skeuo-chassis rounded-3xl border border-slate-700/80 p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between">
      {/* Corner Mounting Screws */}
      <div className="absolute top-3 left-3 w-3 h-3 skeuo-screw" />
      <div className="absolute top-3 right-3 w-3 h-3 skeuo-screw" />
      <div className="absolute bottom-3 left-3 w-3 h-3 skeuo-screw" />
      <div className="absolute bottom-3 right-3 w-3 h-3 skeuo-screw" />

      {/* Top Workstation Instrument Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg skeuo-inset flex items-center justify-center border border-slate-700">
            <Compass className="w-4 h-4 text-cyan-400 animate-spin [animation-duration:20s]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-white uppercase tracking-wider">
                3D Spatial Knowledge Constellation
              </span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-cyan-500/40 text-cyan-300 font-bold uppercase">
                768-D EMBED SPACE
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400">
              High-dimensional vector topology projected into interactive Euclidean coordinate space.
            </p>
          </div>
        </div>

        {/* Orbit Speed & Spread Toggles */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={() => {
              setOrbitSpeed(prev => prev === 0 ? 0.003 : 0);
              sounds.playSwitch();
            }}
            className="skeuo-btn px-3 py-1.5 rounded-lg text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer text-[11px]"
          >
            <RotateCw className="w-3 h-3 text-cyan-400" />
            <span>{orbitSpeed === 0 ? 'RESUME ORBIT' : 'FREEZE'}</span>
          </button>
          <button
            onClick={() => {
              setSpatialSpread(prev => prev > 1.5 ? 0.9 : prev + 0.3);
              sounds.playKnobTick();
            }}
            className="skeuo-btn px-3 py-1.5 rounded-lg text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer text-[11px]"
          >
            <ZoomIn className="w-3 h-3 text-purple-400" />
            <span>SPREAD: {spatialSpread.toFixed(1)}x</span>
          </button>
        </div>
      </div>

      {/* Main 3D Canvas Viewport */}
      <div className="relative w-full h-[380px] my-3 rounded-2xl skeuo-screen overflow-hidden flex items-center justify-center">
        {/* CRT Scanline Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02)_50%,transparent_51%)] bg-[size:100%_4px] pointer-events-none z-10" />

        {/* 3D WebGL Canvas Mount */}
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing z-0" />

        {/* Live Vector Crosshair Overlay if node hovered */}
        {hoveredNode && (
          <div className="absolute top-4 left-4 z-20 max-w-sm p-4 rounded-xl glass-chassis-hybrid border border-cyan-400/50 shadow-2xl pointer-events-none animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between text-xs font-mono pb-2 border-b border-white/10 mb-2">
              <span className="text-cyan-300 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full skeuo-diode-emerald" />
                {hoveredNode.doc_name}
              </span>
              <span className="text-slate-400">p.{hoveredNode.page}</span>
            </div>
            <p className="text-xs text-slate-200 font-mono leading-relaxed line-clamp-3">
              "{hoveredNode.snippet}"
            </p>
            <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>COORD: ({hoveredNode.x || -10}, {hoveredNode.y || 8}, {hoveredNode.z || 12})</span>
              <span className="text-emerald-400">CLICK TO LOCK CHUNK</span>
            </div>
          </div>
        )}

        {/* HUD Compass Ring Bottom Left */}
        <div className="absolute bottom-4 left-4 z-10 pointer-events-none text-[10px] font-mono text-slate-500 bg-black/60 px-2.5 py-1 rounded border border-white/10 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full skeuo-diode-cyan" />
          <span>RAYCASTER ACTIVE // HOVER NODES FOR HUD</span>
        </div>
      </div>

      {/* Bottom Node Legend */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-800 font-mono text-xs">
        <div className="flex items-center gap-4 text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#06b6d4]" /> Academic PDFs</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" /> Air-Gap Specs</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b]" /> Financial Data</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-400 shadow-[0_0_6px_#a855f7]" /> Engine Code</span>
        </div>
        <div className="text-[11px] text-slate-500">
          TOTAL EMBEDDED TOKENS: <span className="text-slate-300 font-bold">2,815</span>
        </div>
      </div>
    </div>
  );
}
