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


### 浏览器渲染
浏览器内核分为：
渲染引擎
JS引擎
浏览器线程：
GUI渲染线程
JS引擎线程
两者互斥，因此尽量把script放在底部或者给script标签加上defer或者async属性

###defer与async
+ 没有async和defer
遇到script 会直接进行加载并且执行
+ 有defer
script会异步加载（与html解析同时进行）最后等到全部结束之后再执行defer-script。继而再触发DOMContentLoaded事件
+ 有async
与defer的区别是async-script加载完之后就会执行，此时html解析会停止，待执行完之后再继续。并且一定再load触发之前执行，但有可能在DOMContentLoad之前或之后触发

如果先引入了JS CSSOM也会受到阻塞，因为js想改CSSOM，就要等CSSOM加载完再加载JS，最后再加载DOM
一开始CSSOM和DOM的构建互不影响

####重绘 回流（重排）

+ 重绘 不改变其几何属性：颜色，背景色
+ 回流（重排） 修改其几何尺寸：修改元素的宽或高

###如何减少回流和重绘
1. 使用transform替代top
2. 使用visibility替代display：none
3. 不要把节点属性放在循坏里面 such as:offsetTop
4. 不要使用table布局

___

##浏览器存储

###cookie
> cookie本职不是用来存储数据而是用来维持状态，因为HTTP协议是无状态的，起自身不对请求和响应之间的通信状态进行保存。
可以理解cookie是浏览器上的小小文件夹，它依附再http请求上 在服务器和浏览器之间飞来飞去

####cookie是服务端生成，客户端进行维护和存储

典型应用场景：
+ 记住密码，下次自动登陆
+ 购物车
+ 记录用户浏览数据，进行商品推荐（广告）

cookie生成方式：
+ 浏览器第一次请求，服务器响应头中——http response header set-cookie（默认情况下domain设置为cookie页面的主机名，我们也可以手动设置domain的值）
+ js中通过document.cookie读写cookie（doomain标识指定了哪些域名可以接受cookie，假如没有设置domian，就自动绑定到执行语句的当前域）

####cookie的缺陷
+ cookie不够大 4kb左右
+ 过多的cookie会带来巨大的性能消耗
cookie紧跟着域名，同一个域名下的请求都会携带cookie，假如请求一张图片就带着cookie而且cookie内容又不需要，这样就劳民伤财了
+ HTTP请求下存在安全性问题

####cookie与安全
| 属性 | 作用 |
| ------------- |:-------------:|
| value | 对值进行加密 |
| http-only | 不能通过JS访问Cookie，减少XSS攻击 |
| secure | 只能在https协议中的请求中携带 |
| same-site | 规定浏览器不能再跨域中携带cookie，减少csrf攻击 |

### web Storage
>由html5新增 分为sessionStorage 和 localStorage

###LocalStorage

+ 存储的数据长期存在
+ 大小为5M左右
+ 仅在客户款使用，不和服务端进行通信
> 因此LocalStorage可以作为浏览器本地缓存方案，用来提升网页首屏渲染数据

######存入/读取数据
```
if（window.localStorage){
    localStorage.setItem('name','world')
}
var name = loacalStorage.getItem('name')
```
#####使用场景
>利用其持久的特点，用来存储一些稳定的资源，例如Base64格式图片字符串

###sessionStorage
+ 即使是相同域名下的两个页面，只要他们不在同一个浏览器窗口打开，那么他们的sessionStorage不可以进行共享
+ localStorage在所有同源的窗口中都是共享的，cookie也是。
>同于保存浏览器的一次会话数据，会话结束（浏览器关闭），数据清空。

+ 会话级别的浏览器存储
+ 大小为5M左右
+ 仅在客户款使用，不和服务端进行通信
> sessionStorage可以有效对表单信息进行维护，比如刷新时，表单信息不丢失；用来存储生命周期和它同步的会话级别信息，例如微博

###IndexedDB
>IndexedDB是一种低级API，用于客户端存储大量结构化数据，是一个运行在浏览器上的非关系型数据库

+ 依旧是键值对的形式存在，但是任何数据类型都可存
+ 其为异步，用户依然可以进行其他操作，localStorage 是同步操作
+ 同源限制，每个数据库都有对应的域名，不能跨域访问其他域
+ 一般不少于250m，甚至没有上线
+ 支持事物，在一系列操作中，只要有一步失败，整个事务就会失败，返回最初的状态

