"use client";

import React, { useRef, useEffect, Suspense, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ============================================================
// GPU-INSTANCED SHADER — ZERO CPU OVERHEAD
// ============================================================

const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uMouseInfluence;

  attribute float aSeed;

  varying vec3 vNormal;
  varying vec2 vUv;
  varying vec3 vWorldPos;
  varying float vSeed;

  void main() {
    vUv = uv;
    vSeed = aSeed;
    
    // t goes from 0.0 to 1.0 along the length of the ribbon (PlaneGeometry X axis)
    float t = position.x + 0.5; 
    
    // Curve generation parameters based on unique instance seed
    float sx = 5.0 + sin(aSeed * 1.7) * 3.0;
    float sy = 3.2 + cos(aSeed * 0.9) * 1.8;
    float sz = 4.0 + sin(aSeed * 2.3) * 2.0;
    
    float fx1 = 0.28 + sin(aSeed * 2.1) * 0.12;
    float fx2 = 0.42 + cos(aSeed * 1.6) * 0.1;
    float spd = 0.08 + sin(aSeed * 0.8) * 0.03;
    float phase = aSeed * 3.14159 * 2.618;
    
    // Base curve position
    float t1 = fx1 * t * 3.14159 * 2.0 + uTime * spd + phase;
    float t2 = fx2 * t * 3.14159 * 2.0 + uTime * spd * 0.65 + phase * 1.4;
    float t3 = fx1 * t * 3.14159 * 2.0 + uTime * spd * 0.4 + phase * 0.7;
    
    float cx = sx * sin(t1);
    float cy = sy * sin(t2) - 0.5;
    float cz = sz * cos(t3);
    
    // Vertical breathing animation
    cy += sin(uTime * 0.2 + aSeed) * 0.2;
    
    // Mouse attraction
    float midFactor = sin(t * 3.14159) * uMouseInfluence;
    float mx = (uMouse.x * 4.0 - cx) * midFactor * 0.05;
    float my = (-uMouse.y * 2.5 - cy) * midFactor * 0.04;
    cx += mx;
    cy += my;
    
    vec3 curvePos = vec3(cx, cy, cz);
    
    // Approximate tangent to calculate ribbon width/orientation
    float t_next = t + 0.01;
    float n_cx = sx * sin(fx1 * t_next * 3.14159 * 2.0 + uTime * spd + phase) + mx;
    float n_cy = sy * sin(fx2 * t_next * 3.14159 * 2.0 + uTime * spd * 0.65 + phase * 1.4) - 0.5 + sin(uTime * 0.2 + aSeed) * 0.2 + my;
    float n_cz = sz * cos(fx1 * t_next * 3.14159 * 2.0 + uTime * spd * 0.4 + phase * 0.7);
    
    vec3 tangent = normalize(vec3(n_cx, n_cy, n_cz) - curvePos);
    vec3 up = vec3(0.0, 1.0, 0.0);
    vec3 binormal = normalize(cross(tangent, up));
    
    if (length(binormal) < 0.01) {
      binormal = vec3(1.0, 0.0, 0.0);
    }
    
    // Calculate ribbon width
    float width = 0.08 + abs(sin(aSeed * 2.1)) * 0.04;
    
    // Offset vertex along binormal to create width (position.y is -0.5 to 0.5)
    vec3 finalPos = curvePos + binormal * (position.y * width * 2.0);
    
    // Calculate fake normal for lighting
    vec3 calcNormal = cross(binormal, tangent);
    vNormal = normalize(normalMatrix * calcNormal);
    
    vec4 worldPosition = instanceMatrix * vec4(finalPos, 1.0);
    vWorldPos = worldPosition.xyz;
    
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform float uMouseInfluence;
  
  varying vec3 vNormal;
  varying vec2 vUv;
  varying vec3 vWorldPos;
  varying float vSeed;
  
  void main() {
    // 10% Brighter premium colors
    float isGreen = step(0.5, fract(vSeed * 3.7));
    vec3 color1 = vec3(0.72, 0.82, 0.78); // Silver-green
    vec3 color2 = vec3(0.66, 0.72, 0.76); // Slate-blue
    vec3 edgeColor = mix(color2, color1, isGreen);
    
    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    
    // Soft rim lighting (double-sided)
    float rim = 1.0 - max(0.0, abs(dot(vNormal, viewDir)));
    rim = smoothstep(0.5, 1.0, rim);
    
    // 10% Brighter core
    vec3 bodyColor = vec3(0.05);
    
    // Edge glow and shimmer
    vec3 rimGlow = edgeColor * rim * 0.6;
    float shimmer = sin(vUv.x * 12.0 - uTime * 0.5) * 0.5 + 0.5;
    shimmer = pow(shimmer, 3.0) * 0.12;
    
    vec3 color = bodyColor + rimGlow + vec3(shimmer) * edgeColor;
    
    // Mouse hover highlight
    color += edgeColor * uMouseInfluence * 0.15;
    
    // 10% Brighter opacity
    float opacityBase = 0.5 + abs(sin(vSeed * 2.1)) * 0.2;
    float alpha = opacityBase * (0.4 + rim * 0.6);
    
    gl_FragColor = vec4(color, alpha);
  }
`;

// ============================================================
// SCENE
// ============================================================

function Scene() {
  const { camera } = useThree();
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  const mouseRef = useRef({ x: 0, y: 0, influence: 0 });
  const camTarget = useRef({ x: 0, y: 0 });

  const RIBBONS = 10;

  // Generate InstancedMesh data exactly once
  const { geometry, material } = useMemo(() => {
    // Plane: x goes from -0.5 to 0.5 (length), y goes from -0.5 to 0.5 (width)
    const geom = new THREE.PlaneGeometry(1, 1, 80, 1);
    
    const mat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uMouseInfluence: { value: 0 },
      },
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    const seeds = new Float32Array(RIBBONS);
    for (let i = 0; i < RIBBONS; i++) {
      seeds[i] = i * 0.618033988749;
    }
    geom.setAttribute("aSeed", new THREE.InstancedBufferAttribute(seeds, 1));

    return { geometry: geom, material: mat };
  }, []);

  useEffect(() => {
    let raf: number;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouseRef.current.y = (e.clientY / window.innerHeight) * 2 - 1;
        mouseRef.current.influence = Math.min(mouseRef.current.influence + 0.05, 1);
      });
    };
    const onLeave = () => {
      mouseRef.current.influence = 0;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);
    
    // Initialize instance matrices (just identity, vertex shader does all positioning)
    if (meshRef.current) {
      const dummy = new THREE.Object3D();
      for (let i = 0; i < RIBBONS; i++) {
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
      }
      meshRef.current.instanceMatrix.needsUpdate = true;
    }

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  useFrame((state) => {
    if (mouseRef.current.influence > 0) {
      mouseRef.current.influence = Math.max(0, mouseRef.current.influence - 0.01);
    }

    // 0 CPU overhead — update 3 tiny uniforms and let WebGL do 100% of the math
    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uMouse.value.set(mouseRef.current.x, mouseRef.current.y);
    material.uniforms.uMouseInfluence.value = mouseRef.current.influence;

    // Smooth parallax camera tracking
    camTarget.current.x += (mouseRef.current.x * 0.5 - camTarget.current.x) * 0.05;
    camTarget.current.y += (mouseRef.current.y * 0.3 - camTarget.current.y) * 0.05;

    const scrollY = window.scrollY;
    const cam = camera as THREE.PerspectiveCamera;
    cam.position.x = camTarget.current.x;
    cam.position.y = camTarget.current.y - scrollY * 0.002;
    cam.position.z = 11 + scrollY * 0.003;
    cam.lookAt(0, -scrollY * 0.001, 0);
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, RIBBONS]}
      frustumCulled={false}
    />
  );
}

// ============================================================
// EXPORTED CANVAS
// ============================================================

export default function RibbonCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 11], fov: 56, near: 0.1, far: 80 }}
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: "high-performance",
      }}
      dpr={[1, 1.5]}
      style={{ background: "transparent" }}
      aria-hidden="true"
    >
      <fog attach="fog" args={["#050505", 10, 25]} />
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  );
}
