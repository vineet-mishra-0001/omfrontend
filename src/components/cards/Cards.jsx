import React from "react";
import SVG from "../svg";

const Cards = ({description, title, icon}) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-4">
       <SVG />
      </div>
      <h3 className="font-medium text-gray-900">{title || 'No Hidden Fees'}</h3>
      <p className="text-gray-500 text-sm mt-2">
       {description || 'Transparent pricing with no surprises'}
      </p>
    </div>
  );
};

export default Cards;
