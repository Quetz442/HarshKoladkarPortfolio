import { useRef, useEffect } from "react";
import GradientSpheres from "../components/GradientSpheres";
import HeroExperience from "../components/HeroExperience";

const Hero = () => {
  const scrollTimeout = useRef(null);
  const isScrolling = useRef(false);

  // Smooth scroll to bottom function (interruptable)
  const handleExploreClick = () => {
    if (isScrolling.current) return; // Prevent multiple scrolls
    isScrolling.current = true;

    const scrollStep = 20;
    const scrollInterval = 10;

    function smoothScroll() {
      if (
        window.innerHeight + window.scrollY <
          document.body.offsetHeight &&
        isScrolling.current
      ) {
        window.scrollBy(0, scrollStep);
        scrollTimeout.current = setTimeout(smoothScroll, scrollInterval);
      } else {
        clearTimeout(scrollTimeout.current);
        isScrolling.current = false;
      }
    }
    smoothScroll();
  };

  // Stop scrolling on mouse click
  useEffect(() => {
    const stopScroll = () => {
      if (isScrolling.current) {
        isScrolling.current = false;
        clearTimeout(scrollTimeout.current);
      }
    };
    window.addEventListener("mousedown", stopScroll);
    return () => {
      window.removeEventListener("mousedown", stopScroll);
      clearTimeout(scrollTimeout.current);
    };
  }, []);

  return (
    <section
      id="home"
      className="w-screen h-dvh overflow-hidden relative text-white-50 md:p-0 px-5"
    >
      <div className="gradient-box w-full h-96 absolute bottom-0 left-0 z-20"></div>
      <GradientSpheres
        sphere1Class="gradient-sphere sphere-1"
        sphere2Class="gradient-sphere sphere-2"
      />

      <div className="w-full h-full flex-center">
        <div className="container relative w-full h-full">
          <div className="md:mt-40 mt-20">
            <h1 className="font-bold md:text-9xl text-5xl">HARSH</h1>
            <h1 className="font-bold md:text-9xl text-5xl"> KOLADKAR</h1>
          </div>
          <div className="absolute w-full z-30 bottom-20 right-0">
            <div className="flex justify-between items-end">
              <div className="flex flex-col items-center md:gap-5 gap-1">
                <p className="md:text-base text-xs">Explore</p>
                <img
                  src="images/arrowdown.svg"
                  alt="arrowdown"
                  className="size-7 animate-bounce cursor-pointer"
                  onClick={handleExploreClick}
                />
              </div>
              <div className="flex flex-col items-end">
                <img src="/images/shape.svg" alt="shape" />
                <h1 className="font-bold md:text-9xl text-5xl">Full Stack</h1>
                <h1 className="font-bold md:text-9xl text-5xl">Developer</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-full absolute top-0 left-0">
        <HeroExperience />
      </div>
    </section>
  );
};

export default Hero;
