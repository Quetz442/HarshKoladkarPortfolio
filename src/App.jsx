import {
  Loader,
  NavBar,
  Hero,
  About,
  TechStack,
  Projects,
  Contact,
} from "./sections";

const App = () => {
  return (
    <div className="bg-black-100">
      <Loader />
      <NavBar />
      <Hero />
      <About />
      <TechStack />
      <Projects />
      <Contact />
    </div>
  );
};

export default App;
