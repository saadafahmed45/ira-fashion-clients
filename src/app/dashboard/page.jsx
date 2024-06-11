import React from "react";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import productApi, { productApiUrl } from "../api/productApi";

async function Api() {
  const res = await fetch(productApiUrl, { cache: "no-store" });

  return res.json();
}
const Dashboard = async () => {
  const product = await Api();

  return (
    <div className="h-screen  px-8 py-4">
      <div className=" flex gap-8 ">
        <div className="card w-60  bg-primary text-primary-content ">
          <div className="card-body ">
            <h2 className="card-title">Products</h2>
            <p className="text-xl">{product.length}</p>
            {/* <div className="card-actions justify-end">
              <button className="btn">Buy Now</button>
            </div> */}
          </div>
        </div>

        <div className="card w-60  bg-primary text-primary-content ">
          <div className="card-body ">
            <h2 className="card-title">Order</h2>
            <p className="text-xl">5</p>
            {/* <div className="card-actions justify-end">
              <button className="btn">Buy Now</button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
