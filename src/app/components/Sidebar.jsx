import Link from "next/link";
import React from "react";
import { FaBars } from "react-icons/fa";

const Sidebar = () => {
  return (
    <div>
      <div className="drawer h-full lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col items-center justify-center">
          {/* Page content here */}
          <label
            htmlFor="my-drawer-2"
            className="btn btn-primary drawer-button lg:hidden"
          >
            <FaBars />
          </label>
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content text-xl">
            {/* Sidebar content here */}
            <li>
              <Link href={"/dashboard"}>Dashboard</Link>
            </li>
            <li>
              <Link href={"/dashboard/addProducts"}>Add Product</Link>
            </li>{" "}
            <li>
              <Link href={"/dashboard/manageProduct"}>Manage Products</Link>
            </li>
            <li>
              <Link href={"/dashboard/setting"}>Setting</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
