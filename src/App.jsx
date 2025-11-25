import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';

import About from './pages/About';
import Contact from './pages/Contact';
import Resources from './pages/Resources';
import Community from './pages/Community';
import Books from './pages/Books';
import BookDetail from './pages/BookDetail';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Account from './pages/Account';
import AdminReviews from './pages/AdminReviews';
import BlogList from './pages/BlogList';
import BlogPost from './pages/BlogPost';
import AdminBlogList from './pages/AdminBlogList';
import AdminBlogEdit from './pages/AdminBlogEdit';

// Placeholder components for routes not yet implemented
const Placeholder = ({ title }) => (
  <div className="max-w-7xl mx-auto px-4 py-12">
    <h1 className="text-3xl font-bold text-slate-900 mb-4">{title}</h1>
    <p className="text-slate-600">This page is under construction.</p>
  </div>
);

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/community" element={<Community />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/books" element={<Books />} />
          <Route path="/books/:id" element={<BookDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/account" element={<Account />} />
          <Route path="/admin/reviews" element={<AdminReviews />} />
          <Route path="/admin/blog" element={<AdminBlogList />} />
          <Route path="/admin/blog/new" element={<AdminBlogEdit />} />
          <Route path="/admin/blog/:id" element={<AdminBlogEdit />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
