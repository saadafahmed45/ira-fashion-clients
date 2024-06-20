import Image from "next/image";
import Hero from "./components/Hero";
import Product from "./product/page";
import PdGallery from "./components/PdGallery";
import Heros from "./components/Heros";
import Future from "./components/Future";
import Testimonial from "./components/Testimonial ";

export default function Home() {
  return (
    <main className="px-8  md:px-24 ">
      {/* <Heros /> */}
      <Hero />
      <div className="divider">Products</div>

      <Product />
      <Testimonial />
      <Future />
      {/* <PdGallery /> */}
    </main>
  );
}
