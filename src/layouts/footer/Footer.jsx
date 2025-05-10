// src/components/layout/Footer.js
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white shadow-inner px-6 py-4 text-center text-sm text-gray-500">
      © {new Date().getFullYear()} CarRentalPro. All rights reserved.
    </footer>
  );
};

export default Footer;
