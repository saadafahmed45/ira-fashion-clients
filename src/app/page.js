import Image from "next/image";
import Hero from "./components/Hero";
import Product from "./product/page";

export default function Home() {
  return (
    <main className="px-8  md:px-24 ">
      <Hero />
      <div className="divider">Products</div>

      <Product />
    </main>
  );
}
