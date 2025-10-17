import React from "react";

const QuantityUpdater = ({ quantity, incrementQty, decrementQty }) => {
  return (
    <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg">
      <button
        onClick={decrementQty}
        className="px-3 py-1 text-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-800 transition"
      >
        −
      </button>
      <span className="px-4 text-lg font-medium">{quantity}</span>
      <button
        onClick={incrementQty}
        className="px-3 py-1 text-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-800 transition"
      >
        +
      </button>
    </div>
  );
};

export default QuantityUpdater;
