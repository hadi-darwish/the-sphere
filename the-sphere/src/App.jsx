import { useEffect, useRef } from "react";
import * as THREE from "three";
import "./App.css";

function App() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const scene = new THREE.Scene();

    //create a sphere
    const geometry = new THREE.SphereGeometry(5, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: 0x0000ff });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    //create a light
    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(0, 5, 10);
    scene.add(light);

    //create a camera
    const camera = new THREE.PerspectiveCamera(45, 800 / 600);
    camera.position.z = 20;
    scene.add(camera);

    //create a renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
    });
    renderer.setSize(800, 600);
    renderer.render(scene, camera);
  });
  return (
    <>
      <canvas className="webgl" id="webgl" ref={canvasRef}></canvas>
    </>
  );
}

export default App;
