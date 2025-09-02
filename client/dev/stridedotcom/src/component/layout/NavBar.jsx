import React from 'react'
import { Link } from 'react-router-dom'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'

const NavBar = () => {
    return (
        <nav className="bg-black text-white sticky top-0 z-50 border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <Link to="/" className="text-3xl font-bold hover:text-purple-300">
                        STRIDE
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex space-x-6">
                        <NavLink to="/features">All Products</NavLink>
                        <NavLink to="/pricing">Manage Products</NavLink>
                        <NavLink to="/about">About</NavLink>
                        <NavLink to="/more">My Account</NavLink>
                        <NavLink to="/memes">Dank memes</NavLink>
                    </div>

                    {/* Mobile Menu */}
                    <div className="md:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Menu className="h-6 w-6 text-white" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="bg-black text-white w-64">
                                <div className="flex flex-col space-y-4 mt-10">
                                    <NavLink to="/features">All Products</NavLink>
                                    <NavLink to="/pricing">Manage Products</NavLink>
                                    <NavLink to="/about">About</NavLink>
                                    <NavLink to="/more">My Account</NavLink>
                                    <NavLink to="/memes">Dank memes</NavLink>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </nav>
    )
}

const NavLink = ({ to, children }) => (
    <Link
        to={to}
        className="hover:text-purple-300 transition-colors duration-200 text-base font-medium"
    >
        {children}
    </Link>
)

export default NavBar
