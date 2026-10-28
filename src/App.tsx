import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const CookiePolicy = lazy(() => import('./pages/CookiePolicy'));
const AccountDeletion = lazy(() => import('./pages/AccountDeletion'));
const PaymentLink = lazy(() => import('./pages/PaymentLink'));

// Older links were shared as /payment-links/<code>.
function LegacyPaymentLink() {
  const { code = '' } = useParams();
  return <Navigate to={`/payments/${encodeURIComponent(code)}`} replace />;
}

export default function App() {
  return (
    <Routes>
      {/* The checkout has its own app-styled shell, outside the site layout. */}
      <Route
        path="/payments/:code"
        element={
          <Suspense fallback={null}>
            <PaymentLink />
          </Suspense>
        }
      />
      <Route path="/payment-links/:code" element={<LegacyPaymentLink />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route
          path="/terms"
          element={
            <Suspense fallback={null}>
              <TermsOfService />
            </Suspense>
          }
        />
        <Route
          path="/privacy"
          element={
            <Suspense fallback={null}>
              <PrivacyPolicy />
            </Suspense>
          }
        />
        <Route
          path="/cookies"
          element={
            <Suspense fallback={null}>
              <CookiePolicy />
            </Suspense>
          }
        />
        <Route
          path="/account-deletion"
          element={
            <Suspense fallback={null}>
              <AccountDeletion />
            </Suspense>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
