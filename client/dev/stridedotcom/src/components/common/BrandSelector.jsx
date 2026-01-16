import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllBrands, addBrand } from "@/store/features/productSlice";

const BrandSelector = ({
    selectedBrand,
    onBrandChange,
    newBrand,
    showNewBrandInput,
    setNewBrand,
    setShowNewBrandInput
}) => {
    const dispatch = useDispatch();
    const brands = useSelector((state) => state.product.brands)
    useEffect(() => {
        dispatch(getAllBrands)
    }, [dispatch])
    return (
        <div>
            <h2>Category Selector Component</h2>
        </div>
    );
};

export default CategorySelector;