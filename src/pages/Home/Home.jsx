import React, { useEffect } from "react";
import { ChevronRight, Star } from "lucide-react";
import CarListingSection from "../../components/carListings/Cars";
import HeroSection from "../../components/Hero/Hero";
import TravelDestinationsCarousel from "../../components/tours/Tours";
import { useDispatch, useSelector } from "react-redux";
import { fetchCars, fetchTours } from "../../redux/carSlice";
import CarRentalLoader from "../../components/loader/Loader";
import Testimonial from "../../components/testimonial/Testimonial";

const Home = () => {
    const dispatch = useDispatch();
    const { cars, tours, status } = useSelector((state) => state.car);
    useEffect(() => {
      dispatch(fetchCars());
      dispatch(fetchTours());
    }, [dispatch]);

    
  if (status === 'loading') {
    return <CarRentalLoader />;
  }
  return (
    <div className="relative  bg-white">
      {/* Curved SVG Background */}
     <HeroSection />
     <CarListingSection carsData={cars} />
     <TravelDestinationsCarousel place="Jaipur" tours = {tours} />
     <TravelDestinationsCarousel place="India" tours={tours}/>
     <Testimonial />
    </div>
  );
};

export default Home;