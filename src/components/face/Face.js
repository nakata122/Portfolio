import React from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree, useLoader, extend } from "@react-three/fiber";
import { Stats, OrbitControls, Billboard } from '@react-three/drei';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { Suspense, useMemo, useRef, useEffect } from "react";
import { FaceMaterial } from "./FaceMaterial.js";
import { SphereMaterial } from "./SphereMaterial.js";


import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { WaterPass } from './RevealPass.js'


extend({ EffectComposer, ShaderPass, RenderPass, WaterPass, UnrealBloomPass });

const Model = () => {
  
    const { scene, camera } = useThree();

    const gltf = useLoader(OBJLoader, './male_head.obj');
    const geo = gltf.children[0].geometry;
    const ref = useRef();
    const raycaster = new THREE.Raycaster();
    let time = 0.0;

    const vertices = [...geo.attributes.position.array];
    let centers = [];
    let rand = [];
    
    for(let i=0;i<vertices.length;i+=9){
      let avX = (vertices[i] + vertices[i+3] + vertices[i+6])/3;
      let avY = (vertices[i+1] + vertices[i+4] + vertices[i+7])/3;
      let avZ = (vertices[i+2] + vertices[i+5] + vertices[i+8])/3;
      let temp = Math.random();
      rand[i/3] = temp;
      rand[i/3+1] = temp;
      rand[i/3+2] = temp;
      for(let j=0;j<9;j+=3) {
        centers[i + j] = avX;
        centers[i + 1 + j] = avY;
        centers[i + 2 + j] = avZ;
      }
    }

    geo.setAttribute( 'center', new THREE.Float32BufferAttribute( centers, 3 ));
    geo.setAttribute( 'rand', new THREE.Float32BufferAttribute( rand, 1 ));

    useFrame(({clock, mouse}) => {
      time = clock.elapsedTime;
      ref.current.effectFactor = time;
      ref.current.animation = Math.min(Math.max(time - 2, 0.0) / 4, 1.0);
      
      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects([scene.getObjectByName('plane')], true );
      if(intersects.length > 0 && time > 6)
      {
        scene.getObjectByName('Mask').lookAt(intersects[0].point);
        ref.current.lightPos = intersects[0].point;
      }
    });

    return (
      <mesh name={'Mask'} scale={[0.03,0.03,0.03]}>
        <bufferGeometry {...geo} />
        <faceMaterial ref={ref}/>
      </mesh>
    );
};


const Sphere = ({wireframe}) => {
  
  const { scene, camera } = useThree();

  const gltf = useLoader(OBJLoader, './sphere.obj');
  const geo = gltf.children[0].geometry;
  const ref = useRef();
  let time = 0.0;

  
  const vertices = [...geo.attributes.position.array];
  let centers = [];
  let rand = [];
  
  for(let i=0;i<vertices.length;i+=9){
    let avX = (vertices[i] + vertices[i+3] + vertices[i+6])/3;
    let avY = (vertices[i+1] + vertices[i+4] + vertices[i+7])/3;
    let avZ = (vertices[i+2] + vertices[i+5] + vertices[i+8])/3;
    let temp = Math.random();
    rand[i/3] = temp;
    rand[i/3+1] = temp;
    rand[i/3+2] = temp;
    for(let j=0;j<9;j+=3) {
      centers[i + j] = avX;
      centers[i + 1 + j] = avY;
      centers[i + 2 + j] = avZ;
    }
  }

  geo.setAttribute( 'center', new THREE.Float32BufferAttribute( centers, 3 ));
  geo.setAttribute( 'rand', new THREE.Float32BufferAttribute( rand, 1 ));

  
  useFrame(({clock, mouse}) => {
    time = clock.elapsedTime;
    ref.current.material.effectFactor = time;
    ref.current.material.animation = Math.min(Math.max(time - 6, 0.0), 1.0);
    ref.current.rotation.x = time / 10.0;
    let newScale = Math.min(Math.max(time - 4.0, 0.0) / 4, 2);
    // ref.current.scale.set(newScale, newScale, newScale);

  });

  return (
    <mesh scale={[2,2,2]}  ref={ref}>
      <bufferGeometry {...geo} />
      <sphereMaterial wireframe={wireframe}/>
    </mesh>
  );
};


const Eye = ({pos}) => {
  const texture = useMemo(() => new THREE.TextureLoader().load('./eye.png'), ['./eye.png']);

  return (
    <Billboard position={pos}>
      <mesh>
          <planeBufferGeometry attach="geometry" args={[0.05, 0.05]}/>
          <meshBasicMaterial attach="material" map={texture} transparent={true}  depthTest={false}/>
      </mesh>
    </Billboard>
  );
}

function Effect() {
  const composer = useRef()
  const { scene, gl, size, camera } = useThree()
  const aspect = useMemo(() => new THREE.Vector2(size.width, size.height), [size])
  useEffect(() => void composer.current.setSize(size.width, size.height), [size])
  useFrame(() => composer.current.render(), 1)
  return (
    <effectComposer ref={composer} args={[gl]}>
      <renderPass attachArray="passes" scene={scene} camera={camera} />
      {/* <waterPass attachArray="passes" factor={1.5} /> */}
      <unrealBloomPass attachArray="passes" args={[aspect, 1, 1, 0]} />
    </effectComposer>
  )
}


const Face = () => {
    return (
      <div style={{width: '100vw', height: '100vh', overflowX: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        
      <svg width="300px" height="300px" viewBox="-4 -1 38 28" id="mySvg">
        <polygon fill="transparent"
                  stroke = "#fff"
                  strokeWidth="1"
                  points="15,0 30,30 0,30">
        </polygon>
      </svg>
      
      <Canvas camera={{ position: [0, 0, 2] }}>
        <Effect />

        {/* <color attach="background" args={0x000011} /> */}
        <pointLight position={[0, 1, 1]}/>
        <Suspense  fallback={null}>
            <Model />
            {/* <Sphere wireframe={true}/> */}
            <Sphere wireframe={false}/>
        </Suspense>
        
        <mesh position={[0,0,1]} name={'plane'}>
          <planeGeometry args={[1000, 1000]} />
          <meshBasicMaterial color="black" visible={false}/>
        </mesh>

        <mesh position={[0,0,-2.5]} name={'plane'}>
          <planeGeometry args={[1000, 1000]} />
          <meshBasicMaterial color="black"/>
        </mesh>
      
        {/* <mesh name={'Pivot'}>
          <Eye pos={[-0.1, 0.12, 0.25]} />
          <Eye pos={[0.1, 0.12, 0.25]} />
        </mesh> */}

        {/* <OrbitControls /> */}
        <Stats />
      </Canvas>

      </div>
    );
};

export default Face;
