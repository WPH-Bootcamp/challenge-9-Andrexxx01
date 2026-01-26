import { Routes, Route, Navigate} from "react-router-dom";
import Home from "./pages/home";
import Cart from "./pages/cart";
import Checkout from "./pages/checkout";
import Orders from "./pages/orders";
import SignIn from "./pages/signIn";
import PrivateRoute from "./components/auth/privateRoute";
import SignUpPage from "./pages/signUp";
import CategoryPage from "./pages/category";
import DetailPage from "./pages/detail";
import { useCartSync } from "./services/queries/useCartSync";
import ProfilePage from "./pages/profile";

const App = () => {
  useCartSync();

  return (
    <Routes>
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUpPage />} />
      <Route path="/" element={<Home />} />
      <Route
        path="/category"
        element={
          <PrivateRoute>
            <CategoryPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/detail/:id/:slug"
        element={
          <PrivateRoute>
            <DetailPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/cart"
        element={
          <PrivateRoute>
            <Cart />
          </PrivateRoute>
        }
      />
      <Route
        path="/checkout"
        element={
          <PrivateRoute>
            <Checkout />
          </PrivateRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <PrivateRoute>
            <Orders />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        }
      />
      {/* fallback */}
      <Route path="*" element={<Navigate to="/sign-in" replace />} />
    </Routes>
  );
}

export default App