// 对外暴露路由配置
export const constantRoute = [
  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    name: "login", // 路由命名
    meta: {
      title: "登录", // 菜单标题
      hidden: true, // 代表路由标题是否隐藏 true隐藏 false不隐藏
      icon: "Promotion", // 菜单图标
    },
  },
  {
    path: "/",
    component: () => import("../layout/index.vue"),
    name: "layout", // 路由命名
    meta: {
      title: "", // 菜单标题
      hidden: false, // 代表路由标题是否隐藏 true隐藏 false不隐藏
      icon: "Avatar", // 菜单图标
    },
    redirect: "/home",
    children: [
      {
        path: "/home",
        component: () => import("@/views/home/index.vue"),
        name: "home",
        meta: {
          title: "首页", // 菜单标题
          hidden: false, // 代表路由标题是否隐藏 true隐藏 false不隐藏
          icon: "HomeFilled", // 菜单图标
        },
      },
    ],
  },
  {
    path: "/screen",
    component: () => import("@/views/screen/index.vue"),
    name: "Screen",
    meta: {
      title: "数据大屏", // 菜单标题
      hidden: false, // 代表路由标题是否隐藏 true隐藏 false不隐藏
      icon: "Notebook", // 菜单图标
    },
  },
  {
    path: "/acl",
    component: () => import("@/layout/index.vue"),
    name: "Acl",
    meta: {
      title: "权限管理", // 菜单标题
      hidden: false, // 代表路由标题是否隐藏 true隐藏 false不隐藏
      icon: "Tickets", // 菜单图标
    },
    redirect: "/acl/user",
    children: [
      {
        path: "/acl/user",
        component: () => import("@/views/acl/user/index.vue"),
        name: "User",
        meta: {
          title: "用户管理", // 菜单标题
          hidden: false, // 代表路由标题是否隐藏 true隐藏 false不隐藏
          icon: "User", // 菜单图标
        },
      },
      {
        path: "/acl/role",
        component: () => import("@/views/acl/role/index.vue"),
        name: "Role",
        meta: {
          title: "角色管理", // 菜单标题
          hidden: false, // 代表路由标题是否隐藏 true隐藏 false不隐藏
          icon: "UserFilled", // 菜单图标
        },
      },
      {
        path: "/acl/permission",
        component: () => import("@/views/acl/permission/index.vue"),
        name: "Permission",
        meta: {
          title: "菜单管理", // 菜单标题
          hidden: false, // 代表路由标题是否隐藏 true隐藏 false不隐藏
          icon: "Postcard", // 菜单图标
        },
      },
    ],
  },
  {
    path: "/product",
    component: () => import("@/layout/index.vue"),
    name: "Product",
    meta: {
      title: "商品管理", // 菜单标题
      hidden: false, // 代表路由标题是否隐藏 true隐藏 false不隐藏
      icon: "Goods", // 菜单图标
    },
    redirect: "/product/trademark",
    children: [
      {
        path: "/product/trademark",
        component: () => import("@/views/product/trademark/index.vue"),
        name: "Trademark",
        meta: {
          title: "品牌管理", // 菜单标题
          hidden: false, // 代表路由标题是否隐藏 true隐藏 false不隐藏
          icon: "ShoppingCartFull", // 菜单图标
        },
      },
      {
        path: "/product/attr",
        component: () => import("@/views/product/attr/index.vue"),
        name: "Attr",
        meta: {
          title: "属性管理", // 菜单标题
          icon: "ChromeFilled", // 菜单图标
        },
      },
      {
        path: "/product/spu",
        component: () => import("@/views/product/spu/index.vue"),
        name: "Spu",
        meta: {
          title: "SPU管理", // 菜单标题
          hidden: false, // 代表路由标题是否隐藏 true隐藏 false不隐藏
          icon: "UserFilled", // 菜单图标
        },
      },
      {
        path: "/product/sku",
        component: () => import("@/views/product/sku/index.vue"),
        name: "Sku",
        meta: {
          title: "SKU管理", // 菜单标题
          hidden: false, // 代表路由标题是否隐藏 true隐藏 false不隐藏
          icon: "Postcard", // 菜单图标
        },
      },
    ],
  },
  {
    path: "/demo",
    component: () => import("@/layout/index.vue"),
    name: "Demo",
    meta: {
      title: "案例", // 菜单标题
      hidden: false, // 代表路由标题是否隐藏 true隐藏 false不隐藏
      icon: "Goods", // 菜单图标
    },
    redirect: "/demo/table",
    children: [
      {
        path: "/demo/table",
        component: () => import("@/views/demo/table/index.vue"),
        name: "table",
        meta: {
          title: "表格", // 菜单标题
          hidden: false, // 代表路由标题是否隐藏 true隐藏 false不隐藏
          icon: "List", // 菜单图标
        },
      },
      {
        path: "/demo/pagination",
        component: () => import("@/views/demo/pagination/index.vue"),
        name: "pagination",
        meta: {
          title: "分页", // 菜单标题
          hidden: false, // 代表路由标题是否隐藏 true隐藏 false不隐藏
          icon: "List", // 菜单图标
        },
      },
    ]
  },
  {
    path: "/404",
    component: () => import("@/views/404/index.vue"),
    name: "404", // 路由命名
    meta: {
      title: "404", // 菜单标题
      hidden: true, // 代表路由标题是否隐藏 true隐藏 false不隐藏
      icon: "HomeFilled", // 菜单图标
    },
  },
  {
    path: "/:pathMatch(.*)",
    redirect: "/404",
    name: "Any",
    meta: {
      title: "任意路由", // 菜单标题
      hidden: true, // 代表路由标题是否隐藏 true隐藏 false不隐藏
      icon: "Platform", // 菜单图标
    },
  },
];
