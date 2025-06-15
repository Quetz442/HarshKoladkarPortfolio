import { useState, useEffect } from "react";
import { navItems } from "../constants";

const NavBar = () => {
  const [isVisible, setIsVisible] = useState(false); // State to track visibility
  const [shouldSpin, setShouldSpin] = useState(false); // State to trigger spin animation

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > window.innerHeight * 0.8); // Show navbar after leaving the home section
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setShouldSpin(true); // Trigger spin animation
      setTimeout(() => setShouldSpin(false), 2000); // Reset spin state after animation duration
    }, 5000); // Trigger every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  // Split navigation items into two groups
  const firstHalf = navItems.slice(0, Math.ceil(navItems.length / 2));
  const secondHalf = navItems.slice(Math.ceil(navItems.length / 2));

  return (
    <>
      {/* Inline CSS for the spin animation */}
      <style>
        {`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
              animation-timing-function: ease-in;
            }
            50% {
              transform: rotate(180deg);
              animation-timing-function: linear;
            }
            100% {
              transform: rotate(360deg);
              animation-timing-function: ease-out;
            }
          }
          .spin-animation {
            animation: spin 0.5s;
          }
        `}
      </style>

      <div
        className={`w-auto flex-center fixed z-50 top-5 left-1/2 transform -translate-x-1/2 md:px-10 px-5 py-2 transition-opacity duration-500 ${
          isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{
          background: "linear-gradient(to bottom, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.3))",
          backdropFilter: "blur(10px)", // Optional: Frosted glass effect
          borderRadius: "999px", // Pill shape
        }}
      >
        <div className="flex items-center gap-5">
          {/* First half of navigation links */}
          <div className="flex items-center gap-5">
            {firstHalf.map((item, index) => (
              <div
                key={index}
                className="relative after:absolute after:bg-gray-200 after:bottom-0 after:left-0 after:h-[2px]
                 after:w-full after:origin-bottom-right after:scale-x-0 hover:after:origin-bottom-left
                  hover:after:scale-x-100 after:transition-transform after:ease-in-out after:duration-300"
              >
                <a className="gradient-title text-base" href={item.href}>
                  {item.name}
                </a>
              </div>
            ))}
          </div>

          {/* Logo in the center */}
          <img
            src="/images/logo.png"
            alt="logo"
            className={`h-8 object-cover object-center transition-transform ${
              shouldSpin ? "spin-animation" : ""
            }`}
          />

          {/* Second half of navigation links */}
          <div className="flex items-center gap-5">
            {secondHalf.map((item, index) => (
              <div
                key={index}
                className="relative after:absolute after:bg-gray-200 after:bottom-0 after:left-0 after:h-[2px]
                 after:w-full after:origin-bottom-right after:scale-x-0 hover:after:origin-bottom-left
                  hover:after:scale-x-100 after:transition-transform after:ease-in-out after:duration-300"
              >
                <a className="gradient-title text-base" href={item.href}>
                  {item.name}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;
