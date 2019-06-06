## 新浪新闻浏览页
> 通过新浪新闻API获取数据，使用jQuery和懒加载、瀑布流方法实现。

[预览地址](https://yongyan-jiang.github.io/resume/projects/waterfall-sinanews)
## 实现原理
当鼠标滚动页面内容下方的#load出现在视野窗口时：
1. 获取page的30条数据
2. 把30条数据拼装成dom放到页面上
3. 使用瀑布流去摆放dom的位置
4. page++
## 懒加载原理
在所有item的后面添加一个 #load，当滚动时判断这个#load是否出现在窗口视野内。
当#load出现在视野内时发送ajax请求，传入回调，拼接HTML字符串加入到容器
## 瀑布流原理
获取到item时，根据当前窗口宽度，计算列数，生成arrColHeight储存列的高度。调整浏览器到不同宽度，生成列数也不同。
每当一个item加载完成时，利用绝对定位，将该item排列到当前高度最小的那一列
## 其他
- ### 响应式
on resize时重新计算列数，重新排列每个item
- ### 防抖
on scroll和on resize时防抖，防止多次触发