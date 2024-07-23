'use client'
import * as THREE from "three"
import { Canvas, useLoader } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import { Environment, OrbitControls } from '@react-three/drei'
import { EffectComposer, Bloom, ToneMapping, DepthOfField} from '@react-three/postprocessing'
import {  useThree, useFrame } from '@react-three/fiber'
import { Particles } from '../components/particleSystems'
import { Spheres } from '../components/sphere'
import Splash from '../components/splashScreen'
import Image from 'next/image';


export default function Home() {
  // colorMap.repeat.set(5, 5);
  // colorMap.wrapS = colorMap.wrapT = THREE.RepeatWrapping;
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    setTimeout(() => {setIsLoading(false); console.log("false now");}, 4000);
  }, [isLoading]);

  return (
    <div className="flex text-center h-screen">
      <Splash isLoading={isLoading} />
      <div className="fixed top-0 left-0 h-screen w-screen z-0">
        <Canvas>
          <Suspense fallback={null} />
          <color attach="background" args={["black"]} />
          <Environment files="./sky2.hdr" background backgroundIntensity={0.1} backgroundBlurriness={0.1}/>
          <Environment files="./web.hdr" />
          <OrbitControls />
          <ambientLight intensity={0.1} />
          {/* <directionalLight color={new THREE.Color("white")} position={[0, 5, 5]} /> */}
          <EffectComposer autoClear={false}>
            <Bloom 
              mipmapBlur
              intensity={100}
              levels={3}
              luminanceThreshold={0}
              />
            <ToneMapping />
            {/* <Vignette eskil={true} darkness={0.8} offset={3}/> */}
          </EffectComposer>
          <Spheres count={8} radius={3} isLoading={isLoading}/>
          <Particles count={200} />
          {/* <fogExp2 attach="fog" color="black" density={0.05} /> */}
        </Canvas>
      </div>
      <div className="m-auto z-10 text-gray-500 text-5xl backdrop-blur-sm">
        {/* <h1>About me</h1> */}
      </div>
    </div>
  );
}
