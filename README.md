# short-module-name-plugin

用于解决 webpack4 新增业务模块时， chunkid 与 moduleid 变化，导致 chunkhash 发生变化，文件缓存无法复用的问题。
需要 webpack 配置同时关了 tree sharking 和 scope hoisting

```js
 optimization: {
    usedExports: false,
    concatenateModules: false,
 }
```

# 补充

新增模块，导致 chunkhash 变化原因有 3

1.chunkid 与 moduleid 变化

2.作用域提升（scope hoisting）

3.tree sharking

关闭 scope hoisting 与 tree sharking 会导致包体积变大，所以比较适应的场景是同一个大仓库有多个需求的单页应用，通过配置一个大的路由表。每次新增项目的时候，往路由表里添加路由配置。

