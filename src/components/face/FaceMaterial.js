import * as THREE from "three"
import { extend } from "@react-three/fiber"

export class FaceMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      side: THREE.DoubleSide,
      transparent: true,
      uniforms: {
        effectFactor: { value: 0.2 },
        lightPos:{ value: new THREE.Vector3(0,0,1)}
      },
      vertexShader: `
      uniform float effectFactor;
      attribute vec3 center;
      attribute float rand;
      varying vec3 vNormal;
      uniform vec3 lightPos;

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
        vNormal = normal;
        vec3 newCenter = mix(position, center + normal * 0.1 * distance(position, lightPos), 0.6);
        vec4 newPos = vec4( newCenter, 1.0 ) * Translate(-center) * rotateZ(effectFactor + rand*10.0) * rotateY(effectFactor + rand*10.0) * Translate(center);

        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos.xyz, 1.0);
      }`,
      fragmentShader: `
      uniform vec3 lightPos;
      varying vec3 vNormal;

      void main() {
        
        vec3 light = lightPos;

        float dProd = max(0.0, dot(vNormal, light));

        gl_FragColor = vec4(dProd, dProd, dProd*2.0, 0.5); 
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
}

extend({ FaceMaterial });
