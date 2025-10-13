import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import RootLayout from "@/components/layout/RootLayout.jsx";
import 'react-toastify/dist/ReactToastify.css';
import Home from "@/components/home/Home.jsx";
import Products from './components/product/Products';
import ProductDetails from './components/product/ProductDetails';

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path='/products/:name' element={<ProductDetails />} />
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
