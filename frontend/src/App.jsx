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
import {  useSelector } from "react-redux"
import { selectIsAuthenticated, selectUser } from "./store/auth-slice/authSlice"
import { useGetUserQuery } from "./store/auth-slice/authSliceAPI"
import Loader from "./components/common/loader"
import { ToastContainer } from "react-toastify"


const App = () => {
  const { isLoading} = useGetUserQuery();
  
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader variant="circle-filled" size={64} />
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <ToastContainer position="top-right" />

      <Routes>
        {/* Public Routes - No Auth Check */}
        <Route path="/auth" element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <AuthLayout />
          </CheckAuth>
        }>
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
        </Route>

        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected Admin Routes */}
        <Route path="/admin" element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <Adminlayout />
          </CheckAuth>
        }>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="features" element={<AdminFeatures />} />
        </Route>

        {/* Protected Shop Routes */}
        <Route path="/shop" element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <ShoppingLayout />
          </CheckAuth>
        }>
          <Route path="home" element={<ShoppingHome />} />
          <Route path="listing" element={<ShoppingListing />} />
          <Route path="checkout" element={<ShoppingCheckout />} />
          <Route path="account" element={<ShoppingAccount />} />
        </Route>

        {/* Root route redirect */}
        <Route path="/" element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <div />
          </CheckAuth>
        } />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App;