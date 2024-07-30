'use client'
import * as THREE from "three"
import { Canvas, useLoader } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState, useCallback } from "react";
import { Environment, OrbitControls, Stats } from '@react-three/drei'
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
  const [isLoading, setIsLoading] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 4000);
  }, [isLoading]);
  
  gsap.registerPlugin(ScrollTrigger);

  useGSAP(
    () => {
        // gsap code here...
        const sections:HTMLTableSectionElement[] = gsap.utils.toArray('section');
        sections.forEach(section => {
          gsap.fromTo(section, { x: 100, opacity: 0 }, { x:0, opacity:1, scrollTrigger: {
              trigger: section,
              start: 'top-=100px top',
              end: 'top',
              markers: true,
              scrub:true
          } });
        })
        
    },
    {}
  );

  return (
    <div id="container" className="flex flex-col bg-black text-white"  ref={container}>
      <Splash isLoading={isLoading} />
      <div className="fixed top-0 left-0 h-screen z-0 size-full">
        <Canvas>
          <Suspense fallback={null} />
          <color attach="background" args={["black"]} />
          <Stats />
          <Environment files="./sky2.hdr" background backgroundIntensity={0.1} backgroundBlurriness={0.1}/>
          <Environment files="./web.hdr" />
          {/* <OrbitControls /> */}
          {/* <ambientLight intensity={0.1} /> */}
          <directionalLight intensity={0.2} position={[0, 0, -50]} />
          <EffectComposer>
            <Bloom 
              mipmapBlur
              intensity={50}
              levels={3}
              luminanceThreshold={0}
              />
            <ToneMapping />
            {/* <Vignette eskil={true} darkness={0.8} offset={3}/> */}
          </EffectComposer>
          {/* <Particles count={2500} /> */}
          <Spheres count={8} radius={3}/>
          {/* <fogExp2 attach="fog" color="black" density={0.005} /> */}
        </Canvas>
      </div>
      
      <section className="flex items-center justify-center flex-col z-10 text-xl h-screen">
        <h1 className="mb-10 mx-auto font-medium">SCROLL DOWN</h1>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="mx-auto size-6 animate-bounce">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
        </svg>
      </section>

      <section className="z-10 h-screen m-auto">
        <div className=" mr-56 mt-48 w-64">
          <h1 className="text-3xl border-b-2">Naiden Naidenov</h1>
          <p className="text-lg backdrop-blur-sm">Creative developer with a passion in computer graphics</p>
        </div>
        
        <div className="ml-64 mt-48 w-64">
          <h1 className="text-3xl border-b-2 w-40">What I do</h1>
          <p className="text-lg backdrop-blur-sm">I specialise in creating interactive and immersive web experiences using next.js and three.js</p>
        </div>
      </section>
      <section className="flex flex-col z-10 text-lg h-screen">
        <h1 className="m-auto">Projects</h1>
        <p className="m-auto">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer non laoreet ex. Morbi eget commodo turpis. Duis lobortis nunc sit amet nulla interdum auctor. Ut et libero eu felis accumsan rutrum nec vel velit.</p>
      </section>
      <section className="flex flex-col z-10 text-lg h-screen">
        <h1 className="m-auto">Projects</h1>
        <p className="m-auto">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer non laoreet ex. Morbi eget commodo turpis. Duis lobortis nunc sit amet nulla interdum auctor. Ut et libero eu felis accumsan rutrum nec vel velit.</p>
      </section>
      <section className="flex flex-col z-10 text-lg h-screen">
        <h1 className="m-auto">Projects</h1>
        <p className="m-auto">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer non laoreet ex. Morbi eget commodo turpis. Duis lobortis nunc sit amet nulla interdum auctor. Ut et libero eu felis accumsan rutrum nec vel velit.</p>
      </section>
      <section className="flex flex-col z-10 text-lg h-screen">
        <h1 className="m-auto">Projects</h1>
        <p className="m-auto">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer non laoreet ex. Morbi eget commodo turpis. Duis lobortis nunc sit amet nulla interdum auctor. Ut et libero eu felis accumsan rutrum nec vel velit.</p>
      </section>
      <section className="flex flex-col z-10 text-lg h-screen">
        <h1 className="m-auto">Projects</h1>
        <p className="m-auto">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer non laoreet ex. Morbi eget commodo turpis. Duis lobortis nunc sit amet nulla interdum auctor. Ut et libero eu felis accumsan rutrum nec vel velit.</p>
      </section>
      <section className="flex flex-col z-10 text-lg h-screen">
        <h1 className="m-auto">Projects</h1>
        <p className="m-auto">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer non laoreet ex. Morbi eget commodo turpis. Duis lobortis nunc sit amet nulla interdum auctor. Ut et libero eu felis accumsan rutrum nec vel velit.</p>
      </section>
    </div>
  );
}
