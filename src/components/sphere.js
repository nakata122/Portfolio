import React, { Suspense, useRef, useState, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
import { ReactThreeFiber, useLoader } from '@react-three/fiber'
import {  useThree, useFrame } from '@react-three/fiber'
import { MeshDistortMaterial, Line } from "@react-three/drei";


function Spheres({count, radius, isLoading}) {
  const mesh = useRef();
  const mesh2 = useRef();
  const { scene, camera } = useThree();
  let animation = 0, lastTime = 0;
  camera.position.set(0,0,68);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 1; i <= count; i++) {
      const start = new THREE.Vector3(
        Math.sin(2 * Math.PI / count * i) * radius * 5,
        Math.cos(2 * Math.PI / count * i) * radius * 5,
        0
      );
      

      temp.push({ start });
    }
    return temp
  }, [count, radius])

  const vertices = useMemo(() => {
    const temp = [];
    for (let i = 0; i <= count; i++) {
      const start = [
        Math.sin(2 * Math.PI / count * (i+0.25)) * radius * 5,
        Math.cos(2 * Math.PI / count * (i+0.25)) * radius * 5,
        0
      ];
      const end = [
        Math.sin(2 * Math.PI / count * (i+0.75)) * radius * 5,
        Math.cos(2 * Math.PI / count * (i+0.75)) * radius * 5,
        0
      ];
      

      temp.push(start, end);
    }
    return temp
  }, [count, radius])

  useEffect(() => {
    // Go through each particle
    particles.forEach((particle, i) => {
      
      let { start } = particle;
      dummy.position.copy(start);
      dummy.scale.set(1,1,1);
      dummy.updateMatrix();
      mesh?.current.setMatrixAt(i, dummy.matrix);
      
      dummy.scale.set(0.95,0.95,0.95);
      dummy.updateMatrix();
      mesh2?.current.setMatrixAt(i, dummy.matrix);
    })
    mesh.current.instanceMatrix.needsUpdate = true;
    mesh2.current.instanceMatrix.needsUpdate = true;
  })

  useFrame(({clock, raycaster}) => {
    if(!mesh.current) return;
    
    // if(!isLoading) {
    //   // camera.position.set(Math.sin(clock.elapsedTime * 0.1) * 5, 0, Math.cos(clock.elapsedTime * 0.1) * 5 );
    //   camera.position.lerp(particles[1].start.clone().add(new THREE.Vector3(5, 0 ,0)),animation);
    //   camera.lookAt(new THREE.Vector3(0,0,0));
    //   animation += (clock.elapsedTime - lastTime) * 0.001;
    // }
    
    lastTime = clock.elapsedTime;
  })
  return (
    <>
    
      <instancedMesh ref={mesh2} geometry={new THREE.IcosahedronGeometry(3,20)} args={[null, null, count]}>
        <MeshDistortMaterial 
          color={new THREE.Color("black")}
          distort={0.25} 
          speed={1.5} 
          transparent 
          side={THREE.DoubleSide} 
          opacity={0.5}
          roughness={0.0}
          metalness={1.0}
        />
      </instancedMesh>
      <instancedMesh ref={mesh} geometry={new THREE.IcosahedronGeometry(3,20)} args={[null, null, count]}>
        <MeshDistortMaterial 
          color={new THREE.Color("black")}
          distort={0.2} 
          speed={2} 
          transparent 
          side={THREE.DoubleSide} 
          opacity={0.5}
          roughness={0.0}
          metalness={1.0}
        />
      </instancedMesh>


      <Line
          points={vertices}       // Array of points, Array<Vector3 | Vector2 | [number, number, number] | [number, number] | number>
          color="grey"                   // Default
          lineWidth={2}                   // In pixels (default)
          segments={true}                        // If true, renders a THREE.LineSegments2. Otherwise, renders a THREE.Line2
          
        />
        {/* <mesh ref={mesh}>
            <icosahedronGeometry args={[2.5, 20]}/>
            <MeshDistortMaterial 
              color={new THREE.Color("black")}
              distort={0.2} 
              speed={1} 
              transparent 
              side={THREE.DoubleSide} 
              opacity={0.5}
              roughness={0.0}
              metalness={1.0}
            />
          </mesh>
          <mesh>
            <icosahedronGeometry args={[3, 20]}/>
            <MeshDistortMaterial 
              color={new THREE.Color("black")}
              distort={0.15} 
              speed={2} 
              transparent 
              side={THREE.DoubleSide} 
              opacity={0.5}
              roughness={0.0}
              metalness={1.0}
            />
          </mesh> */}
    </>
  )
}

export { Spheres };