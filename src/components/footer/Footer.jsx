import React, { useState, useEffect } from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../api/ApiRequest';


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
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Site Info */}
          <div>
            <img 
              src={siteData?.logo} 
              alt={siteData?.siteName} 
              className="h-12 mb-4"
            />
            <p className="text-gray-400 mb-4">
              {siteData?.siteName}
            </p>
            <div className="flex space-x-4">
              <a href={siteData?.socialMedia?.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href={siteData?.socialMedia?.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href={siteData?.socialMedia?.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href={siteData?.socialMedia?.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Horizontal Navigation Links */}
          <div className="col-span-2">
            <nav className="flex flex-wrap justify-center md:justify-end gap-4 md:gap-8">
              <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                Home
              </Link>
              <Link to="/cars/all" className="text-gray-400 hover:text-white transition-colors">
                Cars
              </Link>
              <Link to="/tours/all" className="text-gray-400 hover:text-white transition-colors">
                Tours
              </Link>
              <Link to="/blog" className="text-gray-400 hover:text-white transition-colors">
                Blog
              </Link>
              <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                About Us
              </Link>
              <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                Contact Us
              </Link>
              <Link to="/feedback" className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors">
                <Star className="w-4 h-4" />
                <span>Feedback</span>
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="col-span-3">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center">
                <MapPin className="text-blue-500 mr-3" size={18} />
                <span className="text-gray-400">{siteData?.address}</span>
              </div>
              <div className="flex items-center">
                <Phone className="text-blue-500 mr-3" size={18} />
                <a href={`tel:${siteData?.phone}`} className="text-gray-400 hover:text-white transition-colors">
                  {siteData?.phone}
                </a>
              </div>
              <div className="flex items-center">
                <Mail className="text-blue-500 mr-3" size={18} />
                <a href={`mailto:${siteData?.email}`} className="text-gray-400 hover:text-white transition-colors">
                  {siteData?.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} {siteData?.copyrightText}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 