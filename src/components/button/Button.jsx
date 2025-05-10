import React from "react";

const Button = ({ onClick, className, children }) => {
  return (
    <button
      onClick={onClick}
      type="submit"
      className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg py-3.5 font-medium transition-all  shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:translate-y-0.5 active:translate-y-1${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
