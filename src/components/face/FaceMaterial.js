import * as THREE from "three"
import { extend } from "@react-three/fiber"

export class FaceMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      side: THREE.DoubleSide,
      transparent: true,
      uniforms: {
        effectFactor: { value: 0.2 },
        lightPos:{ value: new THREE.Vector3(0,0,1)},
        animation: { value: 0.0 }
      },
      vertexShader: `
      uniform float effectFactor;
      uniform float animation;
      uniform vec3 lightPos;
      attribute vec3 center;
      attribute float rand;
      varying vec3 vNormal;

      mat4 rotateZ(float angle) {
        float s = sin(angle);
        float c = cos(angle);
      
        return mat4(
          c, s, 0.0, 0.0,
          -s, c, 0.0, 0.0,
          0.0, 0.0, 1.0, 0.0,
          0.0, 0.0, 0.0, 1.0
        );
      }

      mat4 rotateY(float angle)
      {
        float s = sin(angle);
        float c = cos(angle);

        return mat4(
          c,   0.0, -s,  0.0,
          0.0, 1.0, 0.0, 0.0,
          s,   0.0, c,   0.0,
          0.0, 0.0, 0.0, 1.0
        );
      }

      mat4 Translate(vec3 p) {
        return mat4(
          1.0, 0.0, 0.0, p.x,
          0.0, 1.0, 0.0, p.y,
          0.0, 0.0, 1.0, p.z,
          0.0, 0.0, 0.0, 1.0
        );
      }

      void main() {
        vNormal = (vec4( normal, 1.0 ) * Translate(-center) * rotateZ(effectFactor + rand*10.0) * rotateY(effectFactor + rand*10.0) * Translate(center)).xyz;
        // vNormal = normal;
        vec3 newCenter = mix(position, center , 0.3);
        vec4 newPos = vec4( newCenter, 1.0 ) * Translate(-center) * rotateZ(effectFactor + rand*10.0) * rotateY(effectFactor + rand*10.0) * Translate(center);
        newPos = vec4(mix(position + vec3(0.0,0.0, rand+0.3) * 200.0, newPos.xyz, min(max(effectFactor - 2.0, 0.0) * (rand / 10.0 + 0.2), 1.0)), 1.0);

        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos.xyz, 1.0);
      }`,
      fragmentShader: `
      uniform vec3 lightPos;
      varying vec3 vNormal;
      uniform float animation;

      void main() {
        
        vec3 light = lightPos;

        float dProd = max(0.0, dot(normalize(vNormal), light));

        gl_FragColor = vec4(0.1 * dProd, 0.6 * dProd, dProd, (0.2 + dProd) * animation); 
      }`
    })
  }

  get effectFactor() {
    return this.uniforms.effectFactor.value;
  }
  set effectFactor(v) {
    return (this.uniforms.effectFactor.value = v);
  }
  get lightPos() {
    return this.uniforms.lightPos.value;
  }
  set lightPos(v) {
    return (this.uniforms.lightPos.value = v);
  }
  get animation() {
    return this.uniforms.animation.value;
  }
  set animation(v) {
    return (this.uniforms.animation.value = v);
  }
}

extend({ FaceMaterial });
