import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
import "./App.css";

function App() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const scene = new THREE.Scene();

    //create a sphere
    const geometry = new THREE.SphereGeometry(3, 64, 64);
    const material = new THREE.MeshStandardMaterial({
      color: "#aa3355",
      metalness: 0.7,
      roughness: 0.5,
    });
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
    light.intensity = 1.25;
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
    renderer.setPixelRatio(2);
    renderer.render(scene, camera);

    //orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 5;

    //resize
    window.addEventListener("resize", () => {
      //update sizes
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;

      //update camera
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();

      //update renderer
      renderer.setSize(sizes.width, sizes.height);
    });

    const loop = () => {
      controls.update();
      window.requestAnimationFrame(loop);
      renderer.render(scene, camera);
    };
    loop();

    //animation
    const t1 = gsap.timeline({
      defaults: { duration: 1 },
    });
    const t2 = gsap.timeline({
      defaults: { duration: 1 },
    });
    t1.fromTo(sphere.scale, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 });
    t2.fromTo("nav", { y: "-100%" }, { y: "0%" });
    t1.fromTo(".title", { opacity: 0 }, { opacity: 1 });

    //mouse animation color
    let mouseDown = false;
    let rgb = [];
    window.addEventListener("mousedown", () => {
      mouseDown = true;
    });
    window.addEventListener("mouseup", () => {
      mouseDown = false;
    });
    window.addEventListener("mousemove", (e) => {
      if (mouseDown) {
        rgb = [
          Math.round((e.pageX / sizes.width) * 255),
          Math.round((e.pageY / sizes.height) * 255),
          Math.round(
            ((e.pageX + e.pageY) / (sizes.width + sizes.height)) * 255
          ),
        ];
        let newColor = new THREE.Color(`rgb(${rgb.join(",")})`);
        gsap.to(sphere.material.color, {
          r: newColor.r,
          g: newColor.g,
          b: newColor.b,
        });
      }
    });
  }, []);
  return (
    <>
      <canvas className="webgl" id="webgl" ref={canvasRef}></canvas>
      <nav>
        <a href="/">The Sphere</a>
        <ul>
          <li>Explore</li>
          <li>Create</li>
        </ul>
      </nav>
      <h1 className="title">Give it a spin</h1>
    </>
  );
}

export default App;
