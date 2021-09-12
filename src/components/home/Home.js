import React, { Component , useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stats } from "@react-three/drei";

const dummy = new THREE.Object3D();

const Boxes = ({ i, j }) => {
  const material = new THREE.MeshLambertMaterial({ color: 0x1E0233 });
  const boxesGeometry = new THREE.CylinderBufferGeometry(0.58, 0.58, 0.5, 3);
  const ref = useRef();
  const rands = [];
  let count = 0;
  for (let x = 0; x < i; x++) {
    for (let z = 0; z < j; z++) {
      rands[count++] = Math.random() * 10;
      rands[count++] = Math.random() * 10;
    }
  }

  useFrame(({ clock }) => {
    let counter = 0;
    const t = clock.oldTime * 0.001;
    for (let x = 0; x < i; x++) {
      for (let z = 0; z < j; z++) {
        let id = counter++;
        dummy.position.set(i / 2 - x, 0, j / 2 - z * 0.8);
        dummy.scale.set(1, (Math.cos(rands[id] + t)+1.0) * 3, 1);
        dummy.rotation.set(0, 0, 0);
        dummy.updateMatrix();
        ref.current.setMatrixAt(id, dummy.matrix);
        
        id = counter++;
        dummy.position.set(i / 2 - x - 0.5, 0, j / 2 - z * 0.8 - 0.58);
        dummy.scale.set(1, (Math.cos(rands[id] + t)+1.0) * 3, 1);
        dummy.rotation.set(0, Math.PI, 0);
        dummy.updateMatrix();
        ref.current.setMatrixAt(id, dummy.matrix);
      }
    }
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={ref} args={[boxesGeometry, material, i * j * 2]} />;
};

const Home = () => {
    return (
      <Canvas camera={{ position: [0, 3, 10] }}>
        <color attach="background" args={0x32D50} />
        <pointLight position={[5, 10, 5]} />
        <Boxes i={100} j={100} />
        <OrbitControls />
        <Stats />
      </Canvas>
    );
};

export default Home;
