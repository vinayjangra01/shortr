import { useState } from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AppLayout from "./layouts/app-layout";
import LandingPage from './pages/landing'
import AuthPage from './pages/auth';
import Dashboard from './pages/dashboard';
import LinkPage from './pages/link';
import RedirectLink from './pages/redirect-link';


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
        element: <Dashboard />
      },
      {
        path: '/auth',
        element: <AuthPage />
      },
      {
        path: '/link/:id',
        element: <LinkPage />
      },
      {
        path: '/:id',
        element: <RedirectLink />
      },
    ]
  }]
)

function App() {
  return (
    <RouterProvider router={router}/>
  )
}

export default App
