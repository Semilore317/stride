import React, { useState } from 'react';
import { Link, NavLink as RouterNavLink } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Menu, Moon, Sun } from 'lucide-react';
import ThemeToggleButton from "@/components/ui/ThemeToggleButton.jsx";
import { MdOutlineShoppingBag } from "react-icons/md";

//TODO: remove theme toggle from navbar and add it to a settings page

const NavBar = ({ isDark, toggleTheme }) => {
  const [open, setOpen] = useState(false);

  const handleLinkClick = () => setOpen(false);

  // manual hack for testing
  // TODO: update userId selection process
  const userId = 1;
  return (
    <nav
      className="sticky top-0 z-50 w-full backdrop-blur-md transition-colors duration-300
                        bg-white/60 dark:bg-black/80 border-b border-black/10 dark:border-white/10 text-black dark:text-white"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-3xl font-bold hover:text-purple-500 flex items-center"
          >
            𝕾𝖙𝖗𝖎𝖉𝖊
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-6 items-center">
            <NavLink to="/products">All Products</NavLink>
            <NavLink to="/add-product">Add Product</NavLink>
            <NavLink to={`/cart/${userId}/my-cart`}> My Cart </NavLink>
            <NavLink to="/wishlist">My Wishlist</NavLink>
            <NavLink to={`/user/${userId}/orders`}>My Orders</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/more">My Account</NavLink>
            <NavLink to="/register"> Register </NavLink>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="ml-4 transition-transform duration-500 hover:rotate-180"
              aria-label="Toggle Theme"
            >
              {isDark ? (
                <Sun className="text-yellow-400 w-6 h-6" />
              ) : (
                <Moon className="text-blue-500 w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center gap-2">
            {/* Theme Toggle (Mobile) */}
            <ThemeToggleButton isDark={isDark} toggleTheme={toggleTheme} />
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="p-0">
                  <Menu
                    className={`h-7 w-7 transition-colors duration-300 ${isDark ? "text-white" : "text-black"
                      }`}
                  />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="w-64 bg-white/80 dark:bg-black/80 text-black dark:text-white
                                           backdrop-blur-md backdrop-saturate-150
                                           border-l border-black/10 dark:border-white/10
                                           transition-transform duration-500 ease-in-out shadow-lg"
              >
                <div className="flex flex-col gap-6 pt-6">
                  <NavLink to="/products" mobile onClick={handleLinkClick}>
                    All Products
                  </NavLink>
                  <NavLink to="/add-product" mobile onClick={handleLinkClick}>
                    Add Product
                  </NavLink>
                  <NavLink
                    to={`/cart/${userId}/my-cart`}
                    mobile
                    onClick={handleLinkClick}
                  >
                    My Cart
                  </NavLink>
                  <NavLink to="/wishlist" mobile onClick={handleLinkClick}>
                    My Wishlist
                  </NavLink>
                  <NavLink to={`/user/${userId}/orders`} mobile onClick={handleLinkClick}>
                    My Orders
                  </NavLink>
                  <NavLink to="/about" mobile onClick={handleLinkClick}>
                    About
                  </NavLink>
                  <NavLink to="/more" mobile onClick={handleLinkClick}>
                    My Account
                  </NavLink>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, children, mobile = false, onClick }) => (
  <RouterNavLink
    to={to}
    onClick={onClick}
    className={`
            transition-all duration-200 font-medium
            hover:text-purple-500 relative
            ${mobile ? 'text-lg py-2 px-2' : 'text-base'}
            after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0
            hover:after:w-full after:bg-purple-500 after:transition-all after:duration-300
        `}
  >
    {children}
  </RouterNavLink>
);

export default NavBar;