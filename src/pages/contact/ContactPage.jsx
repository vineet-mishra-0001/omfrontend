import React, { useState, useContext, useEffect } from "react";
import { Phone, Mail, MessageCircle, Clock, Send, Loader, MapPin } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { apiClient } from "../../api/ApiRequest";
import toast from "react-hot-toast";

const ContactPage = () => {
  const { currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [siteData, setSiteData] = useState(null);
  const [contactLoading, setContactLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: currentUser ? currentUser.username : "",
    email: currentUser ? currentUser.email : "",
    subject: "",
    message: ""
  });

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
      toast.error('Failed to load contact information');
    } finally {
      setContactLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.subject || !formData.message) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const response = await apiClient.post("/contact/send", {
        ...formData,
        userId: currentUser?._id // Include userId if user is logged in
      });

      toast.success("Message sent successfully! We'll get back to you soon.");
      
      // Reset form
      setFormData({
        fullName: currentUser ? currentUser.username : "",
        email: currentUser ? currentUser.email : "",
        subject: "",
        message: ""
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(error.response?.data?.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[400px] overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=2000')`
          }}
        ></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/50"></div>
        
        {/* Content */}
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-2 rounded-full bg-blue-500/20 text-blue-100 backdrop-blur-sm mb-4">
              Contact Us
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Get in Touch
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-xl">
              We'd love to hear from you. Our friendly team is always here to help you with your travel plans.
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50"></div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              <span className="relative inline-block">
                Contact Information
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-200 to-blue-400 transform -skew-x-12"></div>
              </span>
            </h2>
            
            {/* Contact Cards */}
            {!contactLoading && siteData && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {/* Phone */}
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-blue-100 transform -skew-y-3 origin-top-left opacity-50 group-hover:opacity-100 transition-all duration-300 rounded-xl"></div>
                  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 relative transform group-hover:-translate-y-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mb-4 transform group-hover:scale-110 transition-transform duration-300">
                      <Phone className="text-blue-600" size={24} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone</h3>
                    <p className="text-gray-600 mb-2">Mon-Fri from 8am to 5pm</p>
                    <a href={`tel:${siteData.phone}`} className="text-blue-600 hover:text-blue-700 font-medium relative inline-block group-hover:scale-105 transform duration-300">
                      <span className="relative z-10">{siteData.phone}</span>
                      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-200 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-blue-100 transform skew-y-3 origin-top-right opacity-50 group-hover:opacity-100 transition-all duration-300 rounded-xl"></div>
                  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 relative transform group-hover:-translate-y-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mb-4 transform group-hover:scale-110 transition-transform duration-300">
                      <Mail className="text-blue-600" size={24} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
                    <p className="text-gray-600 mb-2">We'll respond within 24hrs</p>
                    <a href={`mailto:${siteData.email}`} className="text-blue-600 hover:text-blue-700 font-medium relative inline-block group-hover:scale-105 transform duration-300">
                      <span className="relative z-10">{siteData.email}</span>
                      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-200 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-blue-100 transform -skew-y-3 origin-top-left opacity-50 group-hover:opacity-100 transition-all duration-300 rounded-xl"></div>
                  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 relative transform group-hover:-translate-y-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mb-4 transform group-hover:scale-110 transition-transform duration-300">
                      <MapPin className="text-blue-600" size={24} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Address</h3>
                    <p className="text-gray-600 relative group-hover:scale-105 transform duration-300">
                      {siteData.address}
                    </p>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-blue-100 transform skew-y-3 origin-top-right opacity-50 group-hover:opacity-100 transition-all duration-300 rounded-xl"></div>
                  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 relative transform group-hover:-translate-y-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mb-4 transform group-hover:scale-110 transition-transform duration-300">
                      <Clock className="text-blue-600" size={24} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Business Hours</h3>
                    <p className="text-gray-600">Monday - Friday</p>
                    <p className="text-gray-600 relative group-hover:scale-105 transform duration-300">8:00 AM - 5:00 PM</p>
                  </div>
                </div>
              </div>
            )}

            {/* Image Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="aspect-square rounded-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1596524430615-b46475ddff6e?w=500&h=500&fit=crop" 
                  alt="Office" 
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="aspect-square rounded-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=500&h=500&fit=crop" 
                  alt="Travel Experience" 
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="aspect-square rounded-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=500&h=500&fit=crop" 
                  alt="Nepal Mountains" 
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Additional Image Grid */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="aspect-video rounded-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800&h=400&fit=crop" 
                  alt="Car Rental" 
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="aspect-video rounded-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=400&fit=crop" 
                  alt="Team Support" 
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="John Doe"
                  disabled={loading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="john@example.com"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="How can we help?"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  rows="4"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your message..."
                  disabled={loading}
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage; 