#####常见操作

+ 建立发开IndexedDB
`window.indexedDB.opnen("testDB")`

___

###浏览器缓存机制
#####缓存位置
+ Service Work
+ Memory Cache
+ Disk Cache
+ Push Cache

1. Service Worker
>它是运行在浏览器背后的独立线程，使用Service Worker的话，传输协议必须为HTTPS。因为Service Worker中涉及请求拦截，所以必须使用HTTPS协议来保障安全。

实现缓存分为三个步骤：
+ 注册Service Worker 
+ 监听 install 事件，实现缓存文件
+ 下次用户访问的时候可以通过拦截请求的方式查询是否存在缓存

——特点Service Worker 的缓存与浏览器其他内建缓存机制不同，它可以让我们自由控制缓存那些文件，如何匹配缓存，如何读取缓存，并且缓存是持续性的

2. Memory Cache
> 内存中的缓存，主要是包含当前页面中已经抓取的资源，但其持续性很短。会随着进程的释放而释放。
+ 即使内存缓存搞笑，但是其内存容量比硬盘小得多
+ 内存缓存中有一块缓存资源是由preloader指令下载来的。因为其可以一边解析js/css文件，一边网络请求下一个资源

3. Disk Cache
> 硬盘中的缓存，是浏览器缓存中，覆盖面最大。他会根据HTTP Header来判断资源的需求

4. Push Cache
> 推送缓存，只有在上面三种缓存都没有命中时，才会被使用。并且其只在session中存在。缓存时间短暂，一旦结束会话就被释放。

#####缓存策略
> 一般通过HTTP Header设置
+ 强缓存
+ 协商缓存

####强缓存
> 不会向服务器发送请求，直接从缓存中读取资源。并不关心服务器文件是否已经更新，可以通过设置两种HTTP Header实现： Expires 和Cache_Control

1. Expires 
缓存过期时间，用来指定资源到期的时间，是服务端的具体时间点。Expires = max-age + 请求时间
它是HTTP/1的产物受限于本地时间，如果修改了本地时间，可能会造成缓存失败。

2. Cache—Control
它是一个规则，主要用于控制网页缓存，可以在请求头或响应头中设置：

| 指令 | 作用 |
| ------------- |:-------------:|
| public | 表示相应可以被客户端和代理服务器缓存 |
| private | 标识响应只可以被客户端缓存 |
| max-age = 30 | 缓存30秒过期，需要重新请求 |
| s-maxage = 30 | 覆盖上一个，作用一样，只在代理服务器中生效 |
| no-store | 不缓存任何响应 |
| no -cache | 资源被缓存，但是立即失效，在浏览器使用前，先确认一下数据是否还跟服务器保持一致|
| max-stale = 30 | 30s内即使缓存过期也使用该缓存 |
| min-fresh = 30 | 希望在30秒内获取最新响应 |

####协商缓存
> 协商缓存就是强制缓存失效后，浏览器携带缓存标识向服务器发起请求，由服务器根据缓存标识决定是否使用缓存的过程

1. Last-Modified
根据时间判断资源判断是否更新，缺陷按秒进行保持
2. Modified-Since
根据资源内容判断是否更新，性能会比1低一些，但是优先级高些

####缓存机制
—>判断是否缓存
—>是
—>判断是否过期
—>是
—>协商缓存，问服务器资源是否更新
—>是的话换回新的资源+200 否的话 返回304 继续使用缓存



########缓存过程分析
浏览器            浏览器缓存          服务器

—>第一次发起HTTP请求—
—没有该请求的结果及标识<—
————————————————————>发起http请求—
—请求的结果及请求标识<————————————————
->将该请求结果及标识存入浏览器缓存中


#####HTTP协议——超文本传输协议
> 基于TCP/IP协议通信来传输，不涉及数据包传输，主要规定客户端和服务器之间的通信格式

#########HTTP特点
1. 简单快速
2. 灵活，HTTP允许传输任意类型的数据对象
3. 无连接，每次连接，只处理一个请求
4. 无状态 每个请求都是独立的

#########HTTP报文
1.请求行 说明请求类型 要访问的资源 以及http版本
post /chapter17/user.html HTTP/1.1

2. 请求头由键值对组成，每行一对，关键词和值用英文冒号分隔

3. 最后一个请求头之后是一个空行，这个行非常重要，它表示请求头已经结束，接下来的是请求正文。

