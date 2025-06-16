import { useRef, useEffect } from "react";
import HeroExperience from "../components/HeroExperience";
import StarsCanvas from "../components/StarBg"; // ✅ Starry background

const Hero = () => {
  const scrollTimeout = useRef(null);
  const isScrolling = useRef(false);

  const handleExploreClick = () => {
    if (isScrolling.current) return;
    isScrolling.current = true;

    const scrollStep = 30;

    const smoothScroll = () => {
      if (
        window.innerHeight + window.scrollY <
          document.body.offsetHeight &&
        isScrolling.current
      ) {
        window.scrollBy(0, scrollStep);
        scrollTimeout.current = requestAnimationFrame(smoothScroll);
      } else {
        cancelAnimationFrame(scrollTimeout.current);
        isScrolling.current = false;
      }
    };

    smoothScroll();
  };

  useEffect(() => {
    const stopScroll = () => {
      if (isScrolling.current) {
        isScrolling.current = false;
        cancelAnimationFrame(scrollTimeout.current);
      }
    };

    window.addEventListener("mousedown", stopScroll);
    window.addEventListener("wheel", stopScroll, { passive: true });

    return () => {
      window.removeEventListener("mousedown", stopScroll);
      window.removeEventListener("wheel", stopScroll);
      cancelAnimationFrame(scrollTimeout.current);
    };
  }, []);

  return (
    <section
      id="home"
      className="w-screen h-dvh overflow-hidden relative text-white md:p-0 px-5"
    >
      {/* ✅ Starry Background - Z-0 */}
      <div className="absolute inset-0 z-0">
        <StarsCanvas />
      </div>

      {/* Background Gradient Overlay - Z-20 */}
      <div className="gradient-box w-full h-96 absolute bottom-0 left-0 z-20"></div>

      {/* Main Content - Z-30 */}
      <div className="w-full h-full flex-center relative z-30">
        <div className="container relative w-full h-full">
          {/* Floating Navigation Pills */}
          <div className="levitating-pills-container pointer-events-none">
            {/* Left-side pills */}
            <div className="levitating-pill pill-left pill-1 absolute top-[30%] left-[20%]">
              <a href="#home" className="pill-link">
                Home
              </a>
            </div>
            <div className="levitating-pill pill-left pill-2 absolute top-[60%] left-[20%]">
              <a href="#about" className="pill-link">
                About
              </a>
            </div>

            {/* Right-side pills */}
            <div className="levitating-pill pill-right pill-1 absolute top-[30%] right-[20%]">
              <a href="#projects" className="pill-link">
                Projects
              </a>
            </div>
            <div className="levitating-pill pill-right pill-2 absolute top-[60%] right-[20%]">
              <a href="#contact" className="pill-link">
                Contact
              </a>
            </div>
          </div>

          {/* Central Name */}
          <div className="absolute bottom-30 left-1/2 transform -translate-x-1/2 text-center z-30">
            <h1 className="font-bold text-white md:text-9xl text-6xl whitespace-nowrap">
              HARSH KOLADKAR
            </h1>
          </div>

          {/* Explore Button */}
          <div
            className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-30 flex flex-col items-center text-white cursor-pointer"
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

      {/* Additional Hero Visuals */}
      <div className="w-full h-full absolute top-0 left-0 z-20">
        <HeroExperience />
      </div>
    </section>
  );
};

export default Hero;
