import React, { useContext, useState } from "react";
import {
  User,
  AtSign,
  Lock,
  Calendar,
  Phone,
  Upload,
  Eye,
  EyeOff,
  CheckCircle,
} from "lucide-react";
import Input from "../../components/input/Input";
import {
  validateEmail,
  validatePassword,
  validatePhone,
} from "../../validators";
import { apiClient } from "../../api/ApiRequest";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    phone: "",
    profilePicture: null,
  });

  const { updateUser } = useContext(AuthContext);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user starts typing again
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        profilePicture: file,
      });

      // Create preview image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(formData.password)) {
      newErrors.password =
        "Password must be at least 8 characters with uppercase, lowercase, and number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (!validate()) return;

    const submittedFormData = {
      ...formData,
      email: formData.email.trim(),
      password: formData.password.trim(),
    };

    try {
      setIsSubmitting(true);

      console.log("Submitting form data:<>DD>WD", submittedFormData);
      const response = await apiClient.post("/auth/login", submittedFormData);

      console.log("✅ Loggedin:", response.data);

      updateUser(response.data.user);
      navigate("/");
    } catch (error) {
      console.error("❌ Login error:", error.response?.data || error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl shadow-xl p-8 w-full max-w-xl border border-gray-100">
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-100 rounded-full opacity-70 blur-xl"></div>
        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-indigo-100 rounded-full opacity-70 blur-xl"></div>

        <div className="relative">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Login Now</h1>
            <div className="h-1 w-12 bg-blue-600 mx-auto rounded-full mb-4"></div>
            <p className="text-gray-500">
              Login to your account to get started
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Input
                label="Email Address"
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                error={errors.email}
                icon={<AtSign size={18} />}
              />

              <div className="relative">
                <Input
                  label="Password"
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  error={errors.password}
                  icon={<Lock size={18} />}
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-11 text-gray-400 hover:text-gray-700 transition-colors"
                  onClick={togglePasswordVisibility}
                  tabIndex="-1"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Password requirements */}
            {formData.password && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-xs font-medium text-gray-700 mb-2">
                  Password requirements:
                </p>
                <div className="grid grid-cols-2 gap-y-1">
                  <div className="flex items-center text-xs">
                    <span
                      className={`mr-1 ${
                        formData.password.length >= 8
                          ? "text-green-500"
                          : "text-gray-400"
                      }`}
                    >
                      <CheckCircle size={12} />
                    </span>
                    <span
                      className={
                        formData.password.length >= 8
                          ? "text-gray-700"
                          : "text-gray-500"
                      }
                    >
                      At least 8 characters
                    </span>
                  </div>
                  <div className="flex items-center text-xs">
                    <span
                      className={`mr-1 ${
                        /[A-Z]/.test(formData.password)
                          ? "text-green-500"
                          : "text-gray-400"
                      }`}
                    >
                      <CheckCircle size={12} />
                    </span>
                    <span
                      className={
                        /[A-Z]/.test(formData.password)
                          ? "text-gray-700"
                          : "text-gray-500"
                      }
                    >
                      Uppercase letter
                    </span>
                  </div>
                  <div className="flex items-center text-xs">
                    <span
                      className={`mr-1 ${
                        /[a-z]/.test(formData.password)
                          ? "text-green-500"
                          : "text-gray-400"
                      }`}
                    >
                      <CheckCircle size={12} />
                    </span>
                    <span
                      className={
                        /[a-z]/.test(formData.password)
                          ? "text-gray-700"
                          : "text-gray-500"
                      }
                    >
                      Lowercase letter
                    </span>
                  </div>
                  <div className="flex items-center text-xs">
                    <span
                      className={`mr-1 ${
                        /\d/.test(formData.password)
                          ? "text-green-500"
                          : "text-gray-400"
                      }`}
                    >
                      <CheckCircle size={12} />
                    </span>
                    <span
                      className={
                        /\d/.test(formData.password)
                          ? "text-gray-700"
                          : "text-gray-500"
                      }
                    >
                      At least one number
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8">
              <button
                type="submit"
                className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg py-3.5 font-medium transition-all
                  shadow-lg shadow-blue-200 hover:shadow-blue-300
                  ${
                    isSubmitting
                      ? "opacity-75 cursor-not-allowed"
                      : "hover:translate-y-0.5 active:translate-y-1"
                  }
                `}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Loggin in...
                  </div>
                ) : (
                  "Login"
                )}
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Dont have an account?
                <a
                  href="#"
                  className="text-blue-600 font-medium ml-1.5 hover:text-blue-700 transition-colors hover:underline"
                >
                  Sign up
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
