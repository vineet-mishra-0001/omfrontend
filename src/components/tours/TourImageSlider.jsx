import React from 'react';
import { motion } from 'framer-motion';

const TourImageSlider = ({ images }) => {
  // Duplicate images array for infinite scroll effect
  const extendedImages = [...images, ...images, ...images];

  return (
    <div className="w-full overflow-hidden bg-gray-50 rounded-xl">
      <div className="relative py-8">
        <motion.div
          className="flex gap-6 px-4"
          initial={{ x: 0 }}
          animate={{ 
            x: [0, -33.33 * (extendedImages.length / 3) + '%']
          }}
          transition={{
            duration: 40,
            ease: "linear",
            repeat: Infinity,
          }}
          whileHover={{ animationPlayState: 'paused' }}
          style={{ cursor: 'grab' }}
        >
          {extendedImages.map((image, index) => (
            <motion.div
              key={index}
              className="min-w-[350px] aspect-[4/3] relative group"
            >
              <img
                src={image}
                alt={`Tour view ${index + 1}`}
                className="w-full h-full object-cover rounded-xl shadow-md group-hover:shadow-xl transition-shadow duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl">
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent rounded-b-xl">
                  <p className="text-white text-sm font-medium">
                    View {(index % images.length) + 1} of {images.length}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default TourImageSlider; 