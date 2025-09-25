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

const App = () => {
  const isAuthenticated = false;
  const user = null;
  return (
    <div className="flex flex-col overflow-hidden bg-white">
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