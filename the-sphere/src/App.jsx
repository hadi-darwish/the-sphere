import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
import "./App.css";
import admin from "firebase-admin";

function App() {
  const canvasRef = useRef(null);
  useEffect(() => {
    admin.initializeApp({
      credential: admin.credential.cert(
        JSON.stringify({
          type: "service_account",
          project_id: "wen-l7ajez-1",
          private_key_id: "93b935054bfa33ccc68e64ac88232d4e534b736a",
          private_key:
            "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDtCWs1P+jzhPbK\n67G+p0BZi7dL7uftN69BbXaieTI7+0Va7hjzHpypS/WHuBT8tqGR+y6NxSDFTKaP\n9fKXc03CoaCnX71OVrsEUx3CCE1yo6w/8quXeqWq5z92DNaDIF2MN9OtgKz84Yxr\nmiY4hnoLpfPmxXU/F574lY1g/qZk2sU5eM+Uv/fYQUzdl5gcY141y5df3CeeHPOA\n+CGS0qBAD2VubY+dDXSRtl8hXyrlX6uIHTCOROtzfi8EVaRNjzoje3jYH3yp+ylZ\nkFRL4DK8DdjpRDJfFSvLT8Zjv0eI2MZzBVELLSrv3hO/kWhLbuGcKDWw8divrAKy\neYYAyWQbAgMBAAECggEAL6DbXl1DoR7f+gEm+3Ce4P9Oat8L0iIEwIhOtLHWkq/Y\nDT/XWo6VmvzszoMCEI9f4rXOcmUgQxS2SSn5v03HW6rfXZJCtwl9VY6f5ZuGeFkD\n5OuNaAgYXsFNgppsxfdMZL7Y9T1sRPnLHdnhAS2gO1PysLWPbAiChF+Eg29Xnt7l\njMUZaJeQ0k8jVC+4Tbp855b0yg2LpjcIDnrgwQV4Lx88ibJ4sgFveIgSllRpLow+\nno0S3916KkTyuHiTrZ36e5RPGujAt8s/bo78O46DOlR+b3DIHIKXLUa8wOv1SDhs\ndbN8iNhLBCnRaU8F2aCXf2OBBEy3HBlUKE3JWO1XSQKBgQD6kWuElnEu1RdyuWul\n51rtXdIquFbyxDuEVFV/Jxb9+VRxiMqDPKAWxWWeAuKQHov4i6ZdxTbD0QdVdzMs\nvyHhu4ROJ1FWHfEgq4mY8UTmQ7eQoW3lZRlIZMLmMsHADazckPlLgNuME6RwL7hG\nQKFcPkM1EKlWrxeTl2jTpSskQwKBgQDyLOd83SSe7S1guuk6IyveQxVhyXxd7Gda\netrP/a1IbldswkPZ4/yzTpqMLNzm7N0G+2ublfMVZRHKGQp5iRZ0cB1zbp+ZJZla\ndZU5TBvuCq32ehsH7bGX6pc3qPjSGXDk5OVhIIIqbtZu9rBVmFRdy95Tl27xcBc7\nuOv7D4FvSQKBgQCory2K3RzlQl++xEVMMyxrkDXkvKUMWj8XHw9Pwqkf4bKPnF95\nal779XgroBWWoHnqoVkm15W+zgH5731sKmBM70hqtN109ENYkyLW69ZOjlgN7h9l\nx2H18p+jCZiWCp7M/mxWADHNY4vYWsfbw7bduqzUFJtr2AQvQEc59H/OsQKBgQDi\nJizF3X0lLDcD7Yd+UvnURLDi8FTDINAjHjbXo/z9do0NcxwJjW2dw/lujTZ8LxT4\nQDDsycqGYCuMnnW5qNrfQRM/iD5htUrPvp3rM7ehQzfQw5YagU0moFs2DwTMrhVO\nqrHJUaI8HeUBGjzwsZ+XN5oWVYO00wffLYCwonosgQKBgQCrwiZcLvgVd06UFMZP\nNIQfT4vFerCcG0kryJf/LpyWXN3jZasxfIhdksWNHMCiWLkvCT5kBOM0f0v8vpb+\nGA8Hf9Z/ArMx+CxZLa3o9oJ8BgSJjxDvlG95iA/PApMqAuZ/0WPaxWLQvXtSV4ze\nG68yzvUZuq7/LmqZAjwR554l/w==\n-----END PRIVATE KEY-----\n",
          client_email:
            "firebase-adminsdk-decld@wen-l7ajez-1.iam.gserviceaccount.com",
          client_id: "113803706995385507627",
          auth_uri: "https://accounts.google.com/o/oauth2/auth",
          token_uri: "https://oauth2.googleapis.com/token",
          auth_provider_x509_cert_url:
            "https://www.googleapis.com/oauth2/v1/certs",
          client_x509_cert_url:
            "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-decld%40wen-l7ajez-1.iam.gserviceaccount.com",
          universe_domain: "googleapis.com",
        })
      ),
    });

    const db = admin.firestore();

    async function archiveOldReports() {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const snapshot = await db
        .collection("reports")
        .where("timestamp", "<=", oneHourAgo)
        .get();

      if (!snapshot.empty) {
        const batch = db.batch();
        const archiveRef = db.collection("archived");

        snapshot.docs.forEach((doc) => {
          const archiveDocRef = archiveRef.doc(doc.id);
          batch.set(archiveDocRef, doc.data());
          batch.delete(doc.ref);
        });

        await batch.commit();
        console.log("Archived old reports.");
      }
    }
    archiveOldReports();
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