4. 请求体，可以承载多个请求参数的数据

GET/POST 区别
1. get再url传输中参数长度有要求，post没有
2. post需要包裹在request body中
3. url的请求参数被保存在浏览器中，而浏览器不会
4. get会被浏览器主动缓存

#####持续连接
> 每次的请求都会造成无谓的 TCP 连接建立和断开，增加通信量的 开销。

持久连接特点
为解决上述 TCP 连接的问题，HTTP/1.1 和一部分的 HTTP/1.0 想出了持久连接（HTTP Persistent Connections，也称为 HTTP keep-alive 或 HTTP connection reuse）的方法。
持久连接的特点是，只要任意一端没有明确提出断开连接，则保持TCP连接状态


#####什么是NTTPS
> HTTPS是在HTTP上建立SSL加密层，并对传输数据进行加密，是HTTP协议的安全版。

作用：
1. 对数据进行加密，并建立一个信息安全通道，来保证传输过程中的数据安全
2. 对网站服务器进行真实身份认证

#####http存在的问题
1. 通信使用明文（不加密），内容可能被窃听
2. 无法证明报文的完整性，所以可能被篡改



















---

####数据结构
研究数据的逻辑结构和物理结构的相互关系

#####数据类型：
> 整型、浮点型、字符型等
#####逻辑结构
+ 集合 结构中数据元素同属于一种类型
+ 线性结构 数据元素一对一
+ 树形结构 数据元素一对多
+ 网状结构或图状结构 数据元素之间存在多对多的关系
#####物理结构/存储结构
> 描述数据具体在内存中的存储，如顺序结构、链式结构、索引结构和哈希结构

###数据结构
1. 数组 | 
数组是可以在内存中连续存储多个元素的结构，数组中的元素通过数组下标进行访问
--> 使用场景： 频繁查询，对存储空间要求不大，很少增加和删除的情况
######数组特点：
+ 查询方便 时间复杂度O(1) 内存中占用了连续空间
+ 进行添加删除是 时间复杂度变成O(n)
+ 数组从栈中分配空间，链表从堆中




2. 栈 | 
栈是一种特殊的线性表，仅能在线性表的一端操作，栈顶允许操作。栈的特点是先进后出
3. 队列 | 
队列也是一种线性表，可以在一段添加元素，另一端取出元素，也就是先进先出
such as: 进 A <-- B <-- C 出 A <-- B <-- C
--> 使用场景: 因为队列先进先出的特点，在多线程阻塞队列管理中非常适用。
4. 链表 | 
链表是物理存储单元上非连续的、非顺序的存储结构，数据元素的逻辑顺序是通过链表的指针地址实现，每个元素包含两个结点，
一个是存储元素的数据域 (内存空间)，另一个是指向下一个结点地址的指针域。根据指针的指向，链表能形成不同的结构，
例如单链表，双向链表，循环链表等。 
--> 使用场景: 因为链表占用空间大，查找元素需要遍历链表链，非常耗时，所用适用一些数据量较少的场景。
######链表特点：
+ 定位元素 时间复杂度O(n)
+ 进行添加删除是 时间复杂度变成O(1)，不必挪动元素
+ 链表中在内存中不是连续存储
+ 不支持随机，地址不持续






5. 树 | 
树是一种树形结构，它是由n(n>=1)个有限节点组成一个具有层次关系的集合，它有以下特点：
+ 每个节点多令或多个子节点
+ 没有父节点的节点称为根节点
+ 每个分根节点只有一个父节点

——二叉树
> 二叉树是一种特殊的树：
+ 每个结点最多只有两颗字树，结点的度最大为2
+ 左子树和右字数是由顺序，次序不能颠倒
+ 即使某结点只有一个子树，也要区分左右子树

使用场景： 二叉树既有链表的好处，又有数组的好处，是两者的优化方案，在处理大批量的动态数据非常有用。扩展：平衡二叉树、红黑树、B+树、字典树等
+ 二叉查找树（二叉搜索树）如果左边不为空，则左边的所有结点均小于它的根结点，如果有边不为空则右边的所有结点都大于它的根结点
+ 平衡二叉树（AVL树） 左右两边的树高度差不能大于1
+ 红黑树 非常复杂，它不同于普通二叉查找树是自底向上
6. 散列表/哈希表 
> 根据关键码和值直接进行访问的数据结构，通过key和value来映射到集合中的一个位置

