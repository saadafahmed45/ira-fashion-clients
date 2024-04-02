import React from "react";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import Chart from "../components/Chart";

const Dashboard = () => {
  return (
    <div className="h-screen flex">
      <div className="">
        <Chart />
      </div>
    </div>
  );
};

export default Dashboard;
