import { Routes, Route, Navigate, useParams } from 'react-router-dom';
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
import News from './pages/News.jsx';
import NewsDetail from './pages/NewsDetail.jsx';
import NotFound from './pages/NotFound.jsx';

import Login from './pages/admin/Login.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import ManageSegments from './pages/admin/ManageSegments.jsx';
import ManageSubSegments from './pages/admin/ManageSubSegments.jsx';
import ManageProducts from './pages/admin/ManageProducts.jsx';
import ManagePartners from './pages/admin/ManagePartners.jsx';
import ManageBrochures from './pages/admin/ManageBrochures.jsx';
import Inquiries from './pages/admin/Inquiries.jsx';
import ManageSiteContent from './pages/admin/ManageSiteContent.jsx';
import ManageNews from './pages/admin/ManageNews.jsx';
import ManageSubscribers from './pages/admin/ManageSubscribers.jsx';

function SegmentRedirect() {
  const { slug, subsegmentSlug } = useParams();
  if (slug && subsegmentSlug) {
    return <Navigate to={`/products/${slug}/${subsegmentSlug}`} replace />;
  }
  if (slug) {
    return <Navigate to={`/products/${slug}`} replace />;
  }
  return <Navigate to="/products" replace />;
}

function NewsRedirect() {
  const { slug } = useParams();
  if (slug) {
    return <Navigate to={`/blog/${slug}`} replace />;
  }
  return <Navigate to="/blog" replace />;
}

export default function App() {
  return (
    <Routes>
      {/* Public site */}
      <Route element={<Layout />}>
        <Route index element={<Home />} />

        {/* Products (categories) */}
        <Route path="products" element={<Segments />} />
        <Route path="products/:slug/:subsegmentSlug" element={<SegmentDetail />} />
        <Route path="products/:slug" element={<SegmentDetail />} />

        {/* Product Details (catalogue & single product) */}
        <Route path="product-details" element={<Products />} />
        <Route path="product-details/:slug" element={<ProductDetail />} />

        {/* Blog */}
        <Route path="blog" element={<News />} />
        <Route path="blog/:slug" element={<NewsDetail />} />

        {/* Backwards-compatibility redirects */}
        <Route path="segments" element={<Navigate to="/products" replace />} />
        <Route path="segments/:slug/:subsegmentSlug" element={<SegmentRedirect />} />
        <Route path="segments/:slug" element={<SegmentRedirect />} />
        <Route path="news" element={<Navigate to="/blog" replace />} />
        <Route path="news/:slug" element={<NewsRedirect />} />

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
        <Route path="subsegments" element={<ManageSubSegments />} />
        <Route path="products" element={<ManageProducts />} />
        <Route path="partners" element={<ManagePartners />} />
        <Route path="brochures" element={<ManageBrochures />} />
        <Route path="inquiries" element={<Inquiries />} />
        <Route path="subscribers" element={<ManageSubscribers />} />
        <Route path="content" element={<ManageSiteContent />} />
        <Route path="blog" element={<ManageNews />} />
        <Route path="news" element={<ManageNews />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
