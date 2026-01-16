import React from "react";
import { useSelector } from "react-redux";

const CategorySelector = ({
    selectedBrand,
    onBrandChange,
    newBrand,
    showNewBrandInput,
    setNewBrand,
    setShowNewBrandInput
}) => {

    const brands = useSelector((state) => state.product.brands)
    return (
        <div>
            <h2>Category Selector Component</h2>
        </div>
    );
};

export default CategorySelector;