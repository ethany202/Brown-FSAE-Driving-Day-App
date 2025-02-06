import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const ThreeDViewer: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // to select objects in the heatmap
  let selectedObject: THREE.Mesh | null = null;
  const highlightColor = new THREE.Color(0xff0000);
  const defaultColor = new THREE.Color(0xaaaaaa);

  // to toggle between heatmap and regular cad model 
  // TODO: add the toggle
  const [isHeatMap, setIsHeatMap] = useState(false);

  
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.05, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    // zoom
    // TODO: add pan? 
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = true;
    camera.position.set(-1.9, 0.5, 3.75);

    // lighting
    scene.add(new THREE.AmbientLight(0x404040));
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 5, 5).normalize();
    scene.add(directionalLight);

    // GLTFLoader with DRACO
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.4.3/');
    loader.setDRACOLoader(dracoLoader);

    // update file name here
    // loads file and includes loading bar
    loader.load(
      '/ses-fuel_chass_shifting_battery_headrest_fea.glb',
      (gltf) => {
        const root = gltf.scene;
        scene.add(root);
        // Assign default color and log subassemblies
        root.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            child.material = child.material.clone();
            child.material.color.set(defaultColor);
            console.log(`Subassembly: ${child.name}`);
          }
        });
        setIsLoading(false); // Hide loading bar when finished
      },
      (xhr) => {
        setLoadingProgress((xhr.loaded / xhr.total) * 100);
      },
      (error) => {
        console.error('Error loading model:', error);
        setIsLoading(false);
      }
    );


    // Raycasting for subassembly selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseClick = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        const clickedObject = intersects[0].object as THREE.Mesh;

        if (clickedObject.material instanceof THREE.MeshStandardMaterial) {
          // Reset previous selection
          if (selectedObject && selectedObject.material instanceof THREE.MeshStandardMaterial) {
            selectedObject.material.color.set(defaultColor);
          }

          // Highlight new selection
          selectedObject = clickedObject;
          if (Array.isArray(selectedObject.material)) {
            selectedObject.material.forEach((mat) => {
              if (mat instanceof THREE.MeshStandardMaterial) {
                mat.color.set(highlightColor);
              }
            });
          } else if (selectedObject.material instanceof THREE.MeshStandardMaterial) {
            selectedObject.material.color.set(highlightColor);
          }
          
          console.log(`Selected Subassembly: ${selectedObject.name}`);
        }
      }
    };

    window.addEventListener('click', onMouseClick);

    // allows us to move the model around
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      renderer.dispose();
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  // loading bar; helpful for large files
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {isLoading && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          background: '#ddd', width: '200px', height: '20px', borderRadius: '5px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${loadingProgress}%`, height: '100%',
            background: '#4caf50', transition: 'width 0.1s'
          }} />
        </div>
      )}
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default ThreeDViewer;
