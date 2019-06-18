# DOM优化

### 浏览器渲染流程

1. 解析 HTML，构建 DOM 树(这里遇到外链，此时会发起请求)
2. 解析 CSS，生成 CSS 规则树
3. 合并 DOM 树和 CSS 规则，生成 render 树
(遍历可见节点,区分->display:none ->visibility: hidden->opacity: 0)
4. 布局 render 树(Layout/reflow)，负责各元素尺寸、位置的计算 
5. 绘制 render 树(paint)，绘制页面像素信息
6. 浏览器会将各层的信息发送给 GPU，GPU 将各层合成(composite)，显示在屏幕上

### Tips
+ 在上述渲染过程中，前 3 点可能要多次执行，比如 js 脚本去操作 dom、更改 css 样式时，浏览器又要重新构建 DOM、CSSOM 树，重新 render，重新 layout、 paint;
+ Layout 在 Paint 之前，因此每次 Layout 重新布局(reflow 回流)后都要重新出发 Paint 渲染，这时又要去消耗 GPU;
+ Paint 不一定会触发 Layout，比如改个颜色改个背景;(repaint 重绘)
+ 图片下载完也会重新出发 Layout 和 Paint;

### 何时触发 reflow 和 repaint
+ reflow(回流): 根据 Render Tree 布局(几何属性)，意味着元素的内容、结构、位置或尺 寸发生了变化，需要重新计算样式和渲染树;
    + 现代浏览器会对回流做优化，它会等到足够数量的变化发生，再做一次批处理回流。
        1. 页面第一次渲染(初始化)
        2. DOM 树变化(如:增删节点)
        3. Render 树变化(如:padding 改变)
        4. 浏览器窗口 resize
        5. 获取元素的某些属性: 
                浏览器为了获得正确的值也会提前触发回流，这样就使得浏览器的优化失效了，这些属性包括 offsetLeft、offsetTop、offsetWidth、 offsetHeight、 scrollTop/Left/Width/Height、 clientTop/Left/Width/Height、调用了 getComputedStyle()或者 IE 的 currentStyle
+ repaint(重绘): 意味着元素发生的改变只影响了节点的一些样式(背景色，边框颜色， 文字颜色等)，只需要应用新样式绘制这个元素就可以了;
+ reflow 回流的成本开销要高于 repaint 重绘，一个节点的回流往往回导致子节点以及同 级节点的回流;

## 优化 reflow、repaint 触发次数
+ 避免逐个修改节点样式，尽量一次性修改
+ 使用 DocumentFragment 将需要多次修改的 DOM 元素缓存，最后一次性 append 到真实 DOM 中渲染
+ 可以将需要多次修改的 DOM 元素设置 display: none，操作完再显示。(因为隐藏元素不在 render 树内，因此修改隐藏元素不会触发回流重绘)
+ 避免多次读取某些属性(见上)
+ 将复杂的节点元素脱离文档流，降低回流成本

## DOM 优化常用方法

