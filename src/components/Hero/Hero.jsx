import React from "react";
import { ChevronRight, Star } from "lucide-react";
import Button from "../button/Button";
import Cards from "../cards/Cards";

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden bg-white -mt-5">
      {/* Curved SVG Background */}
      <div className="absolute inset-0 z-0">
        <svg
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
        >
          <path
            fill="#3B82F6"
            fillOpacity="0.05"
            d="M0,192L48,176C96,160,192,128,288,128C384,128,480,160,576,165.3C672,171,768,149,864,144C960,139,1056,149,1152,144C1248,139,1344,117,1392,106.7L1440,96L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          ></path>
          <path
            fill="#3B82F6"
            fillOpacity="0.03"
            d="M0,64L48,80C96,96,192,128,288,138.7C384,149,480,139,576,128C672,117,768,107,864,101.3C960,96,1056,96,1152,117.3C1248,139,1344,181,1392,202.7L1440,224L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          ></path>
        </svg>
      </div>

      <div className="container mx-auto px-4 pt-20 pb-24 relative z-10">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-blue-100 rounded-full p-2 mr-2">
              <Star className="h-5 w-5 text-blue-600" />
            </div>
            <span className="text-blue-600 font-medium text-sm uppercase tracking-wider">Premium Car Rental Service</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 max-w-4xl leading-tight">
            Find Your Perfect Drive For Any Journey
          </h1>
          
          <p className="text-lg text-gray-600 max-w-2xl mb-8">
            Experience the freedom of the open road with our premium fleet of vehicles.
            Book easily, drive confidently, and explore without limits.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-[500px]">
            <Button className="px-8 py-3 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition shadow-md flex items-center justify-center">
              Browse Cars <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
            <Button className="px-8 py-3 bg-white text-blue-600 border border-blue-600 font-medium rounded-full hover:bg-blue-50 transition flex items-center justify-center">
              Learn More
            </Button>
          </div>
        </div>
        
        {/* Center Image */}
        <div className="relative mt-6 flex justify-center">
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-40 h-40 rounded-full bg-blue-100 blur-3xl opacity-40"></div>
          
          <div className="relative">
            <div className="absolute -top-6 -left-6 bg-yellow-400 rounded-full w-12 h-12 flex items-center justify-center shadow-lg">
              <span className="font-bold text-xs">24/7</span>
            </div>
            
            <div className="absolute -bottom-4 -right-4 bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center shadow-lg">
              <span className="font-bold text-white text-xs">TOP<br/>RATED</span>
            </div>
            
            <img
              src="/hero.jpg"
              alt="Premium car rental"
              className="rounded-xl shadow-2xl max-w-full md:max-w-6xl object-cover z-10 relative"
            />
          </div>
          
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white px-8 py-4 rounded-full shadow-lg flex items-center z-20">
            <span className="text-blue-600 font-medium mr-2">4.9</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <span className="ml-2 text-gray-500 text-sm">2,500+ Happy Customers</span>
          </div>
        </div>
        
        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 className="font-medium text-gray-900">Quick Booking</h3>
            <p className="text-gray-500 text-sm mt-2">Book your car in less than 5 minutes</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <h3 className="font-medium text-gray-900">Fully Insured</h3>
            <p className="text-gray-500 text-sm mt-2">All vehicles include comprehensive insurance</p>
          </div>
          
          <Cards />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;