哈希表就是key通过一个固定的算法即哈希函数转换成一个整型数字，然后将该数字对数组长度进行取余，把取余结果当作数组的下标，将value存储在已该数字为下标的数组空间里。
这种存储空间可以从分利用数组查找优势来查找元素。

7. 堆
> 是一种比较特殊的数据结构，可以被看做一棵树的数组对象
+ 堆中某个节点的值总是不大于或不小于其父节点的值
+ 堆总是一颗完整的完全二叉树
将根节点最大的堆叫做最大堆或大根堆，根节点最小的堆叫做最小堆或小根堆。
堆的定义如下：n个元素的序列{k1,k2,ki,…,kn}当且仅当满足下关系时，称之为堆。 
(ki <= k2i,ki <= k2i+1)或者(ki >= k2i,ki >= k2i+1), (i = 1,2,3,4…n/2)，满足前者的表达式的成为小顶堆，满足后者表达式的为大顶堆，这两者的结构图可以用完全二叉树排列出来

___

###排序算法
1. 冒泡排序
> 每次在查找范围内通过相邻元素两两比较交换，将这个范围内最大的一个元素通过多次交换直到将元素移到该范围的最后一个位置。 即每次循环后将第n大的数放在第n个位置。 所以内层循环是从 0 到 n - i, 因为内层循环每次只需要找 第(n - i)大的数， 内层循环每次从右边减少一个。
```
for(var i = 0; i < arr.length - 1; i++){
    for(var j = 0, stop = arr.length -1 -i; j < stop ; j++){
        var v = 0
        if(arr[j] > arr[j+1]){
        v = arr[j]
        arr[j] = arr[j+1]
        arr[j+1] = v
        }
   }
}
```
2. 选择排序
> 思想
  每次把最小的一个元素选择出来，放到对应的位置。 例： 第1轮从第0个元素开始遍历，一直遍历到数组结尾，找出最小的元素的索引值，然后与第0个位置上的元素交换。 第2轮从第1个元素开始遍历，一直遍历到数组结尾，找出最小的元素的索引值，然后与第1个位置上的元素交换。 ... 第n轮从第n-1个元素开始遍历，一直遍历到数组结尾，找出最小的元素的索引值，然后与第n-1个位置上的元素交换。
```
 var min
        for(var i = 0; i < arr.length; i++){
           min = i
            for(var j = i+1; j < arr.length ; j++){
                if(arr[j] < arr[min]){
                    min = j
                }
            }
            if(i !== min){
                var a = arr[min]
                arr[min] = arr[i]
                arr[i] = a
            }
        }
```
3. 插入排序
> 思想
第 0 个元素不遍历； 第 1 个元素与它前面的第 0 个元素比较，如果它比前面元素大，那么交换这两个元素； 第 2 个元素与它前面的第 1 个元素比较，如果它比前面元素大，那么交换这两个元素，再接着与第 0 个元素进行比较 ... 第 n 个元素依次与他前面的元素进行比较，直到它前面的元素比他小就 break;
```
   var value;
        for (var i = 0; i < arr.length ;i++){
            value = arr[i]
            for( var j = i-1;j >-1 && arr[j] > value;j--){
                arr[j+1] = arr[j]
            }
            arr[j+1] = value
        }
        console.log(arr)
```

4.合并排序
> 思想
先将数不断的二分，一个长度为 N 的数组在 log N 次二分后每一个部分就只剩下一个元素了，然后逐层向上归并。向上归并时，每次将挨着的两个部分合为一个部分，合的过程是将两个有序数组合并
```
function result(arr) {
        if(arr.length < 2){
            return arr
        }
        var illen = Math.floor(arr.length/2)
        var left = arr.splice(0,illen)
        var right = arr
        // console.log(left,right)
        var params = merge(result(left),result(right))
        params.unshift(0,arr.length)
        arr.splice.apply(arr,params)//将原来的arr数组替换成排序后的数组
        return arr
    }
    function merge(left,right){
        var result= []
        var ir = 0;
        var il = 0
        while(ir < right.length && il < left.length){
            if(left[il] < right[ir]){
                result.push(left[il++])
            }else{
                result.push(right[ir++])
            }
        }
        return result.concat(left.splice(il)).concat(right.splice(ir))
    }
```
5.快速排序
>思想
在数据集之中，选择一个元素作为”基准”（pivot）,所有小于”基准”的元素，都移到”基准”的左边；所有大于”基准”的元素，都移到”基准”的右边,对”基准”左边和右边的两个子集，不断重复第一步和第二步，直到所有子集只剩下一个元素为止。
```
 function result(arr) {
        if(arr.length <= 1){
            return arr
        }
        var index = Math.floor(arr.length/2)
        var pivot = arr.splice(index,1)[0]
        var left = []
        var right = []
        for(var i = 0; i< arr.length; i++){
            if(arr[i] <pivot){
                left.push(arr[i])
            }else{
                right.push(arr[i])
            }
        }
        return result(left).concat([pivot],result(right))
    }
```

