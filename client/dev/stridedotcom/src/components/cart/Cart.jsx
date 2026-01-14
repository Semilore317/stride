import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getGuestCart } from "@/store/features/cartSlice";
import { useEffect } from "react";
const Cart = () => {
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(getGuestCart());
  }, [dispatch]);

  //   console.log("Cart items:", cart.items);
  //   console.log("Cart total amount:", cart.totalAmount);
  //   console.log("Cart total price:", cart.totalPrice);
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
        7. actionas

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
          <tr>
            <td></td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default Cart;
