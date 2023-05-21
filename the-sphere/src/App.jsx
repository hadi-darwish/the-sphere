import { useEffect, useRef } from "react";
import * as THREE from "three";
import "./App.css";

function App() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const scene = new THREE.Scene();

    //create a sphere
    const geometry = new THREE.SphereGeometry(3, 64, 64);
    const material = new THREE.MeshStandardMaterial({ color: 0x0000ff });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    //adding sizes
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    //create a light
    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(0, 10, 10);
    scene.add(light);

    //create a camera
    const camera = new THREE.PerspectiveCamera(
      45,
      sizes.width / sizes.height,
      0.1,
      100
    );
    camera.position.z = 20;
    scene.add(camera);

    //create a renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.render(scene, camera);

    //resize
    window.addEventListener("resize", () => {
      //update sizes
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;

      //update camera
      camera.aspect = sizes.width / sizes.height;

      //update renderer
      renderer.setSize(sizes.width, sizes.height);
    });
  });
  return (
    <>
      <canvas className="webgl" id="webgl" ref={canvasRef}></canvas>
    </>
  );
}

export default App;
