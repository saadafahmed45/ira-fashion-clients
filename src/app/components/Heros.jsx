import React from "react";

const Heros = () => {
  return (
    <section className="px-8  md:px-24">
      <div className="container flex flex-col justify-center p-6 mx-auto sm:py-12 lg:py-24 lg:flex-row lg:justify-between">
        <div className="flex flex-col justify-center p-6 text-center w-full rounded-sm lg:max-w-md xl:max-w-lg lg:text-left">
          <h1 className=" text-5xl md:text-6xl  font-bold leading-none sm:text-6xl">
            Unleash Your Style: Dive into Our Exclusive
            <span className="dark:text-pink-600"> Collection</span>Today!
          </h1>
          <p className="mt-6 mb-8 text-lg sm:mb-12">
            Dictum aliquam porta in condimentum ac integer
            <br className="hidden md:inline lg:hidden" />
            turpis pulvinar, est scelerisque ligula sem
          </p>
          <div className="flex flex-col space-y-4 sm:items-center sm:justify-center sm:flex-row sm:space-y-0 sm:space-x-4 lg:justify-start">
            <button className="text-md  md:text-2xl  border-2 border-[#FF3EA5] bg-[#FF3EA5] text-white px-3 py-2 hover:bg-white hover:text-[#FF3EA5] ">
              Shop Now
            </button>
            <a
              rel="noopener noreferrer"
              href="#"
              className="px-8 py-3 text-lg font-semibold border rounded dark:border-gray-800"
            >
              Malesuada
            </a>
          </div>
        </div>
        <div className="flex items-center justify-center p-6 mt-8 lg:mt-0 h-72 sm:h-80 lg:h-96 xl:h-112 2xl:h-128">
          <img
            src="/hero.svg"
            alt=""
            className="object-contain h-72 sm:h-80 lg:h-96 xl:h-112 2xl:h-128"
          />
        </div>
      </div>
    </section>
  );
};

export default Heros;
