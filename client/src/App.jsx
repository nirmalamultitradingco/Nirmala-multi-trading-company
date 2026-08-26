import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/admin/ProtectedRoute.jsx';
import AdminLayout from './components/admin/AdminLayout.jsx';

import Home from './pages/Home.jsx';
import Segments from './pages/Segments.jsx';
import SegmentDetail from './pages/SegmentDetail.jsx';
import Products from './pages/Products.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Partners from './pages/Partners.jsx';
import Brochures from './pages/Brochures.jsx';
import About from './pages/About.jsx';
import Inquiry from './pages/Inquiry.jsx';
import NotFound from './pages/NotFound.jsx';

import Login from './pages/admin/Login.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import ManageSegments from './pages/admin/ManageSegments.jsx';
import ManageProducts from './pages/admin/ManageProducts.jsx';
import ManagePartners from './pages/admin/ManagePartners.jsx';
import ManageBrochures from './pages/admin/ManageBrochures.jsx';
import Inquiries from './pages/admin/Inquiries.jsx';

export default function App() {
  return (
    <Routes>
      {/* Public site */}
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="segments" element={<Segments />} />
        <Route path="segments/:slug" element={<SegmentDetail />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:slug" element={<ProductDetail />} />
        <Route path="partners" element={<Partners />} />
        <Route path="brochures" element={<Brochures />} />
        <Route path="about" element={<About />} />
        <Route path="inquiry" element={<Inquiry />} />
      </Route>

      {/* Admin */}
      <Route path="/admin/login" element={<Login />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="segments" element={<ManageSegments />} />
        <Route path="products" element={<ManageProducts />} />
        <Route path="partners" element={<ManagePartners />} />
        <Route path="brochures" element={<ManageBrochures />} />
        <Route path="inquiries" element={<Inquiries />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
