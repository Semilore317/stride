import {Route, RouterProvider, createBrowserRouter, createRoutesFromElements} from 'react-router-dom'
import RootLayout from "./component/layout/RootLayout.jsx";
import Home from "./component/home/Home.jsx";

function App() {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path="/" element={<RootLayout/>}>
                <Route index element={<Home />} />
            </Route>
        )
    )
  return (
    <RouterProvider router={router} />
  )
}

export default App
