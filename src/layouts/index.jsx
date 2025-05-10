// src/components/layout/Layout.js
import React from "react";
import { useLocation } from "react-router-dom";
import Header from "./header/Header";
import Footer from "../components/Footer";


const Layout = ({ children }) => {
  const location = useLocation();

  // Routes that should NOT show layout (like login/register)
  const excludedRoutes = ["/login", "/register"];

  const isAuthPage = excludedRoutes.includes(location.pathname);

  return (
    <>
      {!isAuthPage && <Header />}
      <main className="min-h-[calc(100vh-160px)] px-4 py-6 bg-gray-50">
        {children}
      </main>
      {!isAuthPage && <Footer />}
    </>
  );
};

export default Layout;
