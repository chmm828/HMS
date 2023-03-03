// eslint-disable-next-line
import { UserLayout, BasicLayout, BlankLayout } from '@/layouts'
// import { bxAnaalyse } from '@/core/icons'

const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}

export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: 'menu.home' },
    redirect: '/customers/user-manage',
    children: [
       // 用户管理
      {
        path: '/customers/user-manage',
            name: 'customerManager',
            component: () => import('@/views/customer/CustomerManager'),
            meta: {
              title: 'menu.user-management',
              icon: 'team',
              keepAlive: true,
              permission: ['customer']
            }
      },
      // Exception
      {
        hidden: true,
        path: '/exception',
        name: 'exception',
        component: RouteView,
        redirect: '/exception/403',
        meta: { title: 'menu.exception', icon: 'warning', permission: ['exception'] },
        children: [
          {
            path: '/exception/403',
            name: 'Exception403',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/403'),
            meta: { title: 'menu.exception.not-permission', permission: ['exception'] }
          },
          {
            path: '/exception/404',
            name: 'Exception404',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404'),
            meta: { title: 'menu.exception.not-find', permission: ['exception'] }
          },
          {
            path: '/exception/500',
            name: 'Exception500',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/500'),
            meta: { title: 'menu.exception.server-error', permission: ['exception'] }
          }
        ]
      },
      // account
      {
        hidden: true,
        path: '/account',
        component: RouteView,
        redirect: '/account/center',
        name: 'account',
        meta: { title: 'menu.account', icon: 'user', keepAlive: true, permission: ['user'] },
        children: [
          {
            path: '/account/settings',
            name: 'settings',
            component: () => import('@/views/account/settings/Index'),
            meta: { title: 'menu.account.settings', hideHeader: true, permission: ['user'] },
            redirect: '/account/settings/basic',
            hideChildrenInMenu: true,
            children: [
              {
                path: '/account/settings/basic',
                name: 'BasicSettings',
                component: () => import('@/views/account/settings/BasicSetting'),
                meta: { title: 'account.settings.menuMap.basic', hidden: true, permission: ['user'] }
              },
              {
                path: '/account/settings/security',
                name: 'SecuritySettings',
                component: () => import('@/views/account/settings/Security'),
                meta: {
                  title: 'account.settings.menuMap.security',
                  hidden: true,
                  keepAlive: true,
                  permission: ['user']
                }
              }
            ]
          }
        ]
      },
      // 慢病管理
      {
        path: '/disease',
        component: RouteView,
        redirect: '/disease/ChronicDisease',
        name: 'ChronicDisease',
        meta: { title: 'menu.daily.management', icon: 'schedule', keepAlive: true, permission: ['disease'] },
        children: [
          {
            path: '/disease/chronic-disease',
            name: 'chronic-disease',
            component: () => import('@/views/disease/ChronicDisease'),
            // meta: { title: '慢病管理' }
            meta: { title: 'menu.chronic-management', keepAlive: true, permission: ['chronic_management'] }
          }
        ]
      },
      // 健康小站
      {
        path: '/station',
        component: RouteView,
        redirect: '/station/indexes',
        name: 'station',
        meta: { title: 'menu.station', icon: 'bank', keepAlive: true, permission: ['health_station'] },
        children: [
          {
            path: '/station/station-manage',
            name: 'station-manage',
            component: () => import('@/views/station/StationManage'),
            meta: { title: 'menu.station.manage', keepAlive: true, permission: ['station_manage'] }

          },
          {
            path: '/station/appointment-record',
            name: 'appointment-record',
            component: () => import('@/views/station/AppointmentRecord'),
            meta: { title: 'menu.station.appointment', keepAlive: true, permission: ['station_appointment'] }
          }
        ]
      },
      // account
      {
        path: '/health',
        component: RouteView,
        redirect: '/health/indexes',
        name: 'health',
        meta: { title: 'menu.health', icon: 'file-search', keepAlive: true, permission: ['health_index'] },
        children: [
          {
            path: '/health/chronic',
            name: 'chronic',
            component: () => import('@/views/health/HealthChronic'),
            // meta: { title: '慢病管理' }
            meta: { title: 'menu.health.chronic', keepAlive: true, permission: ['health_disease'] }

          },
          {
            path: '/health/indexes',
            name: 'indexes',
            component: () => import('@/views/health/IndexPage'),
            meta: { title: 'menu.health.indexes', keepAlive: true, permission: ['health_index'] }
          },
          {
            path: '/health/medicine',
            name: 'medicine',
            component: () => import('@/views/health/ChronicMedicineManage'),
            meta: { title: 'menu.health.medicine', keepAlive: true }
          }
        ]
      },
      {
        path: '/system',
        name: 'systemPage',
        component: RouteView,
        meta: { title: 'menu.system', icon: 'slack', permission: ['user', 'role_permission'] },
        children: [
          {
            path: '/system/account-manage',
            name: 'healthAccountManagePage',
            component: () => import('@/views/system/AccountList'),
            meta: {
              title: 'menu.system.health-account-manage',
              icon: 'tool',
              keepAlive: true,
              permission: ['user']
            }
          },
          {
            path: '/system/permission-manage',
            name: '权限管理',
            component: () => import('@/views/system/PermissionList'),
            meta: {
              title: '权限管理',
              icon: 'tool',
              keepAlive: true,
              permission: ['role_permission']
            }
          }
        ]
      }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      }
    ]
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  },

  {
    path: '/forget-password',
    name: 'forget-password',
    component: () => import(/* webpackChunkName: "user" */ '@/views/user/ForgetPassword')
  }
]
