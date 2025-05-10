import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { apiClient } from '../api/ApiRequest';

const Footer = () => {
  const [siteData, setSiteData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSiteData();
  }, []);

  const fetchSiteData = async () => {
    try {
      const response = await apiClient.get('/settings');
      if (response.status === 200) {
        setSiteData(response.data);
      }
    } catch (error) {
      console.error('Error fetching site data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <footer className="bg-white border-t border-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="container mx-auto px-4">
        {/* Navigation Links */}
        <div className="text-center py-12">
          <h2 className="text-gray-800 text-xl font-light uppercase tracking-widest mb-8 relative inline-block">
            WHERE TO?
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-blue-500"></div>
          </h2>
          <nav className="flex flex-wrap justify-center gap-x-12 gap-y-4">
            <Link to="/" className="text-gray-600 hover:text-blue-600 transition-all duration-300 text-sm uppercase tracking-wider hover:tracking-widest">
              Home
            </Link>
            <Link to="/cars/all" className="text-gray-600 hover:text-blue-600 transition-all duration-300 text-sm uppercase tracking-wider hover:tracking-widest">
              Cars
            </Link>
            <Link to="/tours/all" className="text-gray-600 hover:text-blue-600 transition-all duration-300 text-sm uppercase tracking-wider hover:tracking-widest">
              Tours
            </Link>
            <Link to="/blog" className="text-gray-600 hover:text-blue-600 transition-all duration-300 text-sm uppercase tracking-wider hover:tracking-widest">
              Blog
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-blue-600 transition-all duration-300 text-sm uppercase tracking-wider hover:tracking-widest">
              About Us
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-blue-600 transition-all duration-300 text-sm uppercase tracking-wider hover:tracking-widest">
              Contact Us
            </Link>
            <Link to="/feedback" className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-all duration-300 text-sm uppercase tracking-wider hover:tracking-widest group">
              <Star className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Feedback</span>
            </Link>
          </nav>
        </div>

        {/* Contact Info & Social Media */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-12 border-t border-gray-100">
          {/* Company Info */}
          <div className="text-center md:text-left">
            <img 
              src={siteData?.logo} 
              alt={siteData?.siteName} 
              className="h-8 mb-4 mx-auto md:mx-0"
            />
            <h3 className="text-gray-800 font-medium mb-4">{siteData?.siteName}</h3>
            <div className="flex justify-center md:justify-start space-x-4">
              <a href={siteData?.socialMedia?.facebook} target="_blank" rel="noopener noreferrer" 
                className="text-gray-400 hover:text-blue-600 transition-colors">
                <Facebook size={20} />
              </a>
              <a href={siteData?.socialMedia?.twitter} target="_blank" rel="noopener noreferrer" 
                className="text-gray-400 hover:text-blue-600 transition-colors">
                <Twitter size={20} />
              </a>
              <a href={siteData?.socialMedia?.instagram} target="_blank" rel="noopener noreferrer" 
                className="text-gray-400 hover:text-blue-600 transition-colors">
                <Instagram size={20} />
              </a>
              <a href={siteData?.socialMedia?.linkedin} target="_blank" rel="noopener noreferrer" 
                className="text-gray-400 hover:text-blue-600 transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Contact Details */}
          <div className="text-center md:text-left">
            <h3 className="text-gray-800 font-medium mb-4">Contact Details</h3>
            <div className="space-y-3">
              <a href={`tel:${siteData?.phone}`} 
                className="flex items-center justify-center md:justify-start gap-2 text-gray-600 hover:text-blue-600 transition-colors group">
                <Phone className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
                <span>{siteData?.phone}</span>
              </a>
              <a href={`mailto:${siteData?.email}`} 
                className="flex items-center justify-center md:justify-start gap-2 text-gray-600 hover:text-blue-600 transition-colors group">
                <Mail className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
                <span>{siteData?.email}</span>
              </a>
            </div>
          </div>

          {/* Address */}
          <div className="text-center md:text-left lg:col-span-2">
            <h3 className="text-gray-800 font-medium mb-4">Our Location</h3>
            <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600">
              <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <p className="leading-relaxed">{siteData?.address}</p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-100 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Branding and Marketing by</span>
              <img 
                src={siteData?.logo} 
                alt={siteData?.siteName} 
                className="h-6 hover:opacity-80 transition-opacity"
              />
            </div>
            <Link 
              to="#top" 
              className="text-gray-400 hover:text-blue-600 transition-colors flex items-center gap-1 group"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <span className="group-hover:-translate-y-0.5 transition-transform">Back to top</span>
            </Link>
            <div className="text-center md:text-right">
              <div className="text-gray-400">
                © {new Date().getFullYear()} {siteData?.copyrightText} — All rights reserved
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Architectural images are artist impressions
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 