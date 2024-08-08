import React, { Suspense, useRef, useState, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
import { ReactThreeFiber, useLoader } from '@react-three/fiber'
import {  useThree, useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei';
import fragmentShader from '../shaders/fragmentShader.js';
import vertexShader from '../shaders/vertexShader.js';



function Particles({count}) {
  const points = useRef();
  const lines = useRef();
  const { scene, camera } = useThree();
  const sky = useLoader(THREE.TextureLoader, 'preset2.png');
  let lastTime = 0;
  let lastImage = '';

  
  const holes = useMemo(() => {
    const temp = [];
    for(let i=0; i < 8; i++) {
      temp.push(new THREE.Vector3(
        Math.sin(2 * Math.PI / 8 * i) * 15,
        Math.cos(2 * Math.PI / 8 * i) * 15,
        0));
    }
    return temp;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  const uniforms = useMemo(() => ({
    uTime: {
      value: 0.0
    },
    myTex: {
      value: sky
    },
    uCamera: {
      value: camera.position
    }
    // Add any other attributes here
  }), [camera, sky])


  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const phi = Math.random() * Math.PI * 2;
      const radius = 50;
      const weight = Math.random();
      const position = new THREE.Vector3();
      const velocity = new THREE.Vector3(0,0,0);
      const life = Math.random();

      position.set(
        Math.pow(Math.random(), 2)*Math.random()*radius + (Math.sin(phi + (i % 8) * Math.PI/4)) * radius * 5,
        Math.pow(Math.random(), 2)*Math.random()*radius + (Math.cos(phi + (i % 8) * Math.PI/4)) * radius * 5,
        Math.pow(Math.random(), 2)*Math.random()*radius);
      
      temp.push({position, velocity, radius, phi, weight, life});
    }
    return temp;
  }, [count])

  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const phi = i/count * Math.PI + 0.2;
      const radius = i/count * 16;

      // positions.set([
      //   Math.pow(Math.random(), 2)*Math.random()*radius + (Math.sin(phi + (i % 4) * Math.PI/2)) * radius * 5,
      //   Math.pow(Math.random(), 2)*Math.random()*radius + (Math.cos(phi + (i % 4) * Math.PI/2)) * radius * 5,
      //   Math.pow(Math.random(), 2)*Math.random()*radius], i*3);

      
      positions.set([
        Math.pow(Math.random(), 2)*Math.random()*radius + (Math.sin(phi + (i % 8) * Math.PI/4)) * radius * 5,
        Math.pow(Math.random(), 2)*Math.random()*radius + (Math.cos(phi + (i % 8) * Math.PI/4)) * radius * 5,
        (Math.random()-0.5)*radius*2], i*3);
      
      

    }
    return positions;
  }, [particles, count])

  const particlesLife = useMemo(() => {
    const life = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      life[i] = particles[i].life;
    }
    return life;
  }, [particles, count])

  const particlesOffset = useMemo(() => {
    const offset = new Float32Array(count*2);
    const vals = [[0,0], [0.5,0], [0,0.5], [0.5,0.5]];
    for (let i = 0; i < count; i++) {
      let rand = vals[Math.floor(Math.random()*4)];

      offset.set(rand, i*2);
    }
    return offset;
  }, [count]);
  
  // const vertices = useMemo(() => {
  //   const temp = [];
  //   for (let i = 0; i < count; i++) {
  //     let phi = particles[i].phi;
  //     let radius = particles[i].radius;
  //     const start = [
  //       (Math.sin(phi)) * radius * 5,
  //       (Math.cos(phi)) * radius * 5,
  //       particles[i].start.z
  //     ];
  //     const end = [
  //       (Math.sin(phi-0.05)) * radius * 5.1,
  //       (Math.cos(phi-0.05)) * radius * 5.1,
  //       particles[i].start.z
  //     ];
      

  //     temp.push(start, end);
  //   }
  //   return temp
  // }, [particles, count])


  useFrame(({clock, raycaster}) => {
    if(!points.current) return;
    
    points.current.material.uniforms.uTime.value = clock.elapsedTime;
    
    // Go through each particle
    // particles.forEach((particle, i) => {
      
    //   let { position, velocity, weight } = particle;
    //   // Change position
    //   for(let j=0; j < 8; j++) {
    //     let speed = Math.min(1/Math.pow(holes[j].distanceTo(position),2), 1.0);
    //     let direction = holes[j].clone().sub(position).normalize().multiplyScalar(speed);
      
    //     // let direction = position.clone().normalize();
    //     particle.velocity.add(direction.multiplyScalar((clock.elapsedTime - lastTime)*0.1));
    //   }
    //   particle.position.add(particle.velocity);
    //   // particle.position.add(new THREE.Vector3(Math.sin(particle.phi + 0.2)*15, Math.cos(particle.phi + 0.2)*15,0).normalize().multiplyScalar(0.1));
    //   particle.life -= (clock.elapsedTime - lastTime) * 0.1;
    //   // particle.phi += (clock.elapsedTime - lastTime);


    //   if(particle.life <= 0) {
    //     particle.phi = Math.random() * Math.PI * 2;
    //     // const radius = 200;
    //     particle.life = Math.random()*0.2+0.8;
    //     particle.velocity.set(0,0,0);

        
    //   const phi = i/count * Math.PI;
    //   const radius = i/count * 16;

    //   particle.position.set(
    //     Math.pow(Math.random(), 2)*Math.random()*radius + (Math.sin(phi + (i % 8) * Math.PI/4)) * radius * 5,
    //     Math.pow(Math.random(), 2)*Math.random()*radius + (Math.cos(phi + (i % 8) * Math.PI/4)) * radius * 5,
    //     Math.pow(Math.random(), 2)*Math.random()*radius);
    //   }

      
    //   points.current.geometry.attributes.position.array[i*3] = particle.position.x;
    //   points.current.geometry.attributes.position.array[i*3+1] = particle.position.y;
    //   points.current.geometry.attributes.position.array[i*3+2] = particle.position.z;
    //   points.current.geometry.attributes.aLife.array[i] = particle.life;
    //   // particle.radius -= 0.1 * (clock.elapsedTime - lastTime) * particle.speed;
    //   // particle.rotation.add(new THREE.Vector3(1 * (clock.elapsedTime - lastTime),2 * (clock.elapsedTime - lastTime),0));
    // });
    // // console.log(particlesPosition);
    // points.current.geometry.attributes.position.needsUpdate = true;
    points.current.geometry.attributes.aLife.needsUpdate = true;
    // lines?.current.rotateZ(-0.1 * (clock.elapsedTime - lastTime));

    lastTime = clock.elapsedTime;
  })
  return (
    <>
      {/* <instancedMesh ref={mesh} geometry={new THREE.IcosahedronGeometry(0.3,1)} args={[null, null, count]}>
        <meshBasicMaterial attach="material" map={sky} color={0x808080}/>
      </instancedMesh> */}
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesPosition.length / 3}
          array={particlesPosition}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aLife"
          count={particlesLife.length}
          array={particlesLife}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aOffset"
          count={particlesOffset.length}
          array={particlesOffset}
          itemSize={2}
        />
      </bufferGeometry>
      <shaderMaterial
        depthWrite={false}
        // depthTest={false}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
        transparent={true}
        blending={THREE.AdditiveBlending}
      />
    </points>

      {/* <Line
          ref={lines}
          points={vertices}       // Array of points, Array<Vector3 | Vector2 | [number, number, number] | [number, number] | number>
          color="#808080"                   // Default
          lineWidth={0.3}                   // In pixels (default)
          segments={true}                        // If true, renders a THREE.LineSegments2. Otherwise, renders a THREE.Line2
          
        /> */}
    </>
  )
}

export { Particles };