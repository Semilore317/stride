import React from "react";
import { BsDash, BsPlus } from "react-icons/bs";

/**
 * Reusable quantity updater component
 * Accepts quantity and handlers as props for flexibility
 */
const QuantityUpdater = ({ quantity, incrementQty, decrementQty }) => {
  return (
    <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg">
      <button
        onClick={decrementQty}
        className="px-3 py-1 text-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-800 transition"
      >
        <BsDash />
      </button>
      <span className="px-4 text-lg font-medium">{quantity}</span>
      <button
        onClick={incrementQty}
        className="px-3 py-1 text-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-800 transition"
      >
        <BsPlus />
      </button>
    </div>
  );
};

export default QuantityUpdater;
