import * as THREE from "three"
import { extend } from "@react-three/fiber"

export class SphereMaterial extends THREE.ShaderMaterial {
  constructor(wireframe) {
    super({
        transparent: true,
      side: THREE.DoubleSide,
      uniforms: {
        effectFactor: { value: 0.2 },
        animation: { value: 0.0 }
      },
      vertexShader: `
      uniform float effectFactor;
      uniform float animation;
      attribute float rand;
      attribute vec3 center;
      varying vec3 vNormal;
      varying float vRand;

      void main() {
        vNormal = normal;
        vec3 newPos = mix(position, center, 0.6) + normal * (sin(effectFactor + rand * 100.0) + 1.0) / 4.0;
        newPos = mix(position, newPos, animation);
        vRand = rand;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
      }`,
      fragmentShader: `
      uniform float effectFactor;
      uniform float animation;
      varying vec3 vNormal;
      varying float vRand;

      void main() {
        float change = (sin(effectFactor + vRand * 100.0) + 1.0) / 2.0;
        gl_FragColor = vec4(0.1 * change, 0.4 * change, 0.7 * change, animation); 
      }`
    })
  }

  get effectFactor() {
    return this.uniforms.effectFactor.value;
  }
  set effectFactor(v) {
    return (this.uniforms.effectFactor.value = v);
  }
  get animation() {
    return this.uniforms.animation.value;
  }
  set animation(v) {
    return (this.uniforms.animation.value = v);
  }
}

extend({ SphereMaterial });
