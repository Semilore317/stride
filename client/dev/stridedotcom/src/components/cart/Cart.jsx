import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadCart } from "@/store/features/cartSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  useEffect(() => {
    // Load cart from localStorage on mount
    dispatch(loadCart());
  }, [dispatch]);

  console.log("Cart state:", cart);
  console.log("Cart items:", cart.items);

  return (
    <>
      {/*
        //stuff to add to the cart section
        1. product image
        2. product name
        3. brand name
        4. unit price
        5. quantity selector
        6. total price
        7. actions
        */}
      <table>
        <thead>
          <tr>
            <th>Product Image</th>
            <th>Product Name</th>
            <th>Brand Name</th>
            <th>Unit Price</th>
            <th>Quantity</th>
            <th>Total Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cart.items.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                Your cart is empty
              </td>
            </tr>
          ) : (
            cart.items.map((item) => (
              <tr key={item.id}>
                <td>
                  {item.product?.images?.[0]?.downloadUrl ? (
                    <img
                      src={`http://localhost:9090/api/v1/images/image/download/${item.product.images[0].id}`}
                      alt={item.product.name}
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                    />
                  ) : (
                    'No image'
                  )}
                </td>
                <td>{item.product?.name}</td>
                <td>{item.product?.brand}</td>
                <td>₦{item.unitPrice?.toFixed(2)}</td>
                <td>{item.quantity}</td>
                <td>₦{item.totalPrice?.toFixed(2)}</td>
                <td>
                  {/* Actions will be added later */}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {cart.items.length > 0 && (
        <div style={{ marginTop: '20px', textAlign: 'right' }}>
          <p><strong>Total Items:</strong> {cart.totalAmount}</p>
          <p><strong>Total Price:</strong> ₦{cart.totalPrice?.toFixed(2)}</p>
        </div>
      )}
    </>
  );
};

export default Cart;
