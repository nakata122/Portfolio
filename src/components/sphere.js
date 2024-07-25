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
  const mesh2 = useRef();
  const { scene, camera } = useThree();
  const target = useMemo(() => {return {val: new THREE.Vector3()}}, []);
  let lastTime = 0;

  gsap.registerPlugin(ScrollTrigger);

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
  
  useGSAP(
    () => {
        // gsap code here...
        let tl = gsap.timeline({
          scrollTrigger: {
            start: 'top top',
            end: '+=4000',
            onUpdate: (self)=>{
              console.log(self.progress)
            },
            markers: true,
            scrub: 1
            
          } 
        });
        tl.set(camera.position, {x:0,y:0,z:68});
        particles.forEach((particle, i) => {
          tl.to(camera.position, { x: Math.sin(2 * Math.PI / count * (i+1)) * radius * 7, 
                                     y: Math.cos(2 * Math.PI / count * (i+1)) * radius * 7, 
                                     z: 0 });
          tl.to(target.val, { x: particle.start.x, 
          y: particle.start.y, 
          z: particle.start.z }, '<');
        });

        // let tl2 = gsap.timeline({
        //   scrollTrigger: {
        //     start: 'top top',
        //     end: '+=4000',
        //     markers: true,
        //     scrub: 1
        //   } 
        // });
        // tl2.set(target.val, {x: 0, y: 0, z: 0});
        // particles.forEach((particle, i) => {
        //   tl2.to(target.val, { x: 100, 
        //                       y: particle.start.y, 
        //                       z: particle.start.z });
        // });
        // ScrollTrigger.refresh();
    },
    {particles}
  );

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
      // camera.getWorldDirection(camera.up);
      camera.lookAt(target.val);
      console.log(target.val);
      camera.up.y = Math.max(-1, Math.min(1, camera.rotation.y)); //THIS TOOK ME 3 HOURS TO FIX
      // camera.rotation.y = Math.PI / 2;
      // animation += (clock.elapsedTime - lastTime) * 0.1;
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