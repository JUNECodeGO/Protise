# 提高JS加载及执行的性能

### 前提要领

+ 浏览器渲染页面时,加载资源是由单独的下载线程进行异步加载
+ css加载不会阻塞DOM树的构建,但是会阻塞渲染(防止css的重绘或回流)
+ JS拥有阻塞特性(js执行过程中无法构建dom及渲染页面)

### 如何提高性能

1.  从加载上优化 -> 合理放置脚本位置

>由于每个<script>的出现都会让页面等待脚本的加载解析或执行,因此我们应该尽量的让内容和样式先暂时出来,将js文件放在body的最后,以此来优化用户体验感.

```
<body>
...
<script type="text/javascript" src="index.js"></script>
</body>
```

2.  从请求次数上优化  -> 减少请求次数

>由于每个<script>的出现都会阻塞页面渲染.因此要减少页面的<sscript>标签

+ 特别注意: 把内嵌脚本放在<link>后面,页面会阻塞去等待样式表的下载,之后再去执行脚本

>最耗费时间的还有每一次去后端获取资源(http三次握手),所以减少HTTP请求,也是其中一项.

+ 文件的精简与压缩(css精灵及js)
+ 解析型的js压缩o工具: YUI Compresspr 、 CLosure Complier 、 UglifyJs

3. 从加载方式上优化 -> 无阻塞脚本加载

>在页面加载完后才加载js代码

+ 延迟脚本加载(defer)
>可放在文档任何位置,可以与其他资源文件一起下载,在页面加载完成后才会执行
```
<script type="text/javascript" src="index.js" defer></script>
```
+ 延迟脚本加载(async)
>属于异步加载脚本,也可以与其他资源文件一起下载,在加载完成后自动执行执行

4. 从加载方式上优化 -> 动态添加脚本元素

>在页面加载完后才加载js代码

```
var script = document.creatElement("script");
script.type = "text/javascript";
script.src = "index.js";
document.getElementsByTagName("head")[0].appendChild(script);
```
4. 从加载方式上优化 -> XMLHttpRequest

>与动态添加脚本元素思想一致

```
vvar xhr = new XMLHttpRequest();
xhr.open('get','index.js',true);
xhr.onreadystatechange = function(){
    if(xhr.readyState == 4){
        if(xhr.status >= 200 && xhr.status < 300 || xhr.status == 304){
            var script = document.creatElement("script");
            script.type = "text/javascript";
            script.text = xhr.responseText;
            document.body.appendChild(script);
        }
    }
}
```
>优点
+ 控制脚本s何时执行
+ 兼容性好
>缺点
+ 资源需要在同个域下,不可以跨域执行