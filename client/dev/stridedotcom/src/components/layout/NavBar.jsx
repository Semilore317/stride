import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Menu } from 'lucide-react'

const NavBar = () => {
    const [open, setOpen] = useState(false)
    const handleLinkClick = () => setOpen(false)

    return (
        <nav className="sticky top-0 z-50 w-full bg-black text-white border-b border-white/10">
            <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <Link to="/" className="text-3xl font-bold hover:text-purple-300 flex items-center">
                        𝕾𝖙𝖗𝖎𝖉𝖊
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex space-x-6">
                        <NavLink to="/features">All Products</NavLink>
                        <NavLink to="/pricing">Manage Products</NavLink>
                        <NavLink to="/about">About</NavLink>
                        <NavLink to="/more">My Account</NavLink>
                    </div>

                    {/* Mobile Menu */}
                    <div className="md:hidden">
                        <Sheet open={open} onOpenChange={setOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="p-0">
                                    <Menu className="h-7 w-7 text-white" />
                                </Button>
                            </SheetTrigger>

                            <SheetContent
                                side="right"
                                className="bg-black/70 backdrop-blur-md backdrop-saturate-150 text-white w-64 border-l border-white/10"
                            >
                                <div className="flex flex-col gap-6 pt-6">
                                    <NavLink to="/features" mobile onClick={handleLinkClick}>All Products</NavLink>
                                    <NavLink to="/pricing" mobile onClick={handleLinkClick}>Manage Products</NavLink>
                                    <NavLink to="/about" mobile onClick={handleLinkClick}>About</NavLink>
                                    <NavLink to="/more" mobile onClick={handleLinkClick}>My Account</NavLink>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </nav>
    )
}

const NavLink = ({ to, children, mobile = false, onClick }) => (
    <Link
        to={to}
        onClick={onClick}
        className={`
            transition-all duration-200 font-medium
            hover:text-purple-300 relative
            ${mobile ? 'text-lg py-2 px-2' : 'text-base'}
            after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0
            hover:after:w-full after:bg-purple-500 after:transition-all after:duration-300
        `}
    >
        {children}
    </Link>
)

export default NavBar
