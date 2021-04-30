# short-module-name-plugin

用于解决 webpack4 新增业务模块时， chunkid 与 moduleid 变化，导致 chunkhash 发生变化，文件缓存无法复用的问题。
webpack4 构建过程中，chunkid 与 moduleid 生成，是按照解析顺序，然后从 0 开始的自然数增长。
