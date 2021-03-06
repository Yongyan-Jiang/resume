# 茶余酒后音乐电台

[预览](https://yongyan-jiang.github.io/resume/projects/music-radio)

## 项目功能介绍
一款可适配横屏、全屏的响应式音乐电台播放器

功能：
- 音乐专辑可切换、可左右滚动
- 音乐播放可暂停与切换，切换音乐时，对应的背景图及音乐封面随之改变
- 实时显示音乐播放时间与更新进度条
- 歌词同步展示（歌词特效动画）

## 项目技术细节介绍
### 技术与实现
1. 组件化，面向对象编程
2. 使用EventCenter来连接频道切换与音乐播放两个组件
3. 由于需要适配屏幕的缩放与响应式，所以元素宽高主要用vh来设置
4. 在进度条上加上transition，可使进度条动画更连续。
5. 歌词特效写成jq插件，方便下次使用，字体动画特效借用了animate.css
### 问题及改进
1. $()类选择器忘记 . 标签选择器忘记 ''
2. $node.width()是数字, 而$node.css('width')带单位，两者加减之前需要用parseFloat()将后者转换为数字
3. 列表左右切换过快会导致bug，通过添加`.animate = true/false`来解决

## 项目收获
- jQuery和Audio对象操作更熟练
- 进一步熟练使用响应式、动画特效和正则表达式
- 尝试通过事件EventCenter来解耦两个模块
- 从项目需求到实现的思考过程更清晰

## 技术栈关键字
jQuery、CSS3动画、响应式、模块化


