//获取菜单工具类， 菜单请求封装工具
import { getRequest } from "./api";

//初始化菜单方法 初始化之后放到路由的配置里面，整体放到vuex统一管理store
export const initMenu = (router, store) => {
    if (store.state.routes.length > 0) {
         //直接返回不需要初始化了
        return;
    }
    getRequest("/system/cfg/menu").then(data => {
        if (data) {
            //格式化router
            let fmtRoutes = formatRoutes(data);
            //添加到router
            router.addRoutes(fmtRoutes);
            //将数据存入vuex
            store.commit('initRoutes', fmtRoutes);
            //链接websocked, store 的action里面所以dispatch
            store.dispatch('connect');
        }
    })
}

export const formatRoutes = (routes) => {
    let fmtRoutes = [];
    routes.forEach(router => {
        let {
            path,
            component,
            name,
            meta,
            iconCls,
            children,
        } = router;
        if (children && children instanceof Array) {
            //递归
            children = formatRoutes(children);
        }

        //单独对某一个路由格式化
        let fmRouter = {
            path: path,
            name: name,
            meta: meta,
            iconCls: iconCls,
            children: children,
            component(resolve) {
               //es5写法 resolve格式化 vue懒加载 类似懒加载 前面路由 在下面import一样
                if(component.startsWith('Home')){
                    require(['../views/' + component + '.vue'], resolve);
                }else if (component.startsWith("Emp")) {
                    require(['../views/emp/' + component + '.vue'], resolve);
                } else if (component.startsWith("Per")) {
                    require(['../views/per/' + component + '.vue'], resolve);
                } else if (component.startsWith("Sal")) {
                    require(['../views/sal/' + component + '.vue'], resolve);
                } else if (component.startsWith("Sta")) {
                    require(['../views/sta/' + component + '.vue'], resolve);
                } else if (component.startsWith("Sys")) {
                    require(['../views/sys/' + component + '.vue'], resolve);
                }
            }
        }
        fmtRoutes.push(fmRouter);
    })
    return fmtRoutes;
}


