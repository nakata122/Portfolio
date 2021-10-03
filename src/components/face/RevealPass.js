import * as THREE from 'three'
import { Mesh, OrthographicCamera, PlaneBufferGeometry, Scene, ShaderMaterial, UniformsUtils, Vector2 } from 'three'
import { Pass } from 'three/examples/jsm/postprocessing/Pass'

var WaterShader = {
  uniforms: {
    byp: { value: 0 }, //apply the glitch ?
    tex: { type: 't', value: null },
    faceTex: { type: 't', value: null },
    time: { type: 'f', value: 0.0 },
    factor: { type: 'f', value: 0.0 },
    resolution: { type: 'v2', value: null }
  },

  vertexShader: `varying vec2 vUv;
    void main(){  
      vUv = uv; 
      vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * modelViewPosition;
    }`,

  fragmentShader: `uniform int byp; //should we apply the glitch ?
    uniform float time;
    uniform float factor;
    uniform vec2 resolution;
    uniform sampler2D tex;
    uniform sampler2D faceTex;
    
    varying vec2 vUv;
    
    void main() {  
      gl_FragColor = mix(texture2D(tex, vUv), texture2D(faceTex, vUv), 0.2);
    }`
}

class WaterPass extends Pass {
  constructor(dt_size)
  {
    super();
    if (WaterShader === undefined) console.error('THREE.WaterPass relies on THREE.WaterShader')
    var shader = WaterShader
    this.uniforms = UniformsUtils.clone(shader.uniforms)
    if (dt_size === undefined) dt_size = 64
    this.uniforms['resolution'].value = new Vector2(dt_size, dt_size)
    this.uniforms['faceTex'].value = new THREE.TextureLoader().load( '/myFace.png' );
    this.material = new ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: shader.vertexShader,
      fragmentShader: shader.fragmentShader
    })
    this.camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1)
    this.scene = new Scene()
    this.quad = new Mesh(new PlaneBufferGeometry(2, 2), null)
    this.quad.frustumCulled = false // Avoid getting clipped
    this.scene.add(this.quad)
    this.factor = 0
    this.time = 0
  }

  render(renderer, writeBuffer, readBuffer, deltaTime, maskActive) {
    const factor = Math.max(0, this.factor)
    this.uniforms['byp'].value = factor ? 0 : 1
    this.uniforms['tex'].value = readBuffer.texture
    this.uniforms['time'].value = this.time
    this.uniforms['factor'].value = this.factor
    this.time += 0.05
    this.quad.material = this.material
    if (this.renderToScreen) {
      renderer.setRenderTarget(null)
      renderer.render(this.scene, this.camera)
    } else {
      renderer.setRenderTarget(writeBuffer)
      if (this.clear) renderer.clear()
      renderer.render(this.scene, this.camera)
    }
  }
}


export { WaterPass }
