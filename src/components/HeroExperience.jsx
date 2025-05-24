import { Canvas } from "@react-three/fiber";
import { Boy } from "./models/Boy"; // If you rename Boy to Hero, update this line

const HeroExperience = () => {
  return (
    <Canvas>
      <ambientLight />
      <directionalLight position={[-2, 0, 3]} intensity={3} color={"#FF28D5"} />
      <directionalLight position={[2, 0, 3]} intensity={3} color={"#1C34FF"} />

      <group>
        <Boy scale={9} />
      </group>
    </Canvas>
  );
};

export default HeroExperience;
