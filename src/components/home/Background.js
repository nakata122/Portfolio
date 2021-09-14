
import * as THREE from "three";
import React, { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";


const dummy = new THREE.Object3D();


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

const Prisms = ({ i, j, maxSize, layer, col, wireframe }) => {
  
  const { scene, camera } = useThree();

  let material;
  if(wireframe) material = new THREE.MeshBasicMaterial({ color: col });
  else material = new THREE.MeshLambertMaterial({ color: col });
  material.wireframe = wireframe;
  const prismGeometry = new THREE.CylinderBufferGeometry(maxSize, maxSize, 0.5, 3);
  const raycaster = new THREE.Raycaster();
  const ref = useRef();

  useFrame(({ clock }) => {
    let counter = 0;
    const t = clock.oldTime * 0.001;
    //Automatic scroll
    // window.scrollTo(0, clock.elapsedTime * 30); 

    raycaster.setFromCamera(new THREE.Vector2(0,0), camera);

    const intersects = raycaster.intersectObjects([scene.getObjectByName('plane')], true );
    let midPoint = new THREE.Vector3(0);

    if(intersects.length > 0)
    {
      midPoint = intersects[0].point;
    }
    else
    {
      midPoint = camera.position.clone();
    }

    for (let x = 0; x < i; x++) {
      for (let z = 0; z < j; z++) {
        let id = counter++;
        
        let nX = pos[id].x, nZ = pos[id].y;
        if(nX < Math.floor(midPoint.x)) pos[id].x += i;
        if(nX > Math.floor(midPoint.x) + i) pos[id].x -= i;
        if(nZ < Math.floor(midPoint.z)) pos[id].y += j;
        if(nZ > Math.floor(midPoint.z) + j) pos[id].y -= j;
        dummy.position.set(nX - i / 2, 0, nZ - j / 2);
        dummy.scale.set(1, (Math.cos(rands[id]*10 + t)+maxSize + 1) * rands[id], 1);
        dummy.rotation.set(0, 0, 0);
        dummy.updateMatrix();
        ref.current.setMatrixAt(id, dummy.matrix);
        
        id = counter++;
        
        nX = pos[id].x; 
        nZ = pos[id].y;
        if(nX < Math.floor(midPoint.x)) pos[id].x += i;
        if(nX > Math.floor(midPoint.x) + i) pos[id].x -= i;
        if(nZ < Math.floor(midPoint.z)) pos[id].y += j;
        if(nZ > Math.floor(midPoint.z) + j) pos[id].y -= j;

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

  return <instancedMesh ref={ref} args={[prismGeometry, material, i * j * 2]} />;
};

export default Prisms;