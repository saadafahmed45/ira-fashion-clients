const OrderDetails = ({ order }) => {
  const { _id, products, totalPrice, customersDetails, status } = order;

  return (
    <tr>
      <td>
        {customersDetails.map((customersDetails) => (
          <div key={customersDetails._id}>
            <p>{customersDetails.displayName}</p>
            <p className="font-semibold">Email:</p>
            <p>{customersDetails.email}</p>
            {/* <p>{product.name}</p> */}
          </div>
        ))}
      </td>
      {/* <td>{_id}</td> */}

      <td>
        {products.map((product) => (
          <div key={product._id}>
            <p>{product.name}</p>
          </div>
        ))}
      </td>
      <td>
        <div>
          <select
            className="select select-secondary w-1/1 max-w-xs bg-secondary text-white"
            required
            type="text"
            name="category"
          >
            <option disabled selected>
              {status}
            </option>
            <option>Done</option>
            <option>Cancel</option>
          </select>
        </div>
      </td>
      <td>
        {products.map((product) => (
          <div key={product._id}>{/* <p>${product.price}</p> */}</div>
        ))}
      </td>
      <td>${totalPrice}</td>
    </tr>
  );
};

export default OrderDetails;
