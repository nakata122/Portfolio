import React, { Suspense, useRef, useState, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
import { ReactThreeFiber, useLoader } from '@react-three/fiber'
import {  useThree, useFrame } from '@react-three/fiber'


function Particles({count, radius}) {
  const mesh = useRef();
  const { scene, camera } = useThree();
  let lastTime = 0;
  let lastImage = '';

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => camera.position.set(-2,5,0));

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const speed = Math.random() / 2 + 0.5;
      const life = 0;
      const start = new THREE.Vector3(
        (Math.random()-0.5) * radius * 5,
        (Math.random()-0.5) * radius * 5,
        (Math.random()-0.5) * radius * 5
      );

      const end = new THREE.Vector3(
        (Math.random()-0.5) * 2,
        (Math.random()-0.5) * 2,
        (Math.random()-0.5) * 2
      ).add(start);
      

      temp.push({ start, end, speed, life });
    }
    return temp
  }, [count])


  useFrame(({clock, raycaster}) => {
    if(!mesh.current) return;
    
    // Go through each particle
    particles.forEach((particle, i) => {
      
      let { start, end } = particle;
      // Change position
      let lerping = start.clone();
      lerping.lerp(end, particle.life);
      dummy.position.copy(lerping);
      dummy.scale.set(1,1,1);
      // dummy.lookAt(new THREE.Vector3(0,(i%5)*4,0));
      dummy.updateMatrix();
      // And apply the matrix to the instanced mesh
      mesh?.current.setMatrixAt(i, dummy.matrix);

      
      particle.life += 0.1 * (clock.elapsedTime - lastTime) * particle.speed;
      // console.log(particle.life)
      if(particle.life >= 1) {
        particle.endLife = Math.random() / 2;
        particle.life = 0;
        const phi = Math.random() * Math.PI * 2;
        const theta = Math.random() * Math.PI * 2;
        particle.start = particle.end.clone();
        particle.end = new THREE.Vector3(
          (Math.random()-0.5) * 5,
          (Math.random()-0.5) * 5,
          (Math.random()-0.5) * 5
        ).add(particle.start)
      } 
    })
    mesh.current.instanceMatrix.needsUpdate = true;

    lastTime = clock.elapsedTime;
  })
  return (
    <>
      <instancedMesh ref={mesh} geometry={new THREE.IcosahedronGeometry(0.1,0)} args={[null, null, count]}>
        <meshPhongMaterial attach="material" color={0x808080}  depthWrite={false} depthTest={false} />
      </instancedMesh>
    </>
  )
}

export { Particles };