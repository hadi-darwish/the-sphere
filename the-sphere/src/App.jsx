import { useState } from "react";
import * as THREE from "three";
import "./App.css";

function App() {
  const scene = new THREE.Scene();

  //create a sphere
  const geometry = new THREE.SphereGeometry(5, 32, 32);
  const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  const sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);

  //create a camera
  const camera = new THREE.PerspectiveCamera(45, 800, 600);
  scene.add(camera);

  //create a renderer
  const canvas = document.querySelector(".webgl");
  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(800, 600);
  renderer.render(scene, camera);
  return (
    <>
      <canvas className="webgl"></canvas>
    </>
  );
}

export default App;
