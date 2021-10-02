import React from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import { Stats, OrbitControls, Billboard, Text, useTexture } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { Suspense, useMemo, useRef } from "react";
import { PlaneBufferGeometry, Vector3 } from "three";
import { FaceMaterial } from "./FaceMaterial.js";
import { Bloom } from '../home/Bloom.js';

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
    console.log(geo);
    
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
      
      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects([scene.getObjectByName('plane')], true );
      if(intersects.length > 0)
      {
        scene.getObjectByName('Mask').lookAt(intersects[0].point);
        // scene.getObjectByName('Pivot').lookAt(intersects[0].point);
        ref.current.lightPos = intersects[0].point;
      }
    });

    return (
      <mesh name={'Mask'} scale={[0.05,0.05,0.05]}>
        <bufferGeometry {...geo} />
        <faceMaterial ref={ref}/>
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


const Face = () => {
    return (
      <div style={{width: '100vw', height: '100vh', overflowX: 'hidden'}}>
      <Canvas camera={{ position: [0, 0, 2] }}>
        <Bloom>
        <color attach="background" args={0x111111} />
        <pointLight position={[0, 1, 1]}/>
        <Suspense  fallback={null}>
            <Model />
        </Suspense>
        
        <mesh position={[0,0,0.8]} name={'plane'}>
          <planeGeometry args={[1000, 1000]} />
          <meshBasicMaterial color="black" visible={false}/>
        </mesh>
      
        {/* <mesh name={'Pivot'}>
          <Eye pos={[-0.1, 0.12, 0.25]} />
          <Eye pos={[0.1, 0.12, 0.25]} />
        </mesh> */}
        </Bloom>
        {/* <OrbitControls />
        <Stats /> */}
      </Canvas>

      </div>
    );
};

export default Face;
