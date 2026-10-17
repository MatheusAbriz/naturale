import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "@/Components/guards/protected-route";
import { PublicRoute } from "@/Components/guards/public-route";
import { AppLayout } from "@/Components/layout/app-layout";
import Login from "@/pages/auth/login";
import Register from "@/pages/auth/register";
import ForgotPassword from "@/pages/auth/forgot-password";
import Home from "@/pages/post/posts";
import Favorites from "@/pages/post/favorites";
import PostDetails from "@/pages/post/post-details";
import PostForm from "@/pages/post/post-form";
import Chatbot from "@/pages/chatbot";
import Profile from "@/pages/profile";
import Settings from "@/pages/settings";
import Plans from "@/pages/plans";
import PremiumTools from "@/pages/premium-tools";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />

      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/advanced-search" element={<PremiumTools />} />
          <Route path="/shopping-list" element={<PremiumTools />} />
          <Route path="/post/:id" element={<PostDetails />} />
          <Route path="/postForm" element={<PostForm />} />
          <Route path="/postForm/:postId" element={<PostForm />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}
