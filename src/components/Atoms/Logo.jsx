import React from "react";

function Logo({ children }) {
  return (
    <div className="align-center justify-center">
      <a
        href="/"
        className="italic font-extralight font-Comforter text-2xl md:text-4xl"
      >
        {children}
      </a>
    </div>
  );
}

export default Logo;
