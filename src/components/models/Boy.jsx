import { useGraph, useFrame } from "@react-three/fiber";
import { useGLTF, useFBX, useProgress } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useThree } from "@react-three/fiber";

export function Boy(props) {
  const group = useRef();
  const levitateGroup = useRef(); // Group for levitating effect
  const { progress } = useProgress();
  const [isIntroAnimationDone, setIsIntroAnimationDone] = useState(false);

  const { scene } = useGLTF("/models/hero.glb");
  const floatAnim = useFBX("/models/Float.fbx");
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clone);

  const mixer = useRef();
  const mouse = useRef({ x: 0, y: 0 });
  const headLookTarget = useRef(new THREE.Vector3(0, 0, 2)); // Persistent target
  const bodyTargetY = useRef(0); // Target rotation for the body

  // Access the camera from the scene
  const { camera } = useThree();

  useEffect(() => {
    if (clone && floatAnim.animations && floatAnim.animations.length > 0) {
      mixer.current = new THREE.AnimationMixer(clone);
      const action = mixer.current.clipAction(floatAnim.animations[0]);
      action.play();
    }
    return () => {
      if (mixer.current) mixer.current.stopAllAction();
    };
  }, [clone, floatAnim]);

  useEffect(() => {
    let frameId;
    function animate() {
      if (mixer.current) mixer.current.update(0.016);

      // Levitating effect
      if (levitateGroup.current) {
        const t = performance.now() * 0.001; // Time in seconds
        levitateGroup.current.position.y = Math.sin(t * 2) * 0.08; // Up & down motion
      }

      frameId = requestAnimationFrame(animate);
    }
    animate();
    return () => cancelAnimationFrame(frameId);
  }, []);

  useGSAP(() => {
    if (progress === 100 && group.current) {
      // Start well below the final position
      group.current.position.y = -60;

      // Animate the group to rise up
      gsap.to(group.current.position, {
        y: -15, // Final position
        duration: 3,
        ease: "power3.out",
      });

      // Animate the group to bend forward naturally
      group.current.rotation.x = 0; // Ensure no initial tilt
      gsap.to(group.current.position, {
        z: -5, // Move slightly forward to simulate bending
        duration: 1.5,
        ease: "power3.out",
      });
      gsap.to(group.current.rotation, {
        x: Math.PI / 8, // Slight forward bend
        duration: 1.5,
        ease: "power3.out",
      });
      gsap.to(group.current.rotation, {
        x: 0, // Reset to default upright position
        duration: 1.5,
        delay: 1.5, // Start after the first bend animation
        ease: "power3.out",
      });

      // Animate the head to look down and then return to default
      const head = clone.getObjectByName("Head");
      if (head) {
        gsap.to(head.rotation, {
          x: Math.PI / 4, // Look down
          duration: 1.5,
          ease: "power3.out",
        });
        gsap.to(head.rotation, {
          x: 0, // Reset to default position
          duration: 1.5,
          delay: 1.5, // Start after the look-down animation
          ease: "power3.out",
          onComplete: () => {
            // Mark intro animation as done after head animation completes
            setIsIntroAnimationDone(true);
          },
        });
      }
    }
  }, [progress]);

  useEffect(() => {
    if (isIntroAnimationDone) {
      const handleMouseMove = (event) => {
        const { innerWidth, innerHeight } = window;
        mouse.current.x = (event.clientX / innerWidth) * 2 - 1;
        mouse.current.y = -(event.clientY / innerHeight) * 2 + 1;
        // Set the target rotation for the body
        bodyTargetY.current = mouse.current.x * 0.5;
      };
      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }
  }, [isIntroAnimationDone]);

  useFrame(() => {
    if (isIntroAnimationDone && clone && group.current) {
      // Smoothly interpolate the body's rotation toward the target
      group.current.rotation.y += (bodyTargetY.current - group.current.rotation.y) * 0.07;

      // Dramatic, smooth head look-at
      const head = clone.getObjectByName("Head");
      if (head) {
        // Calculate the new target in front of the head, offset by mouse
        const headWorldPos = new THREE.Vector3();
        head.getWorldPosition(headWorldPos);
        const desiredTarget = headWorldPos.clone().add(
          new THREE.Vector3(mouse.current.x, mouse.current.y - 1, 2).applyQuaternion(group.current.quaternion)
        ); // Offset the target slightly below the mouse pointer

        // Smoothly interpolate the look target (lerp factor: 0.07 for drama)
        headLookTarget.current.lerp(desiredTarget, 0.07);

        // Make the head look at the smoothly-updated target
        head.lookAt(headLookTarget.current);
      }
    }
  });

  return (
    <group {...props} ref={group} dispose={null}>
      <group ref={levitateGroup}>
        <primitive object={clone} />
      </group>
    </group>
  );
}

useGLTF.preload("/models/hero.glb");
