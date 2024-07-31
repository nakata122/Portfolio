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
      let tl = gsap.timeline({
        scrollTrigger: {
          trigger: '#container',
          start: 'top top',
          end: () => '+=' + window.innerHeight * 8,
          markers: true,
          scrub: 1,
          pin: '#container'
        } 
      });
      // console.log(tl.endTime());
      tl.to('#scrollSection', {
        y: -100,
        opacity: 0});
      
      gsap.set('#titleSection h1', {perspective: 900});
      const items = gsap.utils.toArray('#titleSection h1 div');
      tl.fromTo(items[0], {y: 100, rotationX:-90, scaleX: '70%', opacity: 0}, {y: 0, rotationX: 0, scaleX: '100%', opacity: 1}, '<');
      tl.fromTo(items[1], {y: 100, rotationX:-90, scaleX: '70%', opacity: 0}, {y: 0, rotationX: 0, scaleX: '100%', opacity: 1}, '<+=0.1');

      tl.fromTo('#aboutSection',
        {x: 100, opacity:0}, 
        {x: 0, opacity: 1 });
    },
    {}
  );

  return (
    <div id="container" className="flex flex-col items-center bg-black text-white h-screen w-full"  ref={container}>
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
          {/* <directionalLight intensity={0.2} position={[0, 0, -50]} /> */}
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
          <Particles count={2500} />
          <Spheres count={8} radius={3}/>
          {/* <fogExp2 attach="fog" color="black" density={0.005} /> */}
        </Canvas>
      </div>
      
      <section id="titleSection" className="flex justify-around gap-20 z-10 absolute w-full top-1/2 -translate-y-1/2 font-oswald">
        <h1 className="text-[8vw]"><div>CREATIVE</div></h1>
        <h1 className="mt-[50vh] text-[8vw]"><div>DEVELOPER</div></h1>
      </section>

      <section id="scrollSection" className="flex flex-col items-center z-10 absolute bottom-10">
        <h1 className="mb-5 font-sm">SCROLL DOWN</h1>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 animate-bounce">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
        </svg>
      </section>

      <section id="aboutSection" className="flex flex-col z-10 absolute">
        <div className="w-64">
          <h1 className="text-3xl border-b-2">Naiden Naidenov</h1>
          <p className="text-lg">Creative developer with a passion in computer graphics</p>
        </div>
        
        <div className="w-64">
          <h1 className="text-3xl border-b-2 w-40">What I do</h1>
          <p className="text-lg">I specialise in creating interactive and immersive web experiences using next.js and three.js</p>
        </div>
      </section>
    </div>
  );
}
