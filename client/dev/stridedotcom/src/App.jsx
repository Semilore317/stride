import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import RootLayout from "@/components/layout/RootLayout.jsx";
import 'react-toastify/dist/ReactToastify.css';
import Home from "@/components/home/Home.jsx";
import Products from './components/product/Products';
import AddProduct from './components/product/AddProduct';
import ProductDetails from './components/product/ProductDetails';
import Cart from './components/cart/Cart';
import Order from './components/order/Order';
import Wishlist from './components/wishlist/Wishlist';

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/products" element={<Products />} />
        <Route path='/products/:name' element={<ProductDetails />} />
        <Route path='/products/category/:categoryId/products/' element={<Products />} />
        <Route path='/cart/:userId/my-cart' element={<Cart />} />
        <Route path='/user/:userId/orders' element={<Order />} />
        <Route path='/wishlist' element={<Wishlist />} />
        {/* optional catch-all */}
        <Route path="*" element={
          <div>
            <h1>
              404 - Not Found
            </h1>
            <p>Sorry, the page you are looking for does not exist.</p>
          </div>
        } />
      </Route>
    )
  )
  return (
    <RouterProvider router={router} />
  )
}

export default App

