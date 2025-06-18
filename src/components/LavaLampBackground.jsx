import React, { useEffect, useRef } from "react";
import "../Styles/LavaLampBackground.css";

const NUM_BLOBS = 4;

const randomColor = () =>
  ["#00ffe7", "#7f7fff", "#00ffb3", "#ff00e7"][Math.floor(Math.random() * 4)];

const LavaLampBackground = () => {
  const blobs = useRef([]);
  const mouseActive = useRef(false);
  const lastMouseMove = useRef(Date.now());

  useEffect(() => {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let centerX = window.innerWidth / 2;
    let centerY = window.innerHeight / 2;
    let blobData = Array(NUM_BLOBS)
      .fill(0)
      .map(() => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        color: randomColor(),
        size: 220 + Math.random() * 120,
        offset: Math.random() * 1000,
      }));

    blobs.current = blobData;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      mouseActive.current = true;
      lastMouseMove.current = Date.now();
    };

    window.addEventListener("mousemove", handleMouseMove);

    let anim;
    function animate() {
      // If no mouse movement for 2 seconds, return to center
      const now = Date.now();
      const followMouse = mouseActive.current && now - lastMouseMove.current < 2000;

      blobs.current.forEach((blob, i) => {
        let targetX, targetY;
        if (followMouse) {
          targetX = mouseX + Math.sin(now / 2000 + blob.offset) * 120;
          targetY = mouseY + Math.cos(now / 1800 + blob.offset) * 120;
        } else {
          targetX = centerX + Math.sin(now / 2000 + blob.offset) * 120;
          targetY = centerY + Math.cos(now / 1800 + blob.offset) * 120;
        }
        blob.x += (targetX - blob.x) * 0.01;
        blob.y += (targetY - blob.y) * 0.01;
        const el = document.getElementById(`lava-blob-${i}`);
        if (el) {
          el.style.left = `${blob.x - blob.size / 2}px`;
          el.style.top = `${blob.y - blob.size / 2}px`;
        }
      });
      anim = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(anim);
    };
  }, []);

  return (
    <div className="lava-lamp-bg">
      {Array(NUM_BLOBS)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            id={`lava-blob-${i}`}
            className="lava-blob"
            style={{
              background: blobs.current[i]?.color || "#00ffe7",
              width: blobs.current[i]?.size || 300,
              height: blobs.current[i]?.size || 300,
              filter: `blur(${60 + Math.random() * 20}px)`,
            }}
          />
        ))}
    </div>
  );
};

export default LavaLampBackground;