/**
 * 向后端请求用户的菜单，动态生成路由
 */
import { constantRouterMap, asyncRouterMap } from '@/config/router.config'
// import { generatorDynamicRouter } from '@/router/generator-routers'

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes ({ commit }, data) {
      return new Promise(resolve => {
        // 这里处理路由权限 原版是从后端获取菜单，现在改成从前端获取菜单
        // const { token } = data
        commit('SET_ROUTERS', asyncRouterMap)
        // generatorDynamicRouter(token).then(routers => {
        //   commit('SET_ROUTERS', routers)
        //   resolve()
        // })
        resolve()
      })
    }
  }
}

export default permission
