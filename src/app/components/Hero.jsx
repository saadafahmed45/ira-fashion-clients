import React from "react";

const Hero = () => {
  return (
    <section className="h-full md:h-screen w-[80%] md:w-[90%] flex items-center ">
      {/* hero warper */}
      <div className="flex flex-col md:flex-row items-center justify-between ">
        {/* hero content  */}
        <div className="md:flex-1 ">
          {/* hero content  text sec*/}

          <div className="flex flex-col  gap-4  mt-8 md:w-[90%]">
            <h2 className="text-3xl md:text-5xl font-semibold md:font-bold md:w-[78%] ">
              Unleash Your Style: Dive into Our Exclusive Collection Today!
            </h2>
            <p className="text-sm md:text-lg">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Voluptatum voluptates amet reprehenderit unde tempora,
            </p>

            <div>
              {" "}
              <button className="text-md  md:text-2xl mt-4  border-2 border-[#FF3EA5] bg-[#FF3EA5] text-white px-3 py-2 hover:bg-white hover:text-[#FF3EA5] ">
                Shop Now
              </button>
            </div>
          </div>
        </div>
        {/* hero img  */}
        <div className="flex-2 mt-4 ">
          <img className="h-[310px]  " src="/hero.svg" alt="" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
