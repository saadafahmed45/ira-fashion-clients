"use client";

import React from "react";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import productApi, { productApiUrl } from "../api/productApi";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register the components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

async function products() {
  const res = await fetch(productApiUrl, { cache: "no-store" });

  return res.json();
}

async function orderItem() {
  const res = await fetch("https://ira-fashion-server.onrender.com/orders", {
    cache: "no-store",
  });

  return res.json();
}

const Dashboard = async () => {
  const product = await products();
  const order = await orderItem();

  // Prepare data for the chart
  const chartData = {
    labels: ["Products", "Orders"],
    datasets: [
      {
        label: "Count",
        data: [product.length, order.length],
        backgroundColor: [
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
        ],
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(153, 102, 255, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="h-screen px-8 py-4">
      <div className="flex gap-8">
        <div className="card w-60 bg-green-600 text-white">
          <div className="card-body">
            <h2 className="card-title">Products</h2>
            <p className="text-xl">{product.length}</p>
          </div>
        </div>

        <div className="card w-60 bg-primary text-white">
          <div className="card-body">
            <h2 className="card-title">Order</h2>
            <p className="text-xl">{order.length}</p>
          </div>
        </div>
        <div className="card w-60 bg-red-500 text-white">
          <div className="card-body">
            <h2 className="card-title">Order</h2>
            <p className="text-xl">{order.length}</p>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default Dashboard;
