import React, { useState } from 'react';
import { useDispatch } from "react-redux";
import { registerUser } from "@/store/features/userSlice.js";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { IoAddCircleOutline, IoTrashOutline, IoPersonAddOutline } from "react-icons/io5";

const UserRegistration = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });

    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [addresses, setAddresses] = useState([
        {
            country: "",
            state: "",
            city: "",
            street: "",
            addressType: "HOME"
        },
    ]);

    const handleUserChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handleAddressChange = (index, e) => {
        const { name, value } = e.target;
        const updatedAddresses = [...addresses];
        updatedAddresses[index] = { ...updatedAddresses[index], [name]: value };
        setAddresses(updatedAddresses);
    };

    const addAddress = () => {
        setAddresses([
            ...addresses,
            { country: "", state: "", city: "", street: "", addressType: "HOME" },
        ]);
    };

    const removeAddress = (index) => {
        if (addresses.length === 1) {
            toast.warning("At least one address is required.");
            return;
        }
        const updatedAddresses = addresses.filter((_, i) => i !== index);
        setAddresses(updatedAddresses);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (user.password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        if (user.password.length < 6) {
            toast.warning("Password must be at least 6 characters.");
            return;
        }

        // Build registration payload
        const registrationData = {
            ...user,
            addresses: addresses.filter(
                (addr) => addr.street.trim() && addr.city.trim() && addr.country.trim()
            ),
        };

        setIsSubmitting(true);
        try {
            const resultAction = await dispatch(registerUser(registrationData));
            if (registerUser.fulfilled.match(resultAction)) {
                toast.success("Registration successful! Please log in.");
                navigate("/login");
            } else {
                toast.error(resultAction.payload?.message || "Registration failed. Please try again.");
            }
        } catch (error) {
            console.error("Registration error:", error);
            toast.error("An unexpected error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="min-h-screen bg-gray-50 text-black dark:bg-black dark:text-white transition-colors duration-300 py-10 px-6">
            <div className="max-w-2xl mx-auto bg-white/80 dark:bg-white/5 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden border border-black/5 dark:border-white/10">
                <div className="p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                            Create Account
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">
                            Join us and start shopping today
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold uppercase tracking-wide opacity-70">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={user.firstName}
                                    onChange={handleUserChange}
                                    required
                                    placeholder="John"
                                    className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg p-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold uppercase tracking-wide opacity-70">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={user.lastName}
                                    onChange={handleUserChange}
                                    required
                                    placeholder="Doe"
                                    className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg p-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold uppercase tracking-wide opacity-70">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={user.email}
                                onChange={handleUserChange}
                                required
                                placeholder="john.doe@example.com"
                                className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg p-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                            />
                        </div>

                        {/* Password Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold uppercase tracking-wide opacity-70">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={user.password}
                                    onChange={handleUserChange}
                                    required
                                    placeholder="••••••••"
                                    className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg p-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold uppercase tracking-wide opacity-70">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    placeholder="••••••••"
                                    className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg p-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                                />
                            </div>
                        </div>

                        {/* Addresses Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-semibold uppercase tracking-wide opacity-70">
                                    Addresses
                                </label>
                                <button
                                    type="button"
                                    onClick={addAddress}
                                    className="flex items-center gap-1 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm font-medium transition"
                                >
                                    <IoAddCircleOutline size={20} />
                                    Add Address
                                </button>
                            </div>

                            {addresses.map((address, index) => (
                                <div
                                    key={index}
                                    className="relative bg-gray-100 dark:bg-white/5 rounded-xl p-5 border border-gray-200 dark:border-white/10 space-y-4"
                                >
                                    {/* Address Header */}
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                            Address {index + 1}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => removeAddress(index)}
                                            className="text-red-500 hover:text-red-600 hover:bg-red-500/10 p-2 rounded-lg transition"
                                            title="Remove address"
                                        >
                                            <IoTrashOutline size={18} />
                                        </button>
                                    </div>

                                    {/* Address Type */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold uppercase tracking-wide opacity-60">
                                            Address Type
                                        </label>
                                        <select
                                            name="addressType"
                                            value={address.addressType}
                                            onChange={(e) => handleAddressChange(index, e)}
                                            className="w-full bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:outline-none focus:border-purple-500 transition"
                                        >
                                            <option value="HOME">Home</option>
                                            <option value="WORK">Work</option>
                                            <option value="OTHER">Other</option>
                                        </select>
                                    </div>

                                    {/* Street */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold uppercase tracking-wide opacity-60">
                                            Street Address
                                        </label>
                                        <input
                                            type="text"
                                            name="street"
                                            value={address.street}
                                            onChange={(e) => handleAddressChange(index, e)}
                                            placeholder="123 Main Street"
                                            className="w-full bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:outline-none focus:border-purple-500 transition"
                                        />
                                    </div>

                                    {/* City, State, Country */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold uppercase tracking-wide opacity-60">
                                                City
                                            </label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={address.city}
                                                onChange={(e) => handleAddressChange(index, e)}
                                                placeholder="Lagos"
                                                className="w-full bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:outline-none focus:border-purple-500 transition"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold uppercase tracking-wide opacity-60">
                                                State
                                            </label>
                                            <input
                                                type="text"
                                                name="state"
                                                value={address.state}
                                                onChange={(e) => handleAddressChange(index, e)}
                                                placeholder="Lagos State"
                                                className="w-full bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:outline-none focus:border-purple-500 transition"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold uppercase tracking-wide opacity-60">
                                                Country
                                            </label>
                                            <input
                                                type="text"
                                                name="country"
                                                value={address.country}
                                                onChange={(e) => handleAddressChange(index, e)}
                                                placeholder="Nigeria"
                                                className="w-full bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:outline-none focus:border-purple-500 transition"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
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
                                    <IoPersonAddOutline size={24} />
                                    Create Account
                                </>
                            )}
                        </button>

                        {/* Login Link */}
                        <p className="text-center text-gray-500 dark:text-gray-400 mt-6">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                            >
                                Log in
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default UserRegistration;