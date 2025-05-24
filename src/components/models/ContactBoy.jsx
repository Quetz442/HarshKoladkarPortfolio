import { useGraph } from "@react-three/fiber";
import { useGLTF, useFBX } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

export function ContactBoy(props) {
  const group = useRef();
  const levitateGroup = useRef();
  const headBone = useRef();

  // Load model and all animations
  const { scene } = useGLTF("/models/hero.glb");
  const fallingIdleAnim = useFBX("/models/FallingIdle.fbx");
  const floatAnim = useFBX("/models/Float.fbx");
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes } = useGraph(clone);

  const mixer = useRef();
  const [currentAnim, setCurrentAnim] = useState("fallingIdle"); // fallingIdle, float
  const [isLevitating, setIsLevitating] = useState(false);

  // Mouse follow state
  const mouse = useRef({ x: 0, y: 0 });
  const targetHeadRot = useRef({ x: 0, y: 0 });
  const lerpedHeadRot = useRef({ x: 0, y: 0 });

  // Find the head bone (adjust the bone name as needed)
  useEffect(() => {
    if (!nodes) return;
    // Try common head bone names, adjust as needed for your model
    headBone.current =
      nodes.Head ||
      nodes.head ||
      nodes.Neck ||
      nodes.neck ||
      Object.values(nodes).find(
        (n) => n.isBone && /head|neck/i.test(n.name)
      );
  }, [nodes]);

  // Animation sequence logic
  useEffect(() => {
    if (!clone) return;
    mixer.current = new THREE.AnimationMixer(clone);

    let action;
    let timeout1;

    // Always start with fallingIdle
    setCurrentAnim("fallingIdle");
    setIsLevitating(false);

    action = mixer.current.clipAction(fallingIdleAnim.animations[0]);
    action.reset().fadeIn(0.5).play();

    // After 3 seconds, smoothly crossfade to float and levitate
    timeout1 = setTimeout(() => {
      setCurrentAnim("float");
      setIsLevitating(true);
      const floatAction = mixer.current.clipAction(floatAnim.animations[0]);
      floatAction.reset().fadeIn(1.0).play();
      action.crossFadeTo(floatAction, 1.0, false); // 1s crossfade
    }, 3000);

    return () => {
      if (mixer.current) mixer.current.stopAllAction();
      clearTimeout(timeout1);
    };
  }, [clone, fallingIdleAnim, floatAnim]);

  // Animation mixer update & mouse/levitate & head follow
  useEffect(() => {
    let frameId;
    function animate() {
      if (mixer.current) mixer.current.update(0.016);

      // Dramatic, slow lerp for head rotation
      lerpedHeadRot.current.x += (targetHeadRot.current.x - lerpedHeadRot.current.x) * 0.07;
      lerpedHeadRot.current.y += (targetHeadRot.current.y - lerpedHeadRot.current.y) * 0.07;

      // Apply to head bone if found
      if (headBone.current) {
        headBone.current.rotation.y = lerpedHeadRot.current.x;
        headBone.current.rotation.x = lerpedHeadRot.current.y;
      }

      // Dramatic, slow lerp for group rotation (body)
      if (group.current) {
        group.current.rotation.y += (targetHeadRot.current.x * 0.3 - group.current.rotation.y) * 0.07;
        group.current.rotation.x += (targetHeadRot.current.y * 0.1 - group.current.rotation.x) * 0.07;
      }

      // Levitating effect (only during float)
      if (isLevitating && levitateGroup.current) {
        const t = performance.now() * 0.001;
        levitateGroup.current.position.y = Math.sin(t * 2) * 0.08; // up & down, centered at 0
      } else if (levitateGroup.current) {
        levitateGroup.current.position.y = 0;
      }
      frameId = requestAnimationFrame(animate);
    }
    animate();
    return () => cancelAnimationFrame(frameId);
  }, [isLevitating]);

  // Mouse move handler
  useEffect(() => {
    function onMouseMove(e) {
      // Normalize mouse to [-1, 1]
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
      // Dramatic effect: amplify
      targetHeadRot.current.x = mouse.current.x * 0.5; // Yaw
      targetHeadRot.current.y = mouse.current.y * 0.25; // Pitch
    }
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  return (
    <group {...props} ref={group} dispose={null}>
      <group ref={levitateGroup}>
        <primitive object={clone} />
      </group>
    </group>
  );
}

useGLTF.preload("/models/hero.glb");
