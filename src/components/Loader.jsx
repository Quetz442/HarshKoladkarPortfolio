import { useGSAP } from "@gsap/react";
import { useProgress } from "@react-three/drei";
import gsap from "gsap";

const Loader = () => {
  const { progress } = useProgress();

  useGSAP(() => {
    if (progress === 100) {
      gsap.to(".loader-screen", {
        scale: 1.5, // Zoom in
        opacity: 0, // Fade out
        duration: 1, // Animation duration
        ease: "power2.inOut",
        onComplete: () => {
          document.querySelector(".loader-screen").style.display = "none"; // Hide after animation
        },
      });
    }
  }, [progress]);

  return (
    <div className="loader-screen bg-black-100 w-screen h-dvh fixed top-0 left-0 z-[100] flex justify-center items-center">
      <div className="relative w-full h-full">
        <img
          src="/images/loader.gif"
          alt="loader"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex justify-center items-center">
          <div className="text-white-50 font-bold text-7xl leading-none gradient-title">
            {Math.floor(progress)}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
