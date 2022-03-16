// component
import Iconify from '../../components/Iconify'

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />

const sidebarConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: getIcon('eva:pie-chart-2-fill'),
  },
  {
    title: 'department',
    path: '/dashboard/department',
    icon: getIcon('mdi:home'),
  },
  {
    title: 'employee',
    path: '/dashboard/employee',
    icon: getIcon('eva:people-fill'),
  },
  // {
  //   title: 'role',
  //   path: '/dashboard/role',
  //   icon: getIcon('fa-solid:user-lock'),
  // },
  {
    title: 'products',
    path: '/dashboard/products',
    icon: getIcon('fluent:production-24-filled'),
  },
  {
    title: 'tasks',
    path: '/dashboard/tasks',
    icon: getIcon('eva:file-text-fill'),
  },
  {
    title: 'campaign',
    path: '/dashboard/campaign',
    icon: getIcon('cib:campaign-monitor'),
  },
  {
    title: 'customers',
    path: '/dashboard/customers',
    icon: getIcon('eva:person-add-fill'),
  },
]

export default sidebarConfig
