import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { ScrollToTop } from "./components/common/ScrollToTop";
import PageLoader from "./components/common/PageLoader";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PublicRoute from "./components/auth/PublicRoute";

// Lazy-loaded pages — each becomes its own chunk at build time
const SignIn = lazy(() => import("./pages/AuthPages/SignIn"));
const AppLayout = lazy(() => import("./layout/AppLayout"));
const Home = lazy(() => import("./pages/Dashboard/Home"));
const User = lazy(() => import("./pages/User/User"));
const Nanny = lazy(() => import("./pages/Nanny/Nanny"));
const Subscription = lazy(() => import("./pages/Subscription/Subscription"));
const SubscriptionPlans = lazy(() => import("./pages/SubscriptionPlans/SubscriptionPlans"));
const AdminDashboard = lazy(() => import("./pages/Admin/AdminDashboard"));
const UserProfiles = lazy(() => import("./pages/UserProfiles"));
const Blank = lazy(() => import("./pages/Blank"));

function LazyPage({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Public routes — accessible only when NOT logged in */}
        <Route element={<PublicRoute />}>
          <Route
            path="/signin"
            element={
              <LazyPage>
                <SignIn />
              </LazyPage>
            }
          />
        </Route>

        {/* Protected routes — accessible only when logged in */}
        <Route element={<ProtectedRoute />}>
          <Route
            element={
              <LazyPage>
                <AppLayout />
              </LazyPage>
            }
          >
            <Route
              index
              path="/"
              element={
                <LazyPage>
                  <Home />
                </LazyPage>
              }
            />
            <Route
              path="/users"
              element={
                <LazyPage>
                  <User />
                </LazyPage>
              }
            />
            <Route
              path="/nannies"
              element={
                <LazyPage>
                  <Nanny />
                </LazyPage>
              }
            />
            <Route
              path="/subscriptions"
              element={
                <LazyPage>
                  <Subscription />
                </LazyPage>
              }
            />
            <Route
              path="/subscription-plans"
              element={
                <LazyPage>
                  <SubscriptionPlans />
                </LazyPage>
              }
            />
            <Route
              path="/admin"
              element={
                <LazyPage>
                  <AdminDashboard />
                </LazyPage>
              }
            />
            <Route
              path="/profile"
              element={
                <LazyPage>
                  <UserProfiles />
                </LazyPage>
              }
            />
            <Route
              path="/blank"
              element={
                <LazyPage>
                  <Blank />
                </LazyPage>
              }
            />
          </Route>
        </Route>

        {/* Catch-all: redirect unknown paths */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
