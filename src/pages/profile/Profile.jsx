import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, User, Phone, Mail, History, CreditCard } from 'lucide-react';
import { apiClient } from '../../api/ApiRequest';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/AuthContext';

const Profile = () => {
  const navigate = useNavigate();
  const { currentUser, updateUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        email: currentUser.email || '',
        phone: currentUser.phone || '',
      });
      setAvatarPreview(currentUser?.avatar);
    }
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      if (selectedFile) {
        formDataToSend.append('avatar', selectedFile);
      }

      const response = await apiClient.put(`/auth/user/${currentUser._id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        updateUser(response.data.user);
        toast.success('Profile updated successfully');
        setIsEditing(false);
        setSelectedFile(null); // Reset selected file after successful upload
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700">Please login to view your profile</h2>
          <button
            onClick={() => navigate('/login')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="flex items-center text-gray-700">
            <Mail className="w-5 h-5 mr-2" />
            Email
          </label>
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="text-gray-900">{currentUser.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="flex items-center text-gray-700">
            <Phone className="w-5 h-5 mr-2" />
            Phone
          </label>
          {isEditing ? (
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="text-gray-900">{currentUser.phone}</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderBookingsTab = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800">Your Bookings</h3>
      <div className="bg-gray-50 rounded-lg p-6">
        <p className="text-gray-600">No bookings found</p>
      </div>
    </div>
  );

  const renderPaymentTab = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800">Payment Methods</h3>
      <div className="bg-gray-50 rounded-lg p-6">
        <p className="text-gray-600">No payment methods added</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="relative h-48 bg-gradient-to-r from-blue-500 to-indigo-600">
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white bg-white overflow-hidden">
                  {avatarPreview ? (
                    <img
                      src={typeof avatarPreview === 'string' && avatarPreview.startsWith('data:') 
                        ? avatarPreview 
                        : `http://localhost:5000${avatarPreview}`}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <User className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                </div>
                {isEditing && (
                  <label
                    htmlFor="avatar"
                    className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-colors"
                  >
                    <Camera className="w-5 h-5" />
                    <input
                      type="file"
                      id="avatar"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="pt-20 px-8 pb-8">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{currentUser.username}</h1>
                <p className="text-gray-500 mt-1">Member since {new Date(currentUser.createdAt).toLocaleDateString()}</p>
              </div>
              <button
                onClick={isEditing ? handleSubmit : () => setIsEditing(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </div>
                ) : isEditing ? (
                  'Save Changes'
                ) : (
                  'Edit Profile'
                )}
              </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'profile'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <User className="w-5 h-5 inline-block mr-2" />
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'bookings'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <History className="w-5 h-5 inline-block mr-2" />
                  Bookings
                </button>
                <button
                  onClick={() => setActiveTab('payment')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'payment'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <CreditCard className="w-5 h-5 inline-block mr-2" />
                  Payment
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {activeTab === 'profile' && renderProfileTab()}
              {activeTab === 'bookings' && renderBookingsTab()}
              {activeTab === 'payment' && renderPaymentTab()}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 