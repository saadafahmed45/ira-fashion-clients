import React from "react";

const OrderDetails = ({ order }) => {
  console.log(order.length);
  return (
    <div>
      hi {order.totalPrice}
    </div>
  );
};

export default OrderDetails;
