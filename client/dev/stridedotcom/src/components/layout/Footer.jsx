import React, { useEffect } from "react";
import { Separator } from "@/components/ui/separator.jsx";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import { getAllCategories } from "@/store/features/categorySlice.js";
import { setSelectedCategory } from "@/store/features/searchSlice.js";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const Footer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categories = useSelector((state) => state.category.categories);

    useEffect(() => {
      dispatch(getAllCategories());
    }, [dispatch]);

    const handleCategoryClick = (category) => {
      dispatch(setSelectedCategory(category.name.toLowerCase()));
      const params = new URLSearchParams(searchParams);
      params.set("category", category.name.toLowerCase());
      navigate(`/products?${params.toString()}`);
      window.scroll(0,0);
    };

    return (
      <footer className="bg-black text-white py-10 rounded-tl-2xl rounded-tr-2xl">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">About Us</h3>
            <p className="text-sm text-gray-400">
              Prolific.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Category</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              {categories.map((category) => (
                <li
                  key={category.id}
                  className="cursor-pointer hover:text-white transition"
                  onClick={() => handleCategoryClick(category)}
                >
                  {category.name}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Contact</h3>
            <p className="text-sm text-gray-400">info@stride.com</p>
            <p className="text-sm text-gray-400">(123) 456-7890</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4 text-gray-400">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                <FaTwitter />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 max-w-7xl mx-auto px-4">
          <Separator className="bg-gray-800 mb-4" />
          <p className="text-center text-sm text-gray-500">
            &copy; 2025 Stride.com. All rights reserved.
          </p>
        </div>
      </footer>
    );
  };

  export default Footer;
