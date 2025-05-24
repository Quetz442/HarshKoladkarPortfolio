import { footerIconsList } from "../constants";

const Footer = () => {
  return (
    <div className="w-full flex-center flex-col md:gap-10 gap-7 bg-black-300 py-10">
      <div>
        <img
          src="/images/logo.png"
          alt="logo"
          className="w-7 h-7 object-cover object-center"
        />
      </div>
      <div className="flex items-center md:gap-16 gap-8">
        {footerIconsList.map((icon, index) => (
          <div
            key={index}
            className="cursor-pointer hover:-translate-y-5 transition-all duration-700"
          >
            <img
              src={icon.icon}
              alt={icon.name}
              className="md:size-10 size-8"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Footer;
