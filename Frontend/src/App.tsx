import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AppLayout from "./layouts/app-layout";
import LandingPage from './pages/landing'
import AuthPage from './pages/auth';
import Dashboard from './pages/dashboard';
import LinkPage from './pages/link';
import RedirectLink from './pages/redirect-link';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import PublicRoute from './components/PublicRoute';
import ProtectedRoute from './components/ProtectedRoute';


const router = createBrowserRouter(
  [{
    element: <AppLayout />,
    children:[
      {
        path: '/',
        element: <LandingPage />
      },
      {
        path: '/dashboard',
        element: 
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      },
      {
        path: '/auth',
        element: 
        (<PublicRoute>
          <AuthPage />
          </PublicRoute>)
      },
      {
        path: '/link/:id',
        element: 
        <ProtectedRoute>
          <LinkPage />
        </ProtectedRoute>
      },
      {
        path: '/:id',
        element: 
        <ProtectedRoute>
          <RedirectLink />
        </ProtectedRoute>
      },
    ]
  }]
)

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router}/>
      <Toaster />
    </AuthProvider>
  )
}

export default App