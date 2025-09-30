import { Route, Routes } from "react-router"
import AuthLayout from "./components/auth/layout"
import AuthLogin from "./pages/auth/login"
import AuthRegister from "./pages/auth/register"
import Adminlayout from "./components/admin/layout"
import Dashboard from "./pages/admin/dashboard"
import AdminOrders from "./pages/admin/orders"
import AdminProducts from "./pages/admin/products"
import AdminFeatures from "./pages/admin/features"
import ShoppingLayout from "./components/shopping/layout"
import NotFound from "./pages/errors/notFound"
import ShoppingHome from "./pages/shopping/home"
import ShoppingListing from "./pages/shopping/listing"
import ShoppingCheckout from "./pages/shopping/checkout"
import ShoppingAccount from "./pages/shopping/account"
import Unauthorized from "./pages/errors/unauthorized"
import CheckAuth from "./components/common/checkAuth"
import { useDispatch, useSelector } from "react-redux"
import { selectIsAuthenticated,selectUser, setUser } from "./store/auth-slice/authSlice"
import { useGetUserQuery } from "./store/auth-slice/authSliceAPI"
import { useEffect } from "react"
import Loader from "./components/common/loader"
import { ToastContainer } from "react-toastify"


const App = () => {

const { data, isLoading } = useGetUserQuery();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?._id) dispatch(setUser(data));
  }, []);

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

   if (isLoading) {
    return <Loader variant="circle-filled" size={64}/>
  }
 
  return (
    <div className="flex flex-col overflow-hidden bg-white">
            <ToastContainer position="top-right" />

      <CheckAuth isAuthenticated={isAuthenticated} user={user}>
        <Routes>
        <Route path="/auth" element={<AuthLayout/>}>
          <Route path="login" element={<AuthLogin/>}/>
          <Route path="register" element={<AuthRegister/>}/>
        </Route>
        <Route path="/admin" element={<Adminlayout/>}>
          <Route path="dashboard" element={<Dashboard/>}/>
          <Route path="products" element={<AdminProducts/>}/>
          <Route path="orders" element={<AdminOrders/>}/>
          <Route path="features" element={<AdminFeatures/>}/>
        </Route>
        <Route path="/shop" element={<ShoppingLayout/>}>
          <Route path="home" element={<ShoppingHome/>}/>
          <Route path="listing" element={<ShoppingListing/>}/>
          <Route path="checkout" element={<ShoppingCheckout/>}/>
          <Route path="account" element={<ShoppingAccount/>}/>
        </Route>
        <Route path="*" element={<NotFound/>}/>
        <Route path="/unauthorized" element={<Unauthorized/>}/>
      </Routes>
      </CheckAuth>
    </div>
  )
}

export default App;