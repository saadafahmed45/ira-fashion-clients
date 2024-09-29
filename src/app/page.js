import Image from "next/image";
import Hero from "./components/Hero";
import Product from "./product/page";
import PdGallery from "./components/PdGallery";
import Heros from "./components/Heros";
import Future from "./components/Future";
import Testimonial from "./components/Testimonial ";

export default function Home() {
  return (
    <main className=" ">
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
