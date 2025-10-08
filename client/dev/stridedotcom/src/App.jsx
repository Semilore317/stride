import {Route, RouterProvider, createBrowserRouter, createRoutesFromElements} from 'react-router-dom'
import RootLayout from "@/components/layout/RootLayout.jsx";
import 'react-toastify/dist/ReactToastify.css';
import Home from "@/components/home/Home.jsx";
import Products from './components/product/Products';

function App() {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path="/" element={<RootLayout/>}>
                <Route index element={<Home />} />
                <Route path="/products" element={<Products />} />
            </Route>
        )
    )
  return (
    <RouterProvider router={router} />
  )
}

export default App
