// App.js or Routes.js
import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layouts/index";
import LoginPage from "./pages/login/LoginPage";
import RegistrationPage from "./pages/register/Register";
import Home from "./pages/Home/Home";
import CarDetailsPage from "./pages/carDetails/CarDetails";
import TourDetailsPage from "./pages/tourDetails/TourDetails";
import TourListPage from "./pages/tourList/TourListPage";
import CarListingPage from "./pages/catList/CarList";
import BookedTours from "./pages/bookedTours/BookedTours";
import CarBookings from "./pages/carBookings/CarBookings";
import MyCarBookings from "./pages/myCarBookings/MyCarBookings";
import Feedback from "./pages/feedback/Feedback";
import { Toaster } from "react-hot-toast";
import Profile from "./pages/profile/Profile";
import { AuthContext } from "./context/AuthContext";
import BlogPage from "./pages/blog/BlogPage";
import BlogDetailsPage from "./pages/blog/BlogDetailsPage";
import AboutPage from "./pages/about/AboutPage";
import ContactPage from "./pages/contact/ContactPage";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  return children;
};

// Public Route Component (for login/register)
const PublicRoute = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  if (currentUser) {
    return <Navigate to="/" />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Layout>
        <Toaster position="top-center" />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/cars/all" element={<CarListingPage />} />
          <Route path="/tours/all" element={<TourListPage />} />
          <Route path="/details/:id" element={<CarDetailsPage />} />
          <Route path="/tours/in/:title/:id" element={<TourDetailsPage />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogDetailsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />

          {/* Protected Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/myBookings/all"
            element={
              <ProtectedRoute>
                <BookedTours />
              </ProtectedRoute>
            }
          />
          <Route
            path="/myCarBookings/all"
            element={
              <ProtectedRoute>
                <MyCarBookings />
              </ProtectedRoute>
            }
          />

          {/* Auth Routes (only accessible when not logged in) */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegistrationPage />
              </PublicRoute>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