6.希尔排序
> 思想
希尔排序也成为“缩小增量排序”，其基本原理是，现将待排序的数组元素分成多个子序列，使得每个子序列的元素个数相对较少，然后对各个子序列分别进行直接插入排序，待整个待排序列“基本有序”后，最后在对所有元素进行一次直接插入排序。因此，我们要采用跳跃分割的策略：将相距某个“增量”的记录组成一个子序列，这样才能保证在子序列内分别进行直接插入排序后得到的结果是基本有序而不是局部有序。希尔排序是对直接插入排序算法的优化和升级
```
unction result(arr) {
        var len = arr.length,
            temp,
            gap = 1;
        while(gap < len/3 ){
            gap  =  gap*3+1
        }
        for(gap;gap>0;gap = Math.floor(gap/3)){
            for(var k = gap;k<arr.length;k++){
                temp = arr[k];
                for(var j = k-gap;j >= 0&&arr[j]>temp;j-=gap){
                    arr[j+gap] = arr[j]
                }
                arr[j+gap] = temp
            }
        }
        return arr
```
### 计算机网络概述

OSI 
> 开放系统互练基本参考模型

网络协议三要素：
语法、语义、同步

####分层次的体系结构 （下层向上层提供服务）

| OSI体系结构 | TCP/IP 体系结构 | 五层协议结构 | 协议族 |
| ------------- |:-------------:|:-------------:|:-------------:|
| 应用层 | 应用层 （各种协议 telnet ftp smtp）| 应用层 | HTTP，FTP，TFTP，DNS，Telnet，SMTP |
| 表示层 |  | | 没有协议 |
| 会话层 | | | 没有协议 |
| 运输层 | 运输层TCP/UDP | 运输层 | TCP，UDP |
| 网络层 | 网络层IP | 网络层 | IP，ICMP，RIP，IGMP |
| 数据链路层 | 网络接口层| 数据链路层 | SLIP，CSLIP，PPP，ARP，RARP |
| 物理层 |  | 物理层 |

1. 应用层 —— 为特定应用程序提供数据传输服务，例如 HTTP、DNS 等。数据单位为报文
DNS域名解析协议：DNS服务作用：负责解析域名，将域名解析为IP地址；
FTP文件传输协议
远程终端协议TELNET
支持电子邮件的SMTP协议
万维网应用的HTTP协议

2. 运输层——负责向两台主机中进程之间的通信提供通用的数据传输服务，应用进程利用该服务传送应用层报文。
• 传输控制协议TCP (Transmission Control Protocol)——提供面向连接的、可靠的数据传输服务，其数据传输的单位是报文段(segment)。 
• 用户数据报协议UDP (User Datagram Protocol)—–提供无连接的、尽最大努力(best-effort)的数据传输服务（不保证数据传输的可靠性），其数据传输的单位是用户数据报。

3.网络层——负责为分组交换网上的不同主机提供通信服务。在发送数据时，网络层把运输层产生的报文段或用户数据报封装成分组或包进行传送。在 TCP/IP体系中，由于网络层使IP协议，所以分组也叫做IP数据报 
网际协议IP
+ 地址解析协议APR 根据已知道的IP地址解析出该主机的硬件地址
+ 网际报文管理协议ICMP
+ 网际组织管理协议IGMP

4.数据链路层 —— 将网络层交下来的IP数据组装成帧
5.物理层 —— 考虑的是比特流的传输问题，屏蔽传输媒体的差异性

### web页面请求过程

