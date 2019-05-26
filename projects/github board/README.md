# Github榜单

> 底部的三个TAB功能为：1. 前端项目排行 ；2. 前端高产用户排行；3. 项目搜索

## Github项目排行
接口： https://api.github.com/search/repositories?q=language:javascript&sort=stars&order=desc&page=1

查询第n页，只需要修改page字段即可。

## 用户排行
获取粉丝数大于1000、类目为javascript的第1页数据 https://api.github.com/search/users?q=followers:>1000+language:javascript&page=1

获取粉丝数大于1000、中国区、类目为javascript的第1页数据
https://api.github.com/search/users?q=followers:>1000+location:china+language:javascript&page=1

查询第n页，只需要修改page字段即可。

## 搜索项目
https://api.github.com/search/repositories?q=keyword+language:javascript&sort=stars&order=desc&page=1
keyword为要查询的关键字， page为页数