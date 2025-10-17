import React from "react";
import {decreaseQuantity, increaseQuantity} from "@/store/features/productSlice.js";
import {BsDash, BsPlus} from "react-icons/bs";
import {useDispatch, useSelector} from "react-redux";

const QuantityUpdater = () => {
  const dispatch = useDispatch()
  const quantity = useSelector((state) => state.product.quantity)
  return (
    <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg">
      <button
        onClick={() => dispatch(decreaseQuantity())}
        className="px-3 py-1 text-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-800 transition"
      >
        <BsDash />
      </button>
      <span className="px-4 text-lg font-medium">{quantity}</span>
      <button
        onClick={() => dispatch(increaseQuantity())}
        className="px-3 py-1 text-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-800 transition"
      >
        <BsPlus />
      </button>
    </div>
  );
};

export default QuantityUpdater;
