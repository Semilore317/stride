import {Route, RouterProvider, createBrowserRouter, createRoutesFromElements} from 'react-router-dom'
import RootLayout from "./component/layout/RootLayout.jsx";

function App() {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path="/" element={<RootLayout></RootLayout>}>
            </Route>
        )
    )
  return (
    <RouterProvider router={router} />
  )
}

export default App
