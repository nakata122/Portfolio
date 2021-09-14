
import * as THREE from "three";
import React, { Component , useRef, useState, useMemo, useEffect } from "react";
import { useFrame, useThree, extend } from "@react-three/fiber";
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

extend({ EffectComposer, RenderPass, UnrealBloomPass });

const Bloom = () => {
  
    const { gl, scene, camera, size } = useThree();
  
    const [bloom, final] = useMemo(() => {
      const renderScene = new RenderPass(scene, camera)
      const comp = new EffectComposer(gl)
      comp.renderToScreen = true
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
      scene.background = new THREE.Color( 0x0f0015 );
      
      camera.layers.set( 1 );
      bloom.render();
      camera.layers.set( 0 );
      scene.background = new THREE.Color( 0x28104E );
      
      // final.render();
      
    }, 1)
  
    return null;
}

export default Bloom;