1. 向 DNS 服务器发送 DNS 查询报文来解析域名。
2. 开始进行 HTTP 会话，需要先建立 TCP 连接。
3. 在运输层的传输过程中，HTTP 报文被封装进 TCP 中。HTTP 请求报文使用端口号 80，因为服务器监听的是 80 端口。连接建立之后，服务器会随机分配一个端口号给特定的客户端，之后的 TCP 传输都是用这个分配的端口号。
4. 在网络层的传输过程中，TCP 报文段会被封装进 IP 分组中，IP 分组经过路由选择，最后到达目的地。
5. 在链路层，IP 分组会被封装进 MAC 帧中，IP 地址解析成 MAC 地址需要使用 ARP。
6. 客户端发送 HTTP 请求报文，请求获取页面。
7. 服务器发送 HTTP 相应报文，客户端从而获取该页面。
8. 浏览器得到页面内容之后，解析并渲染，向用户展示页面。




#前端模块化
###前端模块化进程
 -> 用全局函数，将不同功能声明为不同的全局函数
 -> 用命名空间，通过封装对象防止变量名污染
 -> 用闭包

 
 ###模块化规范
 1. command.js
 主要用于服务器，用的是同步加载模块，其机制是，输入是输出的拷贝，一旦输出，内部的变化不能影响输出
 ```
 module.export
 require
 ```
 2. AMD
AMD规范则是非同步加载模块，允许指定回调函数，可以用与浏览器
 ```
 defined
 require
 ```
3. CMD
专门用于浏览器，异步加载模块，，ES6 模块输出的是值的引用。
4. ES6
  ```
  export.deafult
  require
  ```
总结
+ CommonJS规范主要用于服务端编程，加载模块是同步的，这并不适合在浏览器环境，因为同步意味着阻塞加载，浏览器资源是异步加载的，因此有了AMD CMD解决方案。
+ AMD规范在浏览器环境中异步加载模块，而且可以并行加载多个模块。不过，AMD规范开发成本高，代码的阅读和书写比较困难，模块定义方式的语义不顺畅。
+ CMD规范与AMD规范很相似，都用于浏览器编程，依赖就近，延迟执行，可以很容易在Node.js中运行。不过，依赖SPM 打包，模块的加载逻辑偏重
+ ES6 在语言标准的层面上，实现了模块功能，而且实现得相当简单，完全可以取代 CommonJS 和 AMD 规范，成为浏览器和服务器通用的模块解决方案。

###同源策略
同源策略是一种约定，为了防止浏览器收到XSS等攻击，协议、域名、端口相同
受限制的有：
cookie,localstorage,indexDB
dom
ajax
不受限制：
img src>
link href>
script src>

####跨域
不同域互相访问资源，就算跨域
跨域是浏览器防止用户访问其他域的资源，引起请求发出去了，响应的时候，浏览器觉得不安全，拦截了响应

####跨域方案
1. jsonp
利用script标签没有跨域限制的漏洞，动态访问数据，但是一定要对方服务器允许
缺点是仅支持get方法具有局限性,不安全可能会遭受XSS攻击。

2. cors 100 1 
CORS 需要浏览器和后端同时支持

3. stMessage
postMessage是HTML5 XMLHttpRequest Level 2中的API，且是为数不多可以跨域操作的window属性之一，它可用于解决以下方面的问题：

页面和其打开的新窗口的数据传递
多窗口之间消息传递
页面与嵌套的iframe消息传递
上面三个场景的跨域数据传递
postMessage()方法允许来自不同源的脚本采用异步方式进行有限的通信，可以实现跨文本档、多窗口、跨域消息传递。

4. websocket
Websocket是HTML5的一个持久化的协议，它实现了浏览器与服务器的全双工通信，同时也是跨域的一种解决方案。
WebSocket和HTTP都是应用层协议，都基于 TCP 协议。但是 WebSocket 是一种双向通信协议，在建立连接之后，WebSocket 的 server 与 client 都能主动向对方发送或接收数据。同时，WebSocket 在建立连接时需要借助 HTTP 协议，连接建立好了之后 client 与 server 之间的双向通信就与 HTTP 无关了。

5. Node中间件代理(两次跨域)
实现原理：同源策略是浏览器需要遵循的标准，而如果是服务器向服务器请求就无需遵循同源策略。





