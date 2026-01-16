import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "@/store/features/productSlice";
import { getAllCategories } from "@/store/features/categorySlice";
import { api } from "@/components/services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { categories } = useSelector((state) => state.category);

    // Form state
    const [productData, setProductData] = useState({
        name: "",
        brand: "",
        price: "",
        inventory: "",
        description: "",
        category: { name: "" },
    });

    const [createdProductId, setCreatedProductId] = useState(null);
    const [images, setImages] = useState([]);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        dispatch(getAllCategories());
    }, [dispatch]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "category") {
            setProductData({ ...productData, category: { name: value } });
        } else {
            setProductData({ ...productData, [name]: value });
        }
    };

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        try {
            const parsedData = {
                ...productData,
                price: parseFloat(productData.price),
                inventory: parseInt(productData.inventory, 10),
            };

            const resultAction = await dispatch(addProduct(parsedData));
            if (addProduct.fulfilled.match(resultAction)) {
                setCreatedProductId(resultAction.payload.id);
                // Don't navigate yet, stay for image upload
            }
        } catch (error) {
            console.error("Failed to add product:", error);
        }
    };

    const handleImageChange = (e) => {
        setImages(e.target.files);
    };

    const handleImageUpload = async (e) => {
        e.preventDefault();
        if (!createdProductId) return;
        if (images.length === 0) {
            toast.warning("Please select images to upload.");
            return;
        }

        const formData = new FormData();
        for (let i = 0; i < images.length; i++) {
            formData.append("files", images[i]);
        }
        formData.append("productId", createdProductId);

        setUploading(true);
        try {
            await api.post("/images/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            toast.success("Images uploaded successfully!");
            navigate("/products"); // Navigate after successful upload
        } catch (error) {
            const message = error?.response?.data?.message || "Image upload failed";
            toast.error(message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <h2 className="text-2xl font-bold mb-6">Add New Product</h2>

            {!createdProductId ? (
                <form onSubmit={handleProductSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Product Name</label>
                        <input
                            type="text"
                            name="name"
                            value={productData.name}
                            onChange={handleChange}
                            required
                            className="w-full border rounded p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Brand</label>
                        <input
                            type="text"
                            name="brand"
                            value={productData.brand}
                            onChange={handleChange}
                            required
                            className="w-full border rounded p-2"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Price</label>
                            <input
                                type="number"
                                name="price"
                                value={productData.price}
                                onChange={handleChange}
                                required
                                min="0"
                                step="0.01"
                                className="w-full border rounded p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Inventory Count</label>
                            <input
                                type="number"
                                name="inventory"
                                value={productData.inventory}
                                onChange={handleChange}
                                required
                                min="0"
                                className="w-full border rounded p-2"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <select
                            name="category"
                            value={productData.category.name}
                            onChange={handleChange}
                            required
                            className="w-full border rounded p-2"
                        >
                            <option value="">Select a Category</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.name}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                            name="description"
                            value={productData.description}
                            onChange={handleChange}
                            required
                            className="w-full border rounded p-2 h-32"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                    >
                        Create Product
                    </button>
                </form>
            ) : (
                <div className="space-y-4">
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                        <p className="font-bold">Product Created Successfully!</p>
                        <p>Now please upload images for this product.</p>
                    </div>

                    <form onSubmit={handleImageUpload} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Product Images</label>
                            <input
                                type="file"
                                multiple
                                onChange={handleImageChange}
                                accept="image/*"
                                className="w-full border rounded p-2"
                            />
                            <p className="text-xs text-gray-500 mt-1">You can select multiple files.</p>
                        </div>
                        <button
                            type="submit"
                            disabled={uploading}
                            className={`w-full py-2 px-4 rounded text-white transition ${uploading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
                                }`}
                        >
                            {uploading ? "Uploading..." : "Upload Images & Finish"}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AddProduct;