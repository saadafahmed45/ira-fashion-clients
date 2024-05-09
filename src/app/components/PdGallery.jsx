import React from "react";

const PdGallery = () => {
  return (
    <div>
      <section class='text-gray-600 body-font'>
        <div class='container px-5 py-24 mx-auto flex flex-wrap'>
          <div class='flex w-full mb-20 flex-wrap'>
            <h1 class='sm:text-3xl text-2xl font-medium title-font text-gray-900 lg:w-1/3 lg:mb-0 mb-4'>
              Step into Fashion with Confidence."
            </h1>
            <p class='lg:pl-6 lg:w-2/3 mx-auto leading-relaxed text-base'>
              Discover style and comfort in every step with our diverse shoe
              collection. From timeless Oxfords to rugged adventure boots and
              statement heels, find your perfect pair today!
            </p>
          </div>
          <div class='flex flex-wrap md:-m-2 -m-1'>
            <div class='flex flex-wrap w-1/2'>
              <div class='md:p-2 p-1 w-1/2'>
                <img
                  alt='gallery'
                  class='w-full object-cover h-full object-center block'
                  src='https://images.pexels.com/photos/267202/pexels-photo-267202.jpeg'
                />
              </div>
              <div class='md:p-2 p-1 w-1/2'>
                <img
                  alt='gallery'
                  class='w-full object-cover h-full object-center block'
                  src='https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg'
                />
              </div>
              <div class='md:p-2 p-1 w-full'>
                <img
                  alt='gallery'
                  class='w-full h-full object-cover object-center block'
                  src='https://images.pexels.com/photos/1446524/pexels-photo-1446524.jpeg'
                />
              </div>
            </div>
            <div class='flex flex-wrap w-1/2'>
              <div class='md:p-2 p-1 w-full'>
                <img
                  alt='gallery'
                  class='w-full h-full object-cover object-center block'
                  src='https://images.pexels.com/photos/573315/pexels-photo-573315.jpeg'
                />
              </div>
              <div class='md:p-2 p-1 w-1/2'>
                <img
                  alt='gallery'
                  class='w-full object-cover h-full object-center block'
                  src='https://images.pexels.com/photos/2385477/pexels-photo-2385477.jpeg'
                />
              </div>
              <div class='md:p-2 p-1 w-1/2'>
                <img
                  alt='gallery'
                  class='w-full object-cover h-full object-center block'
                  src='https://images.pexels.com/photos/1456706/pexels-photo-1456706.jpeg'
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PdGallery;
