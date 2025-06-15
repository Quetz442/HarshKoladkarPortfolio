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

  // Stop scrolling on mouse click or mouse wheel
  useEffect(() => {
    const stopScroll = () => {
      if (isScrolling.current) {
        isScrolling.current = false;
        clearTimeout(scrollTimeout.current);
      }
    };

    window.addEventListener("mousedown", stopScroll);
    window.addEventListener("wheel", stopScroll); // Stop scrolling on mouse wheel

    return () => {
      window.removeEventListener("mousedown", stopScroll);
      window.removeEventListener("wheel", stopScroll); // Cleanup on unmount
      clearTimeout(scrollTimeout.current);
    };
  }, []);

  return (
    <section
      id="home"
      className="w-screen h-dvh overflow-hidden relative text-white md:p-0 px-5"
    >
      {/* Background Gradient */}
      <div className="gradient-box w-full h-96 absolute bottom-0 left-0 z-20"></div>
      <GradientSpheres
        sphere1Class="gradient-sphere sphere-1"
        sphere2Class="gradient-sphere sphere-2"
      />

      {/* Main Content */}
      <div className="w-full h-full flex-center">
        <div className="container relative w-full h-full">
          {/* Levitating Pills */}
          <div className="levitating-pills-container pointer-events-none">
            {/* Left-side pills */}
            <div className="levitating-pill pill-left pill-1 absolute top-[40%] left-[30%]">
              <a href="#home" className="pill-link">
                Home
              </a>
            </div>
            <div className="levitating-pill pill-left pill-2 absolute top-[60%] left-[30%]">
              <a href="#about" className="pill-link">
                About
              </a>
            </div>

            {/* Right-side pills */}
            <div className="levitating-pill pill-right pill-1 absolute top-[40%] right-[30%]">
              <a href="#projects" className="pill-link">
                Projects
              </a>
            </div>
            <div className="levitating-pill pill-right pill-2 absolute top-[60%] right-[30%]">
              <a href="#contact" className="pill-link">
                Contact
              </a>
            </div>
          </div>

          {/* Name at the Bottom */}
          <div className="absolute bottom-30 left-1/2 transform -translate-x-1/2 text-center z-30">
            <h1 className="font-bold text-white md:text-9xl text-6xl whitespace-nowrap">
              HARSH KOLADKAR
            </h1>
          </div>

          {/* Explore Button Below the Name */}
<div
  className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-30 flex flex-col items-center text-white cursor-pointer"
  onClick={handleExploreClick}
>
  <p className="md:text-base text-xs">EXPLORE</p>
  <div className="animate-bounce mt-2">
    <img
      src="images/CaretRight.svg"
      alt="arrowdown"
      className="w-6 h-6 md:w-8 md:h-8 rotate-90"
    />
  </div>
          </div>
        </div>
      </div>

      {/* Hero Experience */}
      <div className="w-full h-full absolute top-0 left-0">
        <HeroExperience />
      </div>
    </section>
  );
};

export default Hero;
