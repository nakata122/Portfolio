import React from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stats, OrbitControls } from '@react-three/drei';
import Bloom from "./Bloom.js";
import Prisms from "./Background.js";



function lerp(value1, value2, amount) {
  amount = amount < 0 ? 0 : amount;
  amount = amount > 1 ? 1 : amount;
  return value1 + (value2 - value1) * amount;
}

const CameraMovement = () => {
  const { camera } = useThree();
  const path = new THREE.CatmullRomCurve3( [new THREE.Vector3(0,3,0), new THREE.Vector3(0,2.9,-1), new THREE.Vector3(0,3,-10), new THREE.Vector3(10,3,-20), new THREE.Vector3(10,3,-21)]);

  useFrame(() => {
    const progress = lerp(0, window.pageYOffset / 100, 0.1);
    const newPosition = path.getPoint(progress);
    const tangent = path.getPoint(progress + 0.1).add(new THREE.Vector3(0, -6, 0));

    camera.position.copy(newPosition);
    camera.lookAt(tangent);
  });

  return null;
}

const Home = () => {
    return (
      <div style={{width: '100vw', height: '100vh', overflowX: 'hidden'}}>
      <Canvas camera={{ position: [0, 3, 0] }}>
        <color attach="background" args={0x32D50} />
        <pointLight position={[0, 10, 0]} intensity={0.8} layers={1}/>
        <Prisms i={20} j={20} maxSize={0.5} layer={1} wireframe={false} col={0x1E0233}/>
        <Prisms i={20} j={20} maxSize={0.58} layer={1} wireframe={true} col={0x9754CB}/>
        
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0,-5,0]} layers={0} name={'plane'}>
          <planeGeometry args={[1000, 1000]} />
          <meshBasicMaterial color="black" visible={false}/>
        </mesh>
        <Bloom />
        <CameraMovement />
        {/* <OrbitControls /> */}
        <Stats />
      </Canvas>

      </div>
    );
};

export default Home;
