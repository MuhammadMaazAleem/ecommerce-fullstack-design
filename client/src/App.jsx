import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import HomePage from './pages/HomePage';
import ProductListingPage from './pages/ProductListingPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import ProfilePage from './pages/ProfilePage';
import MessagesPage from './pages/MessagesPage';
import OrdersPage from './pages/OrdersPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import AdminProductsPage from './pages/AdminProductsPage';
import { fetchCart } from './features/cart/cartSlice';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductListingPage />} />
        <Route path="/product/:id" element={<ProductDetailsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orders/:id" element={<OrderDetailsPage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/orders" element={<AdminOrdersPage />} />
        <Route path="/admin/products" element={<AdminProductsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
