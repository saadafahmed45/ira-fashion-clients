import React from "react";

const NoticeBannar = () => {
  return (
    <div>
      <div className=" px-8 md:px-24 py-2 hidden md:block dark:bg-gray-50 dark:text-gray-800">
        <div className=" md:flex items-center mx-auto container justify-center md:justify-center py-2">
          <div>
            <span>
              Get up to 50% off your first order + free shipping,&nbsp;
            </span>
            <a href="#" rel="noopener noreferrer" className="underline">
              sign up
            </a>
            today!
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticeBannar;
