import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const ThreeDViewer: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.05, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Append renderer to the div
    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    // Set up the GLTFLoader with DRACOLoader for compressed models
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();

    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.4.3/'); 
    loader.setDRACOLoader(dracoLoader);

    // Load the .glb model
    loader.load(
      // URL to the .glb file
      // '/ses-fuel_chass_shifting_battery_headrest_fea.glb',
      '/ses-fuel_chass_shifting_battery_headrest_fea.glb',
      (gltf) => {
        const root = gltf.scene;
        scene.add(root);

        // Function to recursively print all subassemblies (children)
        const printSubassemblies = (object: THREE.Object3D, parentName: string = '') => {
          if (object instanceof THREE.Group || object instanceof THREE.Mesh) {
            console.log(`Subassembly: ${parentName}${object.name ? ' - ' + object.name : ''}`);
          }

          object.children.forEach((child) => {
            printSubassemblies(child, `${parentName}${object.name ? object.name + ' > ' : ''}`);
          });
        };

        // Print all subassemblies of the root object
        printSubassemblies(root);


        // Compute the bounding box of the model to find its center
        // const box = new THREE.Box3().setFromObject(root);
        // const center = new THREE.Vector3();
        // box.getCenter(center);

        // Adjust the OrbitControls to rotate around the model's center
        const controls = new OrbitControls(camera, renderer.domElement);
        // controls.target.copy(center); // Set the target to the center of the model
        controls.enableZoom = true;

        // Set initial camera position
        // camera.lookAt(center);   

        // Update camera position based on the bounding box size
        // const size = box.getSize(new THREE.Vector3());

        camera.position.set(-1.9, .5, 3.75);
        // camera.lookAt(center); // Ensure the camera looks at the model's center

        scene.background = new THREE.Color(0xffffff);
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
      },
      (error) => {
        console.error('An error happened', error);
      }
    );

    // Add lighting to the scene
    const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 5, 5).normalize();
    scene.add(directionalLight);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
      console.log(camera.position);
    };
    animate();

    // Cleanup on component unmount
    return () => {
      renderer.dispose();
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
};

export default ThreeDViewer;
