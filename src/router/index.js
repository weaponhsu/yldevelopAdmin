import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes system mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/googleAuthenticator',
    component: () => import('@/views/login/googleAuthenticator'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: '首页',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard', roles: ['admin', 'customerService', 'storeSupporter', 'agent'] }
    }]
  },
  {
    path: '/center',
    component: Layout,
    name: '个人中心',
    meta: { title: '个人中心', icon: 'dashboard' },
    hidden: true,
    children: [
      {
        path: '/authenticator',
        name: '谷歌认证器',
        component: () => import('@/views/system/user/googleAuthenticator'),
        meta: { title: '谷歌认证器', icon: 'dashboard' }
      },
      {
        path: '/password',
        name: '修改密码',
        component: () => import('@/views/system/user/password'),
        meta: { title: '修改密码', icon: 'dashboard' }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/system',
    component: Layout,
    name: 'System',
    meta: {
      title: '系统管理',
      icon: 'system',
      roles: ['后台角色管理', '后台账号管理', '后台权限管理', '后台菜单管理']
    },
    children: [
      {
        path: 'role',
        component: () => import('@/views/system/role/index'),
        meta: { title: '角色管理', roles: ['后台角色管理'] }
      },
      {
        path: 'user',
        component: () => import('@/views/system/user/index'),
        meta: { title: '管理员管理', roles: ['后台账号管理'] }
      },
      {
        path: 'menu',
        component: () => import('@/views/system/menu/index'),
        meta: { title: '后台菜单管理', roles: ['后台菜单管理'] }
      },
      {
        path: 'access',
        component: () => import('@/views/system/access/index'),
        meta: { title: '后台权限管理', roles: ['后台权限管理'] }
      }
    ]
  },
  {
    path: '/alibaba',
    component: Layout,
    name: 'Alibaba',
    meta: {
      title: '1688商品管理',
      icon: 'shop',
      roles: ['阿里巴巴产品管理员', '阿里巴巴产品管理员']
    },
    children: [
      {
        path: 'category',
        component: () => import('@/views/alibaba/category/index'),
        meta: { title: '阿里巴巴产品分类管理', roles: ['阿里巴巴产品管理员'] }
      },
      {
        path: 'product',
        component: () => import('@/views/alibaba/product/index'),
        meta: { title: '阿里巴巴产品管理', roles: ['阿里巴巴产品管理员'] }
      }
    ]
  },
  {
    path: '/exchange',
    component: Layout,
    name: 'Exchange',
    meta: {
      title: '兑换商品管理',
      icon: 'people',
      roles: ['兑换商品分类管理', '兑换商品管理']
    },
    children: [
      {
        path: 'category',
        component: () => import('@/views/exchange/category/index'),
        meta: { title: '兑换商品分类管理', roles: ['兑换商品分类管理'] }
      },
      {
        path: 'product',
        component: () => import('@/views/exchange/product/index'),
        meta: { title: '兑换商品管理', roles: ['兑换商品管理'] }
      }
    ]
  },
  {
    path: '/orders',
    component: Layout,
    name: 'Orders',
    meta: {
      title: '订单管理',
      icon: 'shopping',
      roles: ['兑换订单管理', '订单管理', '淘客订单管理']
    },
    children: [
      {
        path: 'alibaba',
        component: () => import('@/views/orders/alibaba/index'),
        meta: { title: '订单管理', roles: ['订单管理'] }
      },
      {
        path: 'tbk',
        component: () => import('@/views/orders/tbk/index'),
        meta: { title: '淘客订单管理', roles: ['淘客订单管理'] }
      },
      {
        path: 'exchange',
        component: () => import('@/views/orders/exchange/index'),
        meta: { title: '兑换订单管理', roles: ['兑换订单管理'] }
      }
    ]
  },
  {
    path: '/members',
    component: Layout,
    name: 'Members',
    meta: {
      title: '会员管理',
      icon: 'people',
      roles: ['会员管理', '会员收货地址管理']
    },
    children: [
      {
        path: 'member',
        component: () => import('@/views/member/member/index'),
        meta: { title: '会员管理', roles: ['会员管理'] }
      },
      {
        path: 'address',
        component: () => import('@/views/member/address/index'),
        meta: { title: '会员收货地址管理', roles: ['会员收货地址管理'] }
      }
    ]
  },
  {
    path: '/finance',
    component: Layout,
    name: 'Finance',
    meta: {
      title: '金币余额流水管理',
      icon: 'money',
      roles: ['财务管理']
    },
    children: [
      {
        path: 'withdraw',
        component: () => import('@/views/finance/withdraw'),
        meta: { title: '余额提现管理', roles: ['财务管理'] }
      },
      {
        path: 'integral',
        component: () => import('@/views/finance/integral'),
        meta: { title: '金币流水管理', roles: ['财务管理'] }
      },
      {
        path: 'balance',
        component: () => import('@/views/finance/balance'),
        meta: { title: '余额流水管理', roles: ['财务管理'] }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
