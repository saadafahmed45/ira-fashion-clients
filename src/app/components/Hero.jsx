import React from "react";
import Image from "next/image";

const Hero = () => {
  return (
    <section className="relative h-[90vh] w-full flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.pexels.com/photos/3965545/pexels-photo-3965545.jpeg" // add background image in /public
          alt="Fashion Background"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/20"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 md:px-24 w-full text-white">
        <div className="max-w-2xl space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Discover the New Era of Fashion
          </h1>

          <p className="text-sm md:text-lg text-gray-200">
            Step into the world of style with trending outfits crafted for
            comfort, elegance and everyday wear.
          </p>

          <button className="mt-4 bg-pink-500 hover:bg-pink-600 transition-all text-white font-semibold text-lg px-8 py-3 rounded-lg shadow-lg">
            Shop Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
