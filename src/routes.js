import { Navigate, useRoutes } from 'react-router-dom'
// layouts
import DashboardLayout from './layouts/dashboard'
import LogoOnlyLayout from './layouts/LogoOnlyLayout'
//
import Login from './pages/Login'
import Register from './pages/Register'
import DashboardApp from './pages/DashboardApp'
import Products from './pages/Products'
import Employee from './pages/Employee'
import NotFound from './pages/Page404'
//

import isLogin from './utils/isLogin'
import Department from './pages/Department'
import Task from './pages/Task'
import ProductDetails from './pages/ProductDetails'
import Campaign from './pages/Campaign'
import CampaignDetails from './pages/CampaignDetails'
import Customer from './pages/Customer'
import CustomerDetails from './pages/CustomerDetails'

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/dashboard',
      element: isLogin() ? (
        <DashboardLayout />
      ) : (
        <Navigate to='/login' replace />
      ),
      children: [
        { path: 'app', element: <DashboardApp /> },
        { path: 'department', element: <Department /> },
        { path: 'employee', element: <Employee /> },
        { path: 'products', element: <Products /> },
        { path: 'products/:id', element: <ProductDetails /> },
        { path: 'tasks', element: <Task /> },
        { path: 'campaign', element: <Campaign /> },
        { path: 'campaign/:id', element: <CampaignDetails /> },
        { path: 'customers', element: <Customer /> },
        { path: 'customers/:id', element: <CustomerDetails /> },
      ],
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        {
          path: '/',
          element: isLogin() ? (
            <Navigate to='/dashboard/app' />
          ) : (
            <Navigate to='/login' replace />
          ),
        },
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to='/404' /> },
      ],
    },
    { path: '*', element: <Navigate to='/404' replace /> },
  ])
}
