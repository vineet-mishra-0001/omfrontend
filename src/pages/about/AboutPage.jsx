import React, { useEffect, useState } from 'react';
import {
  Users,
  MapPin,
  Star,
  Award,
  Car,
  Plane,
  Mountain,
  Heart,
  Mail,
  Phone,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { apiClient } from '../../api/ApiRequest';
import { toast } from 'react-hot-toast';
import Footer from '../../components/Footer';

const AboutPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [siteData, setSiteData] = useState(null);
  const [contactLoading, setContactLoading] = useState(true);

  useEffect(() => {
    fetchFeedbacks();
    fetchSiteData();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await apiClient.get('/feedback');
      if (response.status === 200) {
        // Duplicate the feedbacks array to create infinite scroll effect
        const originalFeedbacks = response.data.data || [];
        setFeedbacks([
          ...originalFeedbacks,
          ...originalFeedbacks,
          ...originalFeedbacks,
        ]);
      }
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      toast.error('Failed to load testimonials. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSiteData = async () => {
    try {
      const response = await apiClient.get('/settings');
      console.log(response);
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

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[600px] overflow-hidden">
        {/* Background Image with Gradient Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2000')`,
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>

        {/* Content */}
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-2 rounded-full bg-white/10 text-white backdrop-blur-sm mb-4">
              Our Story
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Making Travel Dreams Come True
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-xl leading-relaxed">
              We're passionate about creating unforgettable travel experiences
              and making your journey seamless.
            </p>
          </div>
        </div>
      </div>

      {/* Company Story */}
      <section className="relative py-20 bg-gradient-to-br from-white to-blue-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Journey
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Om Banna Tours and Travel is a dedicated travel company offering
                reliable and well-planned tour services across Rajasthan and
                other parts of India. With a deep understanding of local
                culture, routes, and travel needs, we ensure a smooth and
                comfortable journey for our customers. We offer a range of
                services including Rajasthan heritage tours, All India travel
                packages, car rentals, and customized itineraries to suit your
                preferences. Whether it’s exploring the forts of Jaipur, the
                deserts of Jaisalmer, or planning a family trip across India,
                we’re here to make your travel easy and enjoyable. Our team
                focuses on genuine service, clear communication, and attention
                to detail—because we believe travel should be simple, safe, and
                memorable. Let Om Banna Tours and Travel be your trusted travel
                companion, wherever the road takes you.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <img
                  src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&h=500&fit=crop"
                  alt="Team Meeting"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="aspect-square rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&h=500&fit=crop"
                  alt="Office Space"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="relative py-20 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Heart className="text-blue-600" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Passion
              </h3>
              <p className="text-gray-600 leading-relaxed">
                We're driven by our love for travel and creating memorable
                experiences.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Star className="text-blue-600" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Excellence
              </h3>
              <p className="text-gray-600 leading-relaxed">
                We strive for excellence in every service we provide.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Users className="text-blue-600" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Customer Focus
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Your satisfaction is our top priority.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Award className="text-blue-600" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Integrity
              </h3>
              <p className="text-gray-600 leading-relaxed">
                We operate with honesty and transparency in all our dealings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="relative py-20 bg-gradient-to-br from-white to-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Mountain className="text-blue-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Guided Tours
              </h3>
              <p className="text-gray-600 mb-4">
                Expert-led tours to the most beautiful destinations.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-600">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Cultural tours
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Adventure tours
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Custom itineraries
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Car className="text-blue-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Car Rentals
              </h3>
              <p className="text-gray-600 mb-4">
                Premium vehicles for your travel needs.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-600">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Luxury cars
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  SUVs & 4x4s
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Airport transfers
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Plane className="text-blue-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Travel Planning
              </h3>
              <p className="text-gray-600 mb-4">
                Comprehensive travel arrangements tailored to your needs.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-600">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Complete itinerary planning
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Accommodation arrangements
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Travel insurance & documentation
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Star className="text-blue-600" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Our Mission
              </h2>
              <p className="text-gray-600 mb-4">
                To provide exceptional travel experiences that create lasting
                memories while promoting sustainable tourism practices.
              </p>
              <p className="text-gray-600">
                We are committed to offering personalized service, ensuring
                every journey is unique and memorable, while respecting local
                cultures and environments.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="text-blue-600" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Our Vision
              </h2>
              <p className="text-gray-600 mb-4">
                To be the leading travel company that transforms how people
                experience the world, making travel accessible, enjoyable, and
                meaningful.
              </p>
              <p className="text-gray-600">
                We envision a world where travel brings people together, fosters
                understanding, and creates positive impacts on local
                communities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative py-20 bg-gradient-to-br from-white to-blue-50 overflow-hidden">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            What Our Customers Say
          </h2>
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : feedbacks.length > 0 ? (
            <div className="relative w-full overflow-hidden">
              <motion.div
                className="flex gap-6"
                initial={{ x: 0 }}
                animate={{
                  x: [0, -33.33 * (feedbacks.length / 3) + '%'],
                }}
                transition={{
                  duration: 30,
                  ease: 'linear',
                  repeat: Infinity,
                }}
              >
                {feedbacks.map((feedback, index) => (
                  <motion.div
                    key={index}
                    className="min-w-[350px] max-w-[350px] bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="flex flex-col items-center">
                      <img
                        src={`http://localhost:5000${feedback.user.avatar}`}
                        alt={feedback.user.email}
                        className="w-16 h-16 rounded-full object-cover border-4 border-blue-100 mb-4"
                      />
                      <div className="flex mb-3">
                        {renderStars(feedback.rating)}
                      </div>
                      <p className="text-gray-600 text-center text-sm mb-4 line-clamp-3 italic">
                        "{feedback.comment}"
                      </p>
                      <div className="text-center">
                        <h4 className="text-blue-600 font-medium text-sm">
                          {feedback.user.email}
                        </h4>
                        <p className="text-gray-500 text-xs mt-1">
                          {new Date(feedback.createdAt).toLocaleDateString(
                            'en-US',
                            {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">No testimonials available yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="relative py-20 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Personalized Service
              </h3>
              <p className="text-blue-100">
                We tailor every experience to your preferences, ensuring a
                unique and memorable journey.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Guidance</h3>
              <p className="text-blue-100">
                Our experienced team provides expert advice and support
                throughout your travel experience.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Local Expertise</h3>
              <p className="text-blue-100">
                We have deep connections with local communities, offering
                authentic experiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      {!contactLoading && siteData && (
        <section className="py-20 bg-gradient-to-br from-white to-blue-50 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGM0LjQxOCAwIDgtMy41ODIgOC04cy0zLjU4Mi04LTgtOC04IDMuNTgyLTggOCAzLjU4MiA4IDggOHoiIHN0cm9rZT0iI2JmZGJmZSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')] opacity-5"></div>
          <div className="container mx-auto px-4 relative">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              <span className="relative inline-block">
                Get in Touch
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-200 to-blue-400 transform -skew-x-12"></div>
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-blue-100 transform -skew-y-6 origin-top-left opacity-50 group-hover:opacity-100 transition-all duration-300 rounded-xl"></div>
                <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-center relative transform group-hover:-translate-y-2">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 transition-transform duration-300">
                    <Phone className="text-blue-600" size={28} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Phone
                  </h3>
                  <a
                    href={`tel:${siteData.phone}`}
                    className="text-blue-600 hover:text-blue-700 transition-colors relative inline-block group-hover:scale-105 transform duration-300"
                  >
                    <span className="relative z-10">{siteData.phone}</span>
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-200 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  </a>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-blue-100 transform skew-y-6 origin-top-right opacity-50 group-hover:opacity-100 transition-all duration-300 rounded-xl"></div>
                <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-center relative transform group-hover:-translate-y-2">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 transition-transform duration-300">
                    <Mail className="text-blue-600" size={28} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Email
                  </h3>
                  <a
                    href={`mailto:${siteData.email}`}
                    className="text-blue-600 hover:text-blue-700 transition-colors relative inline-block group-hover:scale-105 transform duration-300"
                  >
                    <span className="relative z-10">{siteData.email}</span>
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-200 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  </a>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-blue-100 transform -skew-y-6 origin-top-left opacity-50 group-hover:opacity-100 transition-all duration-300 rounded-xl"></div>
                <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-center relative transform group-hover:-translate-y-2">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="text-blue-600" size={28} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Address
                  </h3>
                  <p className="text-gray-600 relative group-hover:scale-105 transform duration-300">
                    {siteData.address}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default AboutPage;
