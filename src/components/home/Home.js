import React from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import { Stats, OrbitControls, Billboard, Text, useTexture } from '@react-three/drei';
import { Bloom } from "./Bloom.js";
import Prisms from "./Background.js";
import { Suspense, useMemo } from "react";

function lerp(value1, value2, amount) {
  amount = amount < 0 ? 0 : amount;
  amount = amount > 1 ? 1 : amount;
  return value1 + (value2 - value1) * amount;
}

const CameraMovement = () => {
  const { camera } = useThree();
  const path = new THREE.CatmullRomCurve3( [new THREE.Vector3(0,3,0), new THREE.Vector3(0,2.9,-1), 
                                            new THREE.Vector3(0,3,-10), 
                                            new THREE.Vector3(10,3,-20), new THREE.Vector3(10,3,-20),
                                            new THREE.Vector3(15,3,-21), 
                                            new THREE.Vector3(30,3,-21), new THREE.Vector3(30,3,-22),
                                            new THREE.Vector3(35,3,-22), 
                                            new THREE.Vector3(35,3,-40), new THREE.Vector3(30,3,-40),
                                            new THREE.Vector3(50,3,-40), new THREE.Vector3(50,3,-40),
                                          ]);

  useFrame(() => {
    const progress = lerp(0, window.pageYOffset / 1000, 0.1);
    const newPosition = path.getPoint(progress);
    const tangent = path.getPoint(progress + 0.1).add(new THREE.Vector3(0, -6, 0));

    camera.position.copy(newPosition);
    camera.lookAt(tangent);
  });

  return null;
}

const Page = ({imgUrl, text, pos}) => {
  const texture = useMemo(() => new THREE.TextureLoader().load(imgUrl), [imgUrl]);

  return (
    <Billboard position={pos}>
      <Text color="white" fontSize={0.5} renderOrder={-1}>
        {text}
        <meshBasicMaterial depthTest={false} />
      </Text>
      <mesh position={[0,-1, 0]}>
          <planeBufferGeometry attach="geometry" args={[1, 1]}/>
          <meshBasicMaterial attach="material" map={texture} transparent={true}  depthTest={false}/>
      </mesh>
    </Billboard>
  );
}


const Home = () => {

    return (
      <div style={{width: '100vw', height: '100vh', overflowX: 'hidden'}}>
      <Canvas camera={{ position: [0, 3, 0] }}>
        <Bloom>
          <color attach="background" args={0x0f0015} />
          <pointLight position={[0, 10, 0]} intensity={0.8}/>
          <Prisms i={20} j={20} maxSize={0.5} wireframe={false} col={0x1E0233}/>
          <Prisms i={20} j={20} maxSize={0.58} wireframe={true} col={0x9754CB}/>
          <CameraMovement />
          <Suspense  fallback={null}>
              <Page imgUrl={'./logo512.png'} text={"Hello I'm Naiden"} pos={[0,1,-1]}/>
              <Page imgUrl={''} text={"Projects"} pos={[0,1,-7]}/>
              <Page imgUrl={'./logo.ico'} text={"VShow"} pos={[10,1,-20]}/>
              {/* <Page imgUrl={'./stairs.png'} text={"Procedural modeling"} pos={[30,1,-22]}/> */}
              <Page imgUrl={'./terrain.png'} text={"Infitite terrain (OpenGL)"} pos={[35,1,-40]}/>
              <Page imgUrl={'./contacts.png'} text={"Contacts"} pos={[50,1,-40]}/>
          </Suspense>
          
        </Bloom>
        
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0,-5,0]} layers={0} name={'plane'}>
            <planeGeometry args={[1000, 1000]} />
            <meshBasicMaterial color="black" visible={false}/>
          </mesh>


        {/* <OrbitControls /> */}
        <Stats />
      </Canvas>

      </div>
    );
};

export default Home;
