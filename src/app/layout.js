import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { CartDrawer } from "@/features/cart/components/CartDrawer";
import Providers from "@/providers/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "IRA FASHION | Modern Luxury eCommerce",
  description: "Curated luxury fashion, perfumes, and apparel designed with modern Shopify minimalist aesthetic.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-[#111111] antialiased`}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
            <CartDrawer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
