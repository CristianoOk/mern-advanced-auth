import FloatingShape from "./components/FloatingShape";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import EmailVerificationPage from "./pages/EmailVerificationPage.jsx";
import {Toaster} from 'react-hot-toast'
import { useAuthStore } from "./store/authStore.js";
import { useEffect } from "react";
import DashboardPage from "./pages/DashboardPage.jsx";
import LoadingSpinner from "./components/LoadingSpinner.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";

//protected routes that require authentication
const ProtectedRoute = ({children}) => {
  const {isAuthenticated, user} = useAuthStore();

  if(!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if(!user.isVerified){
    return <Navigate to="/verif-email" replace />
  }

  return children
}

// redirect authenticated users to the home page
const RedirectAuthenticateUser =({children}) => {
  const {isAuthenticated, user} = useAuthStore();

  if(isAuthenticated && user.isVerified) {
    return <Navigate to='/' replace />
  }

  return children;
}

function App() {
  const {isCheckingAuth, checkAuth} = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if(isCheckingAuth) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden">
      <FloatingShape color='bg-green-500' size='w-64 h-64' top='-5%' left='10%' delay={0} />
      <FloatingShape color='bg-emerald-500' size='w-48 h-48' top='70%' left='80%' delay={5} />
      <FloatingShape color='bg-lime-500' size='w-32 h-32' top='40%' left='10%' delay={2} />

      <Routes>
        <Route path='/' element={<ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>}/>
        <Route path='/signup' element={<RedirectAuthenticateUser>
          <SignUpPage />
        </RedirectAuthenticateUser>} />
        <Route path='/login' element={<RedirectAuthenticateUser>
          <LoginPage />
        </RedirectAuthenticateUser>} />
        <Route path='/verify-email' element={<EmailVerificationPage />} />
        <Route path='/forgot-password' element={<RedirectAuthenticateUser>
          <ForgotPasswordPage />
        </RedirectAuthenticateUser>} />
        <Route
        path="/reset-password/:token"
        element={
          <RedirectAuthenticateUser>
            <ResetPasswordPage />
          </RedirectAuthenticateUser>
        } />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App;
