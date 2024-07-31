import React, { Suspense, useRef, useState, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
import { ReactThreeFiber, useLoader } from '@react-three/fiber'
import {  useThree, useFrame } from '@react-three/fiber'
import { MeshDistortMaterial, Line } from "@react-three/drei";
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from "gsap/ScrollTrigger";


function Spheres({count, radius}) {
  const mesh = useRef();
  const { scene, camera } = useThree();
  camera.near = 0.01;
  let lastTime = 0;
  camera.position.set(0.01,0.01,68);
  gsap.registerPlugin(ScrollTrigger);

  const face = useLoader(THREE.TextureLoader, 'random-guy.jpg');
  const displacement = useLoader(THREE.TextureLoader, 'perlin_noise.png');
  displacement.wrapS = THREE.RepeatWrapping;
  displacement.wrapT = THREE.RepeatWrapping;
  const target = useMemo(() => {return {val: new THREE.Vector3()}}, []);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 1; i <= count; i++) {
      const scale = 1;
      const start = new THREE.Vector3(
        Math.sin(2 * Math.PI / count * i) * radius * 5,
        Math.cos(2 * Math.PI / count * i) * radius * 5,
        0
      );
      

      temp.push({ start, scale });
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
  
  // useGSAP(
  //   () => {
  //       let tl = gsap.timeline({
  //         scrollTrigger: {
  //           trigger: '#container',
  //           start: 'top top',
  //           end: 'bottom',
  //           // markers: true,
  //           scrub: 1
            
  //         } 
  //       });
  //       tl.set(camera.position, {x:0.01,y:0.01,z:68});
  //       particles.forEach((particle, i) => {
  //         tl.to(camera.position, {  x: Math.sin(2 * Math.PI / count * (i+2)) * radius * 6.5+0.01, 
  //                                   y: Math.cos(2 * Math.PI / count * (i+2)) * radius * 6.5+0.01, 
  //                                   z: 0,
  //                                   ease:'expo.inOut' });
  //         tl.to(target.val,  particles[(i+1)%count].start, '<');
  //       });
  //       console.log(tl);
  //   },
  //   [particles]
  // );

  useEffect(() => {

    // Go through each particle
    particles.forEach((particle, i) => {
      
      let { start, scale } = particle;
      dummy.position.copy(start);
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      mesh?.current.setMatrixAt(i, dummy.matrix);
      
    })
    mesh.current.instanceMatrix.needsUpdate = true;
  })

  useFrame(({clock, raycaster}) => {
    if(!mesh.current) return;
    
    camera.lookAt(new THREE.Vector3(0,0,0));
      // camera.lookAt(target.val);
      // console.log(camera.position);
      // camera.up.y = Math.max(-1, Math.min(1, camera.rotation.y)); //THIS TOOK ME 3 HOURS TO FIX
      // camera.up.y = camera.rotation.y > 0 ? 1 : -1;
    displacement.offset.y -= (lastTime - clock.elapsedTime) * 0.03;
    
    lastTime = clock.elapsedTime;
  })
  return (
    <group>
      <instancedMesh ref={mesh} geometry={new THREE.IcosahedronGeometry(3,20)} args={[null, null, count]} frustumCulled={false}>
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

      <mesh geometry={new THREE.PlaneGeometry(2,3)} position={particles[1].start} rotation={[0, Math.PI / 2, 0]}>
        <meshStandardMaterial map={face} />
      </mesh>

      {/* <mesh geometry={new THREE.CylinderGeometry(100, 100, 800, 1000, 1000, true)} position={[0,0,0]} rotation={[-Math.PI/2, 0, 0]}>
      <meshStandardMaterial 
          color={new THREE.Color(0x404040)}
          aoMap={displacement}
          lightMap={displacement}
          displacementMap={displacement}
          displacementScale={50}
          flatShading={true}
          roughness={0.6}
          side={THREE.BackSide}
        />
      </mesh> */}

      <Line
          points={vertices}       // Array of points, Array<Vector3 | Vector2 | [number, number, number] | [number, number] | number>
          color="grey"                   // Default
          lineWidth={2}                   // In pixels (default)
          segments={true}                        // If true, renders a THREE.LineSegments2. Otherwise, renders a THREE.Line2
          
        />
    </group>
  )
}

export { Spheres };