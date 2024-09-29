import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ContextProvider from "./Context/Context";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import NoticeBannar from "./components/NoticeBannar";
import MyNav from "./shared/MyNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Ira's Fashion House",
  description: "Official website for our product",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ContextProvider>
          <NoticeBannar />
          {/* <Navbar /> */}
          <MyNav />
          {children}
          <ToastContainer />

          <Footer />
        </ContextProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
