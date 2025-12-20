"use client";

import { useState } from "react";

const OrderDetails = ({ order, index }) => {
  // Safety check for undefined order
  if (!order) {
    return null;
  }

  const { _id, products, totalPrice, customersDetails, status } = order;
  const [orderStatus, setOrderStatus] = useState(status || "Pending");
  const [isUpdating, setIsUpdating] = useState(false);

  // Helper function to safely format price
  const formatPrice = (price) => {
    if (!price) return "0.00";
    const numPrice = typeof price === "number" ? price : parseFloat(price);
    return isNaN(numPrice) ? "0.00" : numPrice.toFixed(2);
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setOrderStatus(newStatus);
    setIsUpdating(true);

    try {
      const response = await fetch(
        `https://ira-fashion-server.onrender.com/orders/${_id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      console.log("Status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update order status");
      // Revert status on error
      setOrderStatus(status || "Pending");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "done":
      case "completed":
        return "bg-green-100 text-green-800 border-green-300";
      case "cancel":
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <tr
      className={`hover:bg-gray-50 transition-colors ${
        index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
      }`}
    >
      {/* Customer Details */}
      <td className="px-6 py-4">
        {customersDetails && customersDetails.length > 0 ? (
          <div className="space-y-1">
            <p className="font-semibold text-gray-900">
              {customersDetails[0]?.displayName || "N/A"}
            </p>
            <p className="text-sm text-gray-600">
              {customersDetails[0]?.email || "N/A"}
            </p>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No customer info</p>
        )}
      </td>

      {/* Products */}
      <td className="px-6 py-4">
        {products && products.length > 0 ? (
          <div className="space-y-2">
            {products.map((product, idx) => (
              <div key={product._id || idx} className="flex items-start gap-2">
                <span className="inline-block w-2 h-2 mt-1.5 bg-blue-600 rounded-full flex-shrink-0"></span>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">
                    {product.name || "Unnamed Product"}
                  </p>
                  {product.price && (
                    <p className="text-sm text-gray-600">
                      ${formatPrice(product.price)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No products</p>
        )}
      </td>

      {/* Quantity */}
      <td className="px-6 py-4">
        <div className="space-y-2">
          {products && products.length > 0 ? (
            products.map((product, idx) => (
              <div key={product._id || idx} className="text-center">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full font-semibold text-sm">
                  {product.quantity || 1}
                </span>
              </div>
            ))
          ) : (
            <span className="text-gray-500">-</span>
          )}
        </div>
      </td>

      {/* Price */}
      <td className="px-6 py-4">
        <div className="space-y-2">
          {products && products.length > 0 ? (
            products.map((product, idx) => (
              <div
                key={product._id || idx}
                className="text-gray-900 font-medium"
              >
                ${formatPrice(product.price)}
              </div>
            ))
          ) : (
            <span className="text-gray-500">-</span>
          )}
        </div>
      </td>

      {/* Total */}
      <td className="px-6 py-4">
        <div className="text-lg font-bold text-gray-900">
          ${formatPrice(totalPrice)}
        </div>
      </td>

      {/* Actions/Status */}
      <td className="px-6 py-4">
        <div className="space-y-2">
          <select
            className={`select select-sm w-full max-w-[140px] border-2 font-medium transition-all ${getStatusColor(
              orderStatus
            )} ${
              isUpdating ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
            value={orderStatus}
            onChange={handleStatusChange}
            disabled={isUpdating}
          >
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Done">Done</option>
            <option value="Cancel">Cancel</option>
          </select>
          {isUpdating && <p className="text-xs text-gray-500">Updating...</p>}
        </div>
      </td>
    </tr>
  );
};

export default OrderDetails;
