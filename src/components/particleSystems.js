import React, { Suspense, useRef, useState, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
import { ReactThreeFiber, useLoader } from '@react-three/fiber'
import {  useThree, useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei';


function Particles({count}) {
  const mesh = useRef();
  const lines = useRef();
  const { scene, camera } = useThree();
  const sky = useLoader(THREE.TextureLoader, 'web.webp');
  let lastTime = 0;
  let lastImage = '';

  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const speed = (Math.random()) * 2;
      const size = 1.0;
      const phi = Math.random() * Math.PI * 2;
      const radius = (Math.random() * 0.7 +0.3) * 15;
      const start = new THREE.Vector3(
        (Math.sin(phi)) * radius * 5,
        (Math.cos(phi)) * radius * 5,
        (Math.random()-0.5) * radius * 3
      );
      

      temp.push({ start, phi, radius, speed, size });
    }
    return temp
  }, [count])

  
  const vertices = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      let phi = particles[i].phi;
      let radius = particles[i].radius;
      const start = [
        (Math.sin(phi)) * radius * 5,
        (Math.cos(phi)) * radius * 5,
        particles[i].start.z
      ];
      const end = [
        (Math.sin(phi-0.05)) * radius * 5.1,
        (Math.cos(phi-0.05)) * radius * 5.1,
        particles[i].start.z
      ];
      

      temp.push(start, end);
    }
    return temp
  }, [particles, count])


  useFrame(({clock, raycaster}) => {
    if(!mesh.current || !lines.current) return;
    
    // Go through each particle
    particles.forEach((particle, i) => {
      
      let { start, phi, size, radius } = particle;
      // Change position
      let newPos = new THREE.Vector3(
        (Math.sin(phi)) * radius * 5,
        (Math.cos(phi)) * radius * 5,
        start.z
      );
      dummy.position.copy(newPos);
      let animatedSize = Math.sin(radius/15 * Math.PI * 2 + size) + 1;
      dummy.scale.set(animatedSize, animatedSize, animatedSize);
      dummy.updateMatrix();
      // And apply the matrix to the instanced mesh
      mesh?.current.setMatrixAt(i, dummy.matrix);
      mesh?.current.setColorAt(i, new THREE.Color("hsl(0, 100%, " + 100 + "%)"))

      
      particle.phi += 0.1 * (clock.elapsedTime - lastTime) * particle.speed;
      particle.size += (clock.elapsedTime - lastTime);
      // particle.radius -= 0.1 * (clock.elapsedTime - lastTime) * particle.speed;
      // particle.rotation.add(new THREE.Vector3(1 * (clock.elapsedTime - lastTime),2 * (clock.elapsedTime - lastTime),0));
    })
    mesh.current.instanceMatrix.needsUpdate = true;
    lines?.current.rotateZ(-0.1 * (clock.elapsedTime - lastTime));

    lastTime = clock.elapsedTime;
  })
  return (
    <>
      <instancedMesh ref={mesh} geometry={new THREE.IcosahedronGeometry(0.3,1)} args={[null, null, count]}>
        <meshBasicMaterial attach="material" map={sky} color={0x808080}/>
      </instancedMesh>
      <Line
          ref={lines}
          points={vertices}       // Array of points, Array<Vector3 | Vector2 | [number, number, number] | [number, number] | number>
          color="#808080"                   // Default
          lineWidth={0.3}                   // In pixels (default)
          segments={true}                        // If true, renders a THREE.LineSegments2. Otherwise, renders a THREE.Line2
          
        />
    </>
  )
}

export { Particles };