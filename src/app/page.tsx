'use client'
import * as THREE from "three"
import { Canvas, useLoader } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import { Environment, OrbitControls } from '@react-three/drei'
import { EffectComposer, Bloom, ToneMapping, DepthOfField} from '@react-three/postprocessing'
import {  useThree, useFrame } from '@react-three/fiber'
import { Particles } from '../components/particleSystems'
import { Spheres } from '../components/sphere'
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Splash from '../components/splashScreen'
import Image from 'next/image';
import { contain } from "three/src/extras/TextureUtils.js";


export default function Home() {
  // colorMap.repeat.set(5, 5);
  // colorMap.wrapS = colorMap.wrapT = THREE.RepeatWrapping;
  const [isLoading, setIsLoading] = useState(true);
  const container = useRef();
  
  useEffect(() => {
    setTimeout(() => {setIsLoading(false); console.log("false now");}, 4000);
  }, [isLoading]);
  
  gsap.registerPlugin(ScrollTrigger);

  useGSAP(
    () => {
        // gsap code here...
        gsap.fromTo('section', { x: 0 }, { x:100, duration: 1, scrollTrigger: {
          trigger: 'section',
          start: '100px top',
          end: 'bottom middle',
          markers: true,
          scrub:true
      } });
    },
    { scope: container}
  );

  return (
    <div className="flex flex-col bg-black text-white" ref={container}>
      <Splash isLoading={isLoading} />
      <div className="fixed top-0 left-0 h-screen z-0 size-full">
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
      
      <section className="flex items-center justify-center flex-col z-10 text-4xl h-screen">
        {/* <h1 className="mb-10 mx-auto">Welcome</h1> */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="mx-auto size-6 animate-bounce">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
        </svg>
      </section>

      <section className="flex z-10 text-5xl h-screen">
        <h1 className="m-auto">Hey I am Naiden</h1>
      </section>
      <section className="flex flex-col z-10 text-lg h-screen">
        <h1 className="m-auto">Projects</h1>
        <p className="m-auto">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer non laoreet ex. Morbi eget commodo turpis. Duis lobortis nunc sit amet nulla interdum auctor. Ut et libero eu felis accumsan rutrum nec vel velit.</p>
      </section>
    </div>
  );
}
