'use client'
import * as THREE from "three"
import { Canvas, useLoader } from "@react-three/fiber";
import { Suspense } from "react";
import { MeshDistortMaterial } from "@react-three/drei";
import { TextureLoader } from "three";
import { Environment } from '@react-three/drei'
import { EffectComposer, Bloom, ToneMapping } from '@react-three/postprocessing'

export default function Home() {
  const colorMap = useLoader(TextureLoader, 'perlin_noise.png');
  // colorMap.repeat.set(5, 5);
  // colorMap.wrapS = colorMap.wrapT = THREE.RepeatWrapping;

  return (
    <div className="flex text-center h-screen">
      <div className="fixed top-0 left-0 h-screen w-screen z-0">
        <Canvas>
          <Suspense fallback={null} />
          <color attach="background" args={["black"]} />
          <Environment files="./perlin_noise_red.hdr" />
          <ambientLight intensity={1} />
          {/* <directionalLight color={new THREE.Color("red")} position={[0, 5, 5]} /> */}
          <EffectComposer enableNormalPass={false}>
            <Bloom 
              mipmapBlur
              intensity={1000}
              levels={7}
              luminanceThreshold={0}
              />
            <ToneMapping />
          </EffectComposer>
          <mesh>
            <icosahedronGeometry args={[2.9, 20]}/>
            <MeshDistortMaterial 
              color={new THREE.Color("black")}
              distort={0.15} 
              speed={1} 
              transparent 
              side={THREE.DoubleSide} 
              opacity={0.5}
              roughness={0.1}
              metalness={1.0}
              toneMapped={false}
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
              toneMapped={false}
            />
          </mesh>
        </Canvas>
      </div>
      <div className="m-auto z-10 text-white text-3xl">
        <h1>Hi I am Naiden and I am a ...</h1>
      </div>
    </div>
  );
}
