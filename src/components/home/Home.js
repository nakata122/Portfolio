import React, { Component , useRef, useState, useMemo, useEffect } from "react";
import * as THREE from "three";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stats } from "@react-three/drei";
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { PointsMaterial } from "three";

const dummy = new THREE.Object3D();

extend({ EffectComposer, RenderPass, UnrealBloomPass });


const rands = [];
let pos = [];
let count = 0;
for (let x = 0; x < 20; x++) {
  for (let z = 0; z < 20; z++) {
    pos[count] = new THREE.Vector2(x, z);
    rands[count++] = Math.random() * 3;
    pos[count] = new THREE.Vector2(x, z);
    rands[count++] = Math.random() * 3;
  }
}

const Boxes = ({ i, j, maxSize, layer, col, wireframe }) => {
  
  const { camera } = useThree();

  let material;
  if(wireframe) material = new THREE.MeshBasicMaterial({ color: col });
  else material = new THREE.MeshLambertMaterial({ color: col });
  material.wireframe = wireframe;
  const boxesGeometry = new THREE.CylinderBufferGeometry(maxSize, maxSize, 0.5, 3);
  const ref = useRef();

  useFrame(({ clock }) => {
    let counter = 0;
    const t = clock.oldTime * 0.001;
    for (let x = 0; x < i; x++) {
      for (let z = 0; z < j; z++) {
        let id = counter++;
        
        let nX = pos[id].x, nZ = pos[id].y;
        if(nX < Math.floor(camera.position.x)) pos[id].x += i;
        if(nX > Math.floor(camera.position.x) + i) pos[id].x -= i;
        if(nZ < Math.floor(camera.position.z)) pos[id].y += j;
        if(nZ > Math.floor(camera.position.z) + j) pos[id].y -= j;
        dummy.position.set(nX - i / 2, 0, nZ - j / 2);
        dummy.scale.set(1, (Math.cos(rands[id]*10 + t)+maxSize + 1) * rands[id], 1);
        dummy.rotation.set(0, 0, 0);
        dummy.updateMatrix();
        ref.current.setMatrixAt(id, dummy.matrix);
        
        id = counter++;
        
        nX = pos[id].x; 
        nZ = pos[id].y;
        if(nX < Math.floor(camera.position.x)) pos[id].x += i;
        if(nX > Math.floor(camera.position.x) + i) pos[id].x -= i;
        if(nZ < Math.floor(camera.position.z)) pos[id].y += j;
        if(nZ > Math.floor(camera.position.z) + j) pos[id].y -= j;

        dummy.position.set(nX - 0.5 - i / 2, 0, nZ - 0.58 - j / 2);
        dummy.scale.set(1, (Math.cos(rands[id]*10 + t)+maxSize + 1) * rands[id], 1);
        dummy.rotation.set(0, Math.PI, 0);
        dummy.updateMatrix();
        ref.current.setMatrixAt(id, dummy.matrix);
      }
    }
    ref.current.layers.set(layer);
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={ref} args={[boxesGeometry, material, i * j * 2]} />;
};

const Bloom = ({ children }) => {
  
  const { gl, scene, camera, size } = useThree();

  const [bloom, final] = useMemo(() => {
    const renderScene = new RenderPass(scene, camera)
    const comp = new EffectComposer(gl)
    comp.renderToScreen = false
    comp.addPass(renderScene)
    comp.addPass(new UnrealBloomPass(new THREE.Vector2( window.innerWidth, window.innerHeight ),1, 0.1, 0))

    const finalComposer = new EffectComposer(gl)
    finalComposer.addPass(renderScene)
    const finalPass = new ShaderPass(
      new THREE.ShaderMaterial({
        uniforms: { baseTexture: { value: null }, bloomTexture: { value: comp.renderTarget2.texture } },
        vertexShader:
          'varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 ); }',
        fragmentShader:
          'uniform sampler2D baseTexture; uniform sampler2D bloomTexture; varying vec2 vUv; void main() { gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) ); }'
      }),
      'baseTexture'
    )
    finalPass.needsSwap = true
    finalComposer.addPass(finalPass)
    return [comp, finalComposer]
  }, [])

  useEffect(() => {
    bloom.setSize(size.width, size.height)
    final.setSize(size.width, size.height)
  }, [bloom, final, size])

  useFrame(({ scene, camera }) => {
    scene.background = new THREE.Color( 0x000000 );
    
    camera.layers.set( 1 );
    bloom.render();
    camera.layers.set( 0 );
    scene.background = new THREE.Color( 0x28104E );
    
    final.render();
    
  }, 1)

  return null
}

const Home = () => {
    return (
      <Canvas camera={{ position: [0, 3, 0] }}>
        <color attach="background" args={0x32D50} />
        <ambientLight intensity={0.5} layers={1}/>
        <ambientLight intensity={0.5} layers={0}/>
        <pointLight position={[0, 10, 0]} layers={0}/>
        <Boxes i={20} j={20} maxSize={0.58} layer={0} wireframe={false} col={0x1E0233}/>
        <Boxes i={20} j={20} maxSize={0.55} layer={1} wireframe={true} col={0x9754CB}/>
        <Boxes i={20} j={20} maxSize={0.5} layer={1} wireframe={false} col={0x000000}/>
        
        {/* <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0,0.5,0]} layers={1}>
          <planeBufferGeometry attach="geometry" args={[1000, 1000]} />
          <meshBasicMaterial attach="material" color="black"/>
        </mesh> */}
        <Bloom />
        <OrbitControls />
        <Stats />
      </Canvas>
    );
};

export default Home;
