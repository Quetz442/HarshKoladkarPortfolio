import { Canvas } from "@react-three/fiber";
import { Boy } from "./models/Boy";

const HeroExperience = () => {
  return (
    <Canvas camera={{ position: [0, 0, 25], fov: 45 }}>
      <ambientLight />
      <directionalLight position={[-2, 0, 3]} intensity={3} color={"#FF28D5"} />
      <directionalLight position={[2, 0, 3]} intensity={3} color={"#1C34FF"} />
      <group position={[0, 5, 0]}>
        <Boy scale={10} />
      </group>
    </Canvas>
  );
};

export default HeroExperience;
