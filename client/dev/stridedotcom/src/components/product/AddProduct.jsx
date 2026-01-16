import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProduct, getAllBrands } from "@/store/features/productSlice";
import { getAllCategories } from "@/store/features/categorySlice";
import { api } from "@/components/services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { IoCloudUploadOutline, IoAddCircleOutline, IoCloseCircleOutline } from "react-icons/io5";

const AddProduct = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { categories } = useSelector((state) => state.category);
    const { brands } = useSelector((state) => state.product);

    // Form state
    const [productData, setProductData] = useState({
        name: "",
        brand: "",
        price: "",
        inventory: "",
        description: "",
        category: { name: "" },
    });

    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Dynamic Input State
    const [isNewCategory, setIsNewCategory] = useState(false);
    const [isNewBrand, setIsNewBrand] = useState(false);

    useEffect(() => {
        dispatch(getAllCategories());
        dispatch(getAllBrands());
    }, [dispatch]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "category") {
            setProductData({ ...productData, category: { name: value } });
        } else {
            setProductData({ ...productData, [name]: value });
        }
    };

    const handleCategorySelectChange = (e) => {
        const value = e.target.value;
        if (value === "new") {
            setIsNewCategory(true);
            setProductData({ ...productData, category: { name: "" } });
        } else {
            setIsNewCategory(false);
            setProductData({ ...productData, category: { name: value } });
        }
    };

    const handleBrandSelectChange = (e) => {
        const value = e.target.value;
        if (value === "new") {
            setIsNewBrand(true);
            setProductData({ ...productData, brand: "" });
        } else {
            setIsNewBrand(false);
            setProductData({ ...productData, brand: value });
        }
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setImages((prev) => [...prev, ...files]);

        const newPreviews = files.map((file) => URL.createObjectURL(file));
        setImagePreviews((prev) => [...prev, ...newPreviews]);
    };

    const removeImage = (index) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
        setImagePreviews((prev) => {
            // Revoke URL to avoid memory leaks
            URL.revokeObjectURL(prev[index]);
            return prev.filter((_, i) => i !== index);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!productData.category.name.trim()) {
            toast.warning("Please select or enter a category.");
            return;
        }
        if (!productData.brand.trim()) {
            toast.warning("Please select or enter a brand.");
            return;
        }
        if (images.length === 0) {
            toast.warning("Please select at least one image.");
            return;
        }

        setIsSubmitting(true);
        try {
            // 1. Create Product
            const parsedData = {
                ...productData,
                price: parseFloat(productData.price),
                inventory: parseInt(productData.inventory, 10),
            };

            const resultAction = await dispatch(addProduct(parsedData));

            if (addProduct.fulfilled.match(resultAction)) {
                const newProductId = resultAction.payload.id;

                // 2. Upload Images
                const formData = new FormData();
                images.forEach((file) => {
                    formData.append("files", file);
                });
                formData.append("productId", newProductId);

                await api.post("/images/upload", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

                toast.success("Product created and images uploaded successfully!");
                navigate("/products");
            } else {
                // If product creation failed, the slice handles the error toast usually, 
                // but we can ensure it here or just stop loading.
                console.error("Product creation failed:", resultAction.payload);
            }
        } catch (error) {
            console.error("Full submission failed:", error);
            toast.error("An unexpected error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="min-h-screen bg-gray-50 text-black dark:bg-black dark:text-white transition-colors duration-300 py-10 px-6">
            <div className="max-w-4xl mx-auto bg-white/80 dark:bg-white/5 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden border border-black/5 dark:border-white/10">
                <div className="p-8">
                    <h2 className="text-3xl font-bold mb-8 text-center text-purple-600 dark:text-purple-400">
                        Add New Product
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name & Brand Group */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold uppercase tracking-wide opacity-70">Product Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={productData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. Wireless Headphones"
                                    className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg p-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold uppercase tracking-wide opacity-70">Brand</label>
                                <div className="flex gap-2">
                                    {!isNewBrand ? (
                                        <select
                                            name="brand"
                                            value={productData.brand}
                                            onChange={handleBrandSelectChange}
                                            required
                                            className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg p-3 focus:outline-none focus:border-purple-500 transition"
                                        >
                                            <option value="" disabled>Select Brand</option>
                                            {brands.map((b) => (
                                                <option key={b} value={b}>{b}</option>
                                            ))}
                                            <option value="new" className="font-bold text-purple-600">+ Add New Brand</option>
                                        </select>
                                    ) : (
                                        <div className="flex-1 flex gap-2">
                                            <input
                                                type="text"
                                                name="brand"
                                                value={productData.brand}
                                                onChange={handleChange}
                                                required
                                                placeholder="Enter new brand name"
                                                className="w-full bg-transparent border border-purple-500 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-purple-500"
                                                autoFocus
                                            />
                                            <button
                                                type="button"
                                                onClick={() => { setIsNewBrand(false); setProductData(p => ({ ...p, brand: "" })); }}
                                                className="p-3 text-red-500 hover:bg-red-500/10 rounded-lg"
                                                title="Cancel"
                                            >
                                                <IoCloseCircleOutline size={24} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Price & Inventory Group */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold uppercase tracking-wide opacity-70">Price (₦)</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={productData.price}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg p-3 focus:outline-none focus:border-purple-500 transition"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold uppercase tracking-wide opacity-70">Inventory</label>
                                <input
                                    type="number"
                                    name="inventory"
                                    value={productData.inventory}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    placeholder="0"
                                    className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg p-3 focus:outline-none focus:border-purple-500 transition"
                                />
                            </div>
                        </div>

                        {/* Category Group */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold uppercase tracking-wide opacity-70">Category</label>
                            <div className="flex gap-2">
                                {!isNewCategory ? (
                                    <select
                                        name="category"
                                        value={productData.category.name}
                                        onChange={handleCategorySelectChange}
                                        required
                                        className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg p-3 focus:outline-none focus:border-purple-500 transition"
                                    >
                                        <option value="" disabled>Select Category</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                                        ))}
                                        <option value="new" className="font-bold text-purple-600">+ Add New Category</option>
                                    </select>
                                ) : (
                                    <div className="flex-1 flex gap-2">
                                        <input
                                            type="text"
                                            name="category"
                                            value={productData.category.name}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter new category name"
                                            className="w-full bg-transparent border border-purple-500 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-purple-500"
                                            autoFocus
                                        />
                                        <button
                                            type="button"
                                            onClick={() => { setIsNewCategory(false); setProductData(p => ({ ...p, category: { name: "" } })); }}
                                            className="p-3 text-red-500 hover:bg-red-500/10 rounded-lg"
                                            title="Cancel"
                                        >
                                            <IoCloseCircleOutline size={24} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold uppercase tracking-wide opacity-70">Description</label>
                            <textarea
                                name="description"
                                value={productData.description}
                                onChange={handleChange}
                                required
                                placeholder="Describe the product..."
                                className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg p-3 h-32 focus:outline-none focus:border-purple-500 transition resize-none"
                            />
                        </div>

                        {/* Image Upload Area */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold uppercase tracking-wide opacity-70">Product Images</label>
                            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-purple-500 transition cursor-pointer relative bg-gray-50 dark:bg-white/5">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <IoCloudUploadOutline className="w-12 h-12 text-gray-400 mb-2" />
                                <p className="text-sm text-gray-500 font-medium">Click to upload or drag and drop</p>
                                <p className="text-xs text-gray-400 mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                            </div>

                            {/* Image Previews */}
                            {imagePreviews.length > 0 && (
                                <div className="grid grid-cols-4 sm:grid-cols-6 gap-4 mt-4">
                                    {imagePreviews.map((src, index) => (
                                        <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
                                            <img src={src} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition shadow-lg"
                                            >
                                                <IoCloseCircleOutline size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full py-4 text-white font-bold rounded-xl shadow-lg transform transition-all duration-300 flex items-center justify-center gap-2
                                ${isSubmitting
                                    ? "bg-gray-500 cursor-not-allowed"
                                    : "bg-purple-600 hover:bg-purple-700 hover:scale-[1.01] hover:shadow-xl"
                                }`}
                        >
                            {isSubmitting ? (
                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <IoAddCircleOutline size={24} />
                                    Create Product
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default AddProduct;