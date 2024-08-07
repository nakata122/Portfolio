import React, { Suspense, useRef, useState, useEffect, useMemo, forwardRef } from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
import { ReactThreeFiber, ThreeEvent, useLoader } from '@react-three/fiber'
import {  useThree, useFrame } from '@react-three/fiber'
import { MeshDistortMaterial, Line } from "@react-three/drei";
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Particles } from '../components/particleSystems'


function Spheres({count, radius}: {count:number, radius:number}) {
  const mesh = useRef<THREE.InstancedMesh>(null!);
  const group = useRef<THREE.Group>(null!);
  const orbits = useRef<THREE.Group>(null!);
  const { scene, camera } = useThree();
  camera.near = 0.01;
  let lastTime = 0;
  camera.position.set(0.01,0.01,68);
  gsap.registerPlugin(ScrollTrigger);

  const data = [['3D Exhibition', 'Landing page'], ['VR game', 'Avoid'], ['Flower', 'Factory']];
  const vidSrc = ['./web1.mp4', './web2.mp4', './game1.mp4', './game2.mp4', 'experiment1.mp4', 'experiment2.mp4'];
  const [videos, videoTextures]:[videos:HTMLVideoElement[], videoTextures:THREE.VideoTexture[]] = useMemo(() => {
    const videos = [];
    const videoTextures = [];
    for(let i=0; i < vidSrc.length; i++) {
      const video = document.createElement('video');
      video.src = vidSrc[i];
      video.crossOrigin = "Anonymous";
      video.controls = true;
      video.muted = true;
      video.loop = true; 
      video.preload = 'metadata';
      // video.autoplay = true;
      // video.play();
  
      videos.push(video);
      videoTextures.push(new THREE.VideoTexture(video));
    }
    return [videos, videoTextures];
  }, []);

  const displacement = useLoader(THREE.TextureLoader, 'perlin_noise.png');
  displacement.wrapS = THREE.RepeatWrapping;
  displacement.wrapT = THREE.RepeatWrapping;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 1; i <= count; i++) {
      const scale = 1;
      const start = new THREE.Vector3(
        Math.sin(2 * Math.PI / count * i) * radius,
        Math.cos(2 * Math.PI / count * i) * radius,
        0
      );
      

      temp.push({ start, scale });
    }
    
    return temp
  }, [count, radius])

  const vertices = useMemo(() => {
    const temp = [];
    for (let i = 0; i <= count; i++) {
      const start = new THREE.Vector3(
        Math.sin(2 * Math.PI / count * (i+0.25)) * radius,
        Math.cos(2 * Math.PI / count * (i+0.25)) * radius,
        0
      );
      const end = new THREE.Vector3(
        Math.sin(2 * Math.PI / count * (i+0.75)) * radius,
        Math.cos(2 * Math.PI / count * (i+0.75)) * radius,
        0
      );
      

      temp.push(start, end);
    }
    return temp
  }, [count, radius])
  
  useGSAP(
    () => {
        let tl = gsap.timeline({
          scrollTrigger: {
            start: 'top top',
            end: () => '+=' + window.innerHeight * 16,
            // markers: true,
            scrub: 1
          } 
        });
        
        tl.to(group.current.position, {  
          x: 0, 
          y: Math.cos(2 * Math.PI / count * (-2)) * 15, 
          z: 63 + Math.sin(2 * Math.PI / count * (-2)) * 15, duration: 1, ease: 'power4.inOut'
           });
        tl.to(group.current.rotation, {  
          x: 2 * Math.PI / count * (0), 
          y: -Math.PI / 2, 
          z: 0, duration: 1, ease: 'power4.inOut'
           }, '<');  
        
           
        orbits.current.children.forEach((orbit,j) => {

          for(let i=0; i < orbit.children.length - 1; i++) {
            tl.add(() => {
              videos[j*2+i].play();
              videos[Math.abs(j*2+i-1)].pause();
            });
  
            tl.to(orbit.rotation, {  
              x: 0,
              y: -2 * Math.PI / orbit.children.length * (i+1), 
              z: Math.PI / 4 * j, duration: 1
            }, '+=1');
  
            tl.add(() => {
              if(tl.scrollTrigger?.direction === 1) {
                videos[j*2+i+1].play();
                videos[Math.abs(j*2+i)].pause();
              }
              else {
                videos[j*2+i].play();
                videos[Math.abs(j*2+i+1)].pause();
              }
            });
          }

            
          tl.to(group.current.rotation, {  
            x: -2 * Math.PI / count * (j+1), 
            y: -Math.PI / 2, 
            z: 0, duration: 1, ease: 'power4.inOut'
            }, '+=1'); 
        });
        

    },
    [particles]
  );

  useEffect(() => {

    // Go through each particle
    particles.forEach((particle, i) => {
      
      let { start, scale } = particle;
      dummy.position.copy(start);
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      mesh.current?.setMatrixAt(i, dummy.matrix);
      
    })
    if(mesh.current)
    mesh.current.instanceMatrix.needsUpdate = true;

    orbits.current.children.forEach((orbit, j) => {
      
      orbit.children.forEach((child, i) => {
        let countChildren = orbit.children.length;
  
        let phi = 2 * Math.PI / countChildren * i + Math.PI / countChildren;
        let orbitCenter = new THREE.Vector3(
          Math.sin(phi) * 3,
          0,
          Math.cos(phi) * 3);
        
        child.position.copy(orbitCenter);
        child.rotation.y = phi;
      })

      orbit.position.copy(particles[j+1].start);
      orbit.rotation.z = -Math.PI / 4 * j;

    })
    
  })
  
  const [hovered, setHovered] = useState(false);
  const over = (e: ThreeEvent<PointerEvent>) => {e.stopPropagation(); setHovered(true); };
  const left = (e: ThreeEvent<PointerEvent>) => {e.stopPropagation(); setHovered(false); };

  useEffect(() => {
    if (hovered) document.body.style.cursor = 'pointer';
    else document.body.style.cursor = 'auto';
  }, [hovered])

  useFrame(({clock, raycaster}) => {
    if(!mesh.current) return;
    // group.current.lookAt(new THREE.Vector3(0,0,-68));
      // camera.lookAt(target.val);
      // console.log(camera.position);
      // camera.up.y = Math.max(-1, Math.min(1, camera.rotation.y)); //THIS TOOK ME 3 HOURS TO FIX
      // camera.up.y = camera.rotation.y > 0 ? 1 : -1;
    displacement.offset.y -= (lastTime - clock.elapsedTime) * 0.03;
    
    lastTime = clock.elapsedTime;
  })
  return (
    <group ref={group}>
      <instancedMesh ref={mesh} geometry={new THREE.IcosahedronGeometry(3,10)} args={[undefined, undefined, count]} frustumCulled={false}>
        <MeshDistortMaterial 
          color={new THREE.Color('rgb(0,0,0)')}
          distort={0.2} 
          speed={2} 
          transparent 
          side={THREE.DoubleSide} 
          opacity={0.5}
          roughness={0.0}
          metalness={1.0}
        // blending={THREE.AdditiveBlending}
        />
      </instancedMesh>

      <group ref={orbits}>
        {
          data.map((orbit, i) => {
            const inner = orbit.map((text, j) => {
              return (
                <group key={text}>
                  <mesh geometry={new THREE.PlaneGeometry(16/10,9/10)}  onPointerOver={over}  onPointerLeave={left}>
                    <meshStandardMaterial map={videoTextures[i*2+j]} side={THREE.DoubleSide}/>
                  </mesh>
                  <Text color="white" anchorX="center" anchorY="middle" fontSize={0.2} position={[0, -0.8, 0]}>
                    {text}
                  </Text>
                </group>)
            }) 

            return (
            <group key={i}>
              {inner}
            </group>);
          })
        }
      </group>

      {/* <mesh geometry={new THREE.CylinderGeometry(100, 100, 800, 1000, 1000, true)} position={[0,0,0]} rotation={[-Math.PI/2, 0, 0]}>
      <meshStandardMaterial 
          color={new THREE.Color(0x404040)}
          aoMap={displacement}
          lightMap={displacement}
          displacementMap={displacement}
          displacementScale={50}
          flatShading={true}
          roughness={0.6}
          side={THREE.BackSide}
        />
      </mesh> */}

      <Line
          points={vertices}       // Array of points, Array<Vector3 | Vector2 | [number, number, number] | [number, number] | number>
          color="grey"                   // Default
          lineWidth={2}                   // In pixels (default)
          segments={true}                        // If true, renders a THREE.LineSegments2. Otherwise, renders a THREE.Line2
          
        />
        <Particles count={2500} />
    </group>
  )
}

export { Spheres };