#盲点汇总：
1. cpu 通过时间分片的形式给进程分配资源，其中一个资源满足需求之后就会将资源释放
2. CPU中的位指的是一个时钟周期可以处理的数据数量。8位为一个字节，32位就是一次可以处理4个字节，64位是一次可以处理8个字节
3. 32位CPU是指数据总线有32位，寄存器是暂存数据和中间结果的单元，因此寄存器的位数指的也是处理数据的长度肯定是和数据总线的根数相同，否则寄存器和CPU内其他单元之间将无法通信，交换数据。
因此32位CPU的32位是包含了寄存器是32位的意思，但其实定义是数据总线的宽度和根数。
4. List 是一个有序集合，可以存放重复的数据 (有序：存进是什么顺序，取出时还是什么顺序)
                (1).ArrayList 底层是数组适合查询，不适合增删元素。
                (2).LiskedList 底层是双向链表适合增删元素，不适合查询操作。
                (3).Vector 底层和ArrayList相同，但是Vector是线程安全的，效率较低很少使用
5. Set 是一个无序集合，不允许放重复的数据 (无序可重复，存进和取出的顺序不一样)
                (1).HashSet 底层是哈希表/散列表
                (2).TreeSet 继承sartedSet接口（无需不可重复，但存进去的元素可以按照元素的大小自动排序）
6. Map 是一个无序集合，以键值对的方式存放数据，键对象不允许重复，值对象可以重复。
                (1).HashMap实现不同步，线程不安全。  HashTable线程安全
                (2).HashMap中的key-value都是存储在Entry中的。
                (3).HashMap可以存null键和null值，不保证元素的顺序恒久不变，它的底层使用的是数组和链表，通过hashCode()方法和equals方法保证键的唯一性
7. http keep-alive 是为了保持 tpc socket 连接
8. ping是ICMP协议，并不是通常所说的tcp/udp端口；ICMP不像tcp/udp有端口，但它确实含有两个域：类型type和代码code，而这些与端口作用不同。
9. StringBuilder , StringBuffer ,String 都是 final 的
10. XSS跨站脚本攻击，主要是前端层面的，用户在输入层面插入攻击脚本，改变页面的显示。
    XSS是一种网站应用程序的安全漏洞攻击，是代码注入的一种，这类攻击通常包含HTML及用户端脚本语言。
    CSRF跨站请求伪造，以你的名义，发送恶意请求获取相关信息。
    CSRF是一种挟制用户在当前已登录的Web应用程序上执行非本意的操作的攻击方法。
11. 正在执行的进程由于其时间片用完被暂停执行，此时进程应从执行状态变为活动就绪状态
12. 死锁产生的必要条件：
    互斥，不可剥夺；循环等待，请求和保持

#知识点汇总：
### 写 React / Vue 项目时为什么要在列表组件中写 key，其作用是什么？
1. 更准确
  因为带key就不是就地复用了，在sameNode函数 a.key === b.key对比中可以避免就地复用的情况。所以会更加准确。
  
2. 更快
  利用key的唯一性生成map对象来获取对应节点，比遍历方式更快。


###  什么是防抖和节流？有什么区别？如何实现
> 防抖
动作绑定事件，动作发生一段时间之后，触发事件，假如在这段时间内又发生动作，则重新计时
```
function debounce(fn) {
      let timeout = null; // 创建一个标记用来存放定时器的返回值
      return function () {
        clearTimeout(timeout); // 每当用户输入的时候把前一个 setTimeout clear 掉
        timeout = setTimeout(() => { // 然后又创建一个新的 setTimeout, 这样就能保证输入字符后的 interval 间隔内如果还有字符输入的话，就不会执行 fn 函数
          fn.apply(this, arguments);
        }, 500);
      };
    }
    function sayHi() {
      console.log('防抖成功');
    }

    var inp = document.getElementById('inp');
    inp.addEventListener('input', debounce(sayHi)); // 防抖
```
> 节流
动作绑定事件，动作发生一段时间之后，触发事件，假如在这段时间内又发生动作，则无视该动作，直至事件执行完再重新触发
```
function throttle(fn) {
      let canRun = true; // 通过闭包保存一个标记
      return function () {
        if (!canRun) return; // 在函数开头判断标记是否为true，不为true则return
        canRun = false; // 立即设置为false
        setTimeout(() => { // 将外部传入的函数的执行放在setTimeout中
          fn.apply(this, arguments);
          // 最后在setTimeout执行完毕后再把标记设置为true(关键)表示可以执行下一次循环了。当定时器没有执行的时候标记永远是false，在开头被return掉
          canRun = true;
        }, 500);
      };
    }
    function sayHi(e) {
      console.log(e.target.innerWidth, e.target.innerHeight);
    }
    window.addEventListener('resize', throttle(sayHi));
```



























