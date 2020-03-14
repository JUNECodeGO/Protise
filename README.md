## ！！！这段时间比较忙，后面我会出个合集的～

### 浏览器渲染

+ 浏览器内核分为：
+ 渲染引擎
+ JS引擎
+ 浏览器线程：
+ GUI渲染线程 //主要负责 页面渲染
+ JS引擎线程 // 处理js事件

>两者互斥，因此尽量把script放在底部或者给script标签加上defer或者async属性
>还有定时器线程、事件处理线程、异步http线程

### defer与async

+ 没有async和defer
遇到script 会直接进行加载并且执行

+ 有defer
script会异步加载（与html解析同时进行）最后等到全部结束之后再执行defer-script。继而再触发DOMContentLoaded事件

+ 有async
与defer的区别是async-script加载完之后就会执行，此时html解析会停止，待执行完之后再继续。并且一定再load触发之前执行，但有可能在DOMContentLoad之前或之后触发

+ 如果先引入了JS CSSOM也会受到阻塞，因为js想改CSSOM，就要等CSSOM加载完再加载JS，最后再加载DOM
一开始CSSOM和DOM的构建互不影响

### 重绘 回流（重排）

+ 重绘 不改变其几何属性：颜色，背景色
+ 回流（重排） 修改其几何尺寸：修改元素的宽或高

### 如何减少回流和重绘
1. 使用transform替代top
2. 使用visibility替代display：none
3. 不要把节点属性放在循坏里面 such as:offsetTop
4. 不要使用table布局

___

## 浏览器存储

### cookie
> cookie本职不是用来存储数据而是用来维持状态，因为HTTP协议是无状态的，起自身不对请求和响应之间的通信状态进行保存。
可以理解cookie是浏览器上的小小文件夹，它依附再http请求上 在服务器和浏览器之间飞来飞去

#### cookie是服务端生成，客户端进行维护和存储

典型应用场景：
+ 记住密码，下次自动登陆
+ 购物车
+ 记录用户浏览数据，进行商品推荐（广告）

cookie生成方式：
+ 浏览器第一次请求，服务器响应头中——http response header set-cookie（默认情况下domain设置为cookie页面的主机名，我们也可以手动设置domain的值）
+ js中通过document.cookie读写cookie（doomain标识指定了哪些域名可以接受cookie，假如没有设置domian，就自动绑定到执行语句的当前域）

#### cookie的缺陷
+ cookie不够大 4kb左右
+ 过多的cookie会带来巨大的性能消耗
cookie紧跟着域名，同一个域名下的请求都会携带cookie，假如请求一张图片就带着cookie而且cookie内容又不需要，这样就劳民伤财了
+ HTTP请求下存在安全性问题

#### cookie与安全
| 属性 | 作用 |
| ------------- |:-------------:|
| value | 对值进行加密 |
| http-only | 不能通过JS访问Cookie，减少XSS攻击 |
| secure | 只能在https协议中的请求中携带 |
| same-site | 规定浏览器不能再跨域中携带cookie，减少csrf攻击 |

### web Storage
> 由html5新增 分为sessionStorage 和 localStorage

### LocalStorage

+ 存储的数据长期存在
+ 大小为5M左右
+ 仅在客户款使用，不和服务端进行通信
> 因此LocalStorage可以作为浏览器本地缓存方案，用来提升网页首屏渲染数据

###### 存入/读取数据

```
if（window.localStorage){
    localStorage.setItem('name','world')
}
var name = loacalStorage.getItem('name')
```

##### 使用场景
> 利用其持久的特点，用来存储一些稳定的资源，例如Base64格式图片字符串

### sessionStorage
+ 即使是相同域名下的两个页面，只要他们不在同一个浏览器窗口打开，那么他们的sessionStorage不可以进行共享
+ localStorage在所有同源的窗口中都是共享的，cookie也是。
> 同于保存浏览器的一次会话数据，会话结束（浏览器关闭），数据清空。

+ 会话级别的浏览器存储
+ 大小为5M左右
+ 仅在客户款使用，不和服务端进行通信
> sessionStorage可以有效对表单信息进行维护，比如刷新时，表单信息不丢失；用来存储生命周期和它同步的会话级别信息，例如微博

### IndexedDB
> IndexedDB是一种低级API，用于客户端存储大量结构化数据，是一个运行在浏览器上的非关系型数据库

+ 依旧是键值对的形式存在，但是任何数据类型都可存
+ 其为异步，用户依然可以进行其他操作，localStorage 是同步操作
+ 同源限制，每个数据库都有对应的域名，不能跨域访问其他域
+ 一般不少于250m，甚至没有上线
+ 支持事物，在一系列操作中，只要有一步失败，整个事务就会失败，返回最初的状态

##### 常见操作

+ 建立发开IndexedDB
`window.indexedDB.opnen("testDB")`

___

### 浏览器缓存机制
##### 缓存位置
+ Service Work
+ Memory Cache
+ Disk Cache
+ Push Cache

1. Service Worker
> 它是运行在浏览器背后的独立线程，使用Service Worker的话，传输协议必须为HTTPS。因为Service Worker中涉及请求拦截，所以必须使用HTTPS协议来保障安全。

# 实现缓存分为三个步骤：
+ 注册Service Worker 
+ 监听 install 事件，实现缓存文件
+ 下次用户访问的时候可以通过拦截请求的方式查询是否存在缓存

> 特点Service Worker 的缓存与浏览器其他内建缓存机制不同，它可以让我们自由控制缓存那些文件，如何匹配缓存，如何读取缓存，并且缓存是持续性的

2. Memory Cache
> 内存中的缓存，主要是包含当前页面中已经抓取的资源，但其持续性很短。会随着进程的释放而释放。
+ 即使内存缓存搞笑，但是其内存容量比硬盘小得多
+ 内存缓存中有一块缓存资源是由preloader指令下载来的。因为其可以一边解析js/css文件，一边网络请求下一个资源

3. Disk Cache
> 硬盘中的缓存，是浏览器缓存中，覆盖面最大。他会根据HTTP Header来判断资源的需求

4. Push Cache
> 推送缓存，只有在上面三种缓存都没有命中时，才会被使用。并且其只在session中存在。缓存时间短暂，一旦结束会话就被释放。

##### 缓存策略
> 一般通过HTTP Header设置
+ 强缓存
+ 协商缓存

#### 强缓存
> 不会向服务器发送请求，直接从缓存中读取资源。并不关心服务器文件是否已经更新，可以通过设置两种HTTP Header实现： Expires 和Cache_Control

1. Expires
##### 缓存过期时间，用来指定资源到期的时间，是服务端的具体时间点。Expires = max-age + 请求时间
##### 它是HTTP/1的产物受限于本地时间，如果修改了本地时间，可能会造成缓存失败。

2. Cache—Control
> 它是一个规则，主要用于控制网页缓存，可以在请求头或响应头中设置：

| 指令 | 作用 |
| ------------- |:-------------:|
| public | 表示相应可以被客户端和代理服务器缓存 |
| private | 标识响应只可以被客户端缓存 |
| max-age = 30 | 缓存30秒过期，需要重新请求 |
| s-maxage = 30 | 覆盖上一个，作用一样，只在代理服务器中生效 |
| no-store | 不缓存任何响应 |
| no -cache | 资源被缓存，但是立即失效，在浏览器使用前，先确认一下数据是否还跟服务器保持一致|
| max-stale = 30 | 30s内即使缓存过期也使用该缓存 |
| min-fresh = 30 | 希望在30秒内获取最新响应 |

#### 协商缓存
> 协商缓存就是强制缓存失效后，浏览器携带缓存标识向服务器发起请求，由服务器根据缓存标识决定是否使用缓存的过程

1. Last-Modified
根据时间判断资源判断是否更新，缺陷按秒进行保持
2. Modified-Since
根据资源内容判断是否更新，性能会比1低一些，但是优先级高些

#### 缓存机制
1. 判断是否缓存
2. 是
3. 判断是否过期
4. 是
5. 协商缓存，问服务器资源是否更新
6. 是的话换回新的资源+200 否的话 返回304 继续使用缓存

######## 缓存过程分析
浏览器            浏览器缓存          服务器

—>第一次发起HTTP请求—

—没有该请求的结果及标识<—

————————————————————>发起http请求—

—请求的结果及请求标识<————————————————

->将该请求结果及标识存入浏览器缓存中

##### HTTP协议——超文本传输协议
> 基于TCP/IP协议通信来传输，不涉及数据包传输，主要规定客户端和服务器之间的通信格式

######### HTTP特点
1. 简单快速
2. 灵活，HTTP允许传输任意类型的数据对象
3. 无连接，每次连接，只处理一个请求
4. 无状态 每个请求都是独立的

######### HTTP报文
1.请求行 说明请求类型 要访问的资源 以及http版本
post /chapter17/user.html HTTP/1.1

2. 请求头由键值对组成，每行一对，关键词和值用英文冒号分隔

3. 最后一个请求头之后是一个空行，这个行非常重要，它表示请求头已经结束，接下来的是请求正文。

4. 请求体，可以承载多个请求参数的数据

GET/POST 区别
1. get再url传输中参数长度有要求，post没有
2. post需要包裹在request body中
3. url的请求参数被保存在浏览器中，而浏览器不会
4. get会被浏览器主动缓存

##### 持续连接
> 每次的请求都会造成无谓的 TCP 连接建立和断开，增加通信量的 开销。

持久连接特点
为解决上述 TCP 连接的问题，HTTP/1.1 和一部分的 HTTP/1.0 想出了持久连接（HTTP Persistent Connections，也称为 HTTP keep-alive 或 HTTP connection reuse）的方法。
持久连接的特点是，只要任意一端没有明确提出断开连接，则保持TCP连接状态

##### 什么是HTTPS
> HTTPS是在HTTP上建立SSL加密层，并对传输数据进行加密，是HTTP协议的安全版。

作用：
1. 对数据进行加密，并建立一个信息安全通道，来保证传输过程中的数据安全
2. 对网站服务器进行真实身份认证

##### http存在的问题
1. 通信使用明文（不加密），内容可能被窃听
2. 无法证明报文的完整性，所以可能被篡改
3. 不验证通信方的身份，因此有可能遭遇伪装，HTTP协议无法验证通信方身份，任何人都可以伪造虚假服务器欺骗用户

##### HTTPS优势
1. 数据隐私性： 内容经过对称加密，每个连接生成一个唯一的加密密钥
2. 数据完整性： 内容传输经过完整性校验
3. 身份认证： 第三方无法伪造服务器身份

##### HTTPS与HTTP 区别

1. HTTPS比HTTP更加安全，对搜索引擎更友好，利于SEO,谷歌、百度优先索引HTTPS网页;
2. HTTPS需要用到SSL证书，而HTTP不用;
3. HTTPS标准端口443，HTTP标准端口80;
4. HTTPS基于传输层，HTTP基于应用层;
5. HTTPS在浏览器显示绿色安全锁，HTTP没有显示;

> 在采用SSL后，HTTP就拥有了HTTPS的加密、证书和完整性保护这些功能。
也就是说HTTP加上加密处理和认证以及完整性保护后即是HTTPS。

## TLS/SSL 协议基于三类基本算法：
+ 散列函数 MD5 SHA
+ 对称加密 AES DES RC4
+ 非对称加密 RSA ECC DH

从输入URL开始到页面展示的过程
1. DNS开始解析 将域名解析成IP地址
2. TCP链接 三次握手
3. HTTP发送请求
4. 服务器处理请求并返回报文
5. 浏览器接受数据开始渲染页面
6. 断开连接 TCP四次挥手

---

#### 数据结构
> 研究数据的逻辑结构和物理结构的相互关系

##### 数据类型：
 > 整型、浮点型、字符型等
##### 逻辑结构
+ 集合 结构中数据元素同属于一种类型
+ 线性结构 数据元素一对一
+ 树形结构 数据元素一对多
+ 网状结构或图状结构 数据元素之间存在多对多的关系
##### 物理结构/存储结构
> 描述数据具体在内存中的存储，如顺序结构、链式结构、索引结构和哈希结构

### 数据结构
1. 数组 
> 数组是可以在内存中连续存储多个元素的结构，数组中的元素通过数组下标进行访问
> 使用场景： 频繁查询，对存储空间要求不大，很少增加和删除的情况
###### 数组特点：
+ 查询方便 时间复杂度O(1) 内存中占用了连续空间
+ 进行添加删除是 时间复杂度变成O(n)
+ 数组从栈中分配空间，链表从堆中

2. 栈 
> 栈是一种特殊的线性表，仅能在线性表的一端操作，栈顶允许操作。栈的特点是先进后出
3. 队列
> 队列也是一种线性表，可以在一段添加元素，另一端取出元素，也就是先进先出

such as: 进 A <-- B <-- C 出 A <-- B <-- C

> 使用场景: 因为队列先进先出的特点，在多线程阻塞队列管理中非常适用。

4. 链表
> 链表是物理存储单元上非连续的、非顺序的存储结构，数据元素的逻辑顺序是通过链表的指针地址实现，每个元素包含两个结点，
一个是存储元素的数据域 (内存空间)，另一个是指向下一个结点地址的指针域。根据指针的指向，链表能形成不同的结构，
例如单链表，双向链表，循环链表等。 

> 使用场景: 因为链表占用空间大，查找元素需要遍历链表链，非常耗时，所用适用一些数据量较少的场景。

###### 链表特点：
+ 定位元素 时间复杂度O(n)
+ 进行添加删除是 时间复杂度变成O(1)，不必挪动元素
+ 链表中在内存中不是连续存储
+ 不支持随机，地址不持续

5. 树
> 树是一种树形结构，它是由n(n>=1)个有限节点组成一个具有层次关系的集合，它有以下特点：
+ 每个节点多令或多个子节点
+ 没有父节点的节点称为根节点
+ 每个分根节点只有一个父节点

——、二叉树
> 二叉树是一种特殊的树：
+ 每个结点最多只有两颗字树，结点的度最大为2
+ 左子树和右字数是由顺序，次序不能颠倒
+ 即使某结点只有一个子树，也要区分左右子树

使用场景： 二叉树既有链表的好处，又有数组的好处，是两者的优化方案，在处理大批量的动态数据非常有用。扩展：平衡二叉树、红黑树、B+树、字典树等

+ 二叉查找树（二叉搜索树）如果左边不为空，则左边的所有结点均小于它的根结点，如果有边不为空则右边的所有结点都大于它的根结点
+ 平衡二叉树（AVL树） 左右两边的树高度差不能大于1
+ 红黑树 非常复杂，它不同于普通二叉查找树是自底向上

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
(ki <= k2i,ki <= k2i+1)或者(ki >= k2i,ki >= k2i+1), (i = 1,2,3,4…n/2)，满足前者的表达式的成为小顶堆，满足后者表达式的为大顶堆，这两者的结构图可以用完全二叉树排列出来

___

### 排序算法
1. 冒泡排序
> 每次在查找范围内通过相邻元素两两比较交换，将这个范围内最大的一个元素通过多次交换直到将元素移到该范围的最后一个位置。 即每次循环后将第n大的数放在第n个位置。 所以内层循环是从 0 到 n - i, 因为内层循环每次只需要找 第(n - i)大的数， 内层循环每次从右边减少一个。
```
for(var i = 0; i < arr.length - 1; i++){
    for(var j = 0, stop = arr.length -1 -i; j < stop ; j++){
        var v = 0
        if(arr[j] > arr[j+1]){
        v = arr[j]
        arr[j] = arr[j+1]
        arr[j+1] = v
        }
   }
}
```
2. 选择排序
> 思想每次把最小的一个元素选择出来，放到对应的位置。 例： 第1轮从第0个元素开始遍历，一直遍历到数组结尾，找出最小的元素的索引值，然后与第0个位置上的元素交换。 第2轮从第1个元素开始遍历，一直遍历到数组结尾，找出最小的元素的索引值，然后与第1个位置上的元素交换。 ... 第n轮从第n-1个元素开始遍历，一直遍历到数组结尾，找出最小的元素的索引值，然后与第n-1个位置上的元素交换。
```
 var min
        for(var i = 0; i < arr.length; i++){
           min = i
            for(var j = i+1; j < arr.length ; j++){
                if(arr[j] < arr[min]){
                    min = j
                }
            }
            if(i !== min){
                var a = arr[min]
                arr[min] = arr[i]
                arr[i] = a
            }
        }
```
3. 插入排序
> 思想
第 0 个元素不遍历； 第 1 个元素与它前面的第 0 个元素比较，如果它比前面元素大，那么交换这两个元素； 第 2 个元素与它前面的第 1 个元素比较，如果它比前面元素大，那么交换这两个元素，再接着与第 0 个元素进行比较 ... 第 n 个元素依次与他前面的元素进行比较，直到它前面的元素比他小就 break;
```
   var value;
        for (var i = 0; i < arr.length ;i++){
            value = arr[i]
            for( var j = i-1;j >-1 && arr[j] > value;j--){
                arr[j+1] = arr[j]
            }
            arr[j+1] = value
        }
        console.log(arr)
```

4.合并排序
> 思想
先将数不断的二分，一个长度为 N 的数组在 log N 次二分后每一个部分就只剩下一个元素了，然后逐层向上归并。向上归并时，每次将挨着的两个部分合为一个部分，合的过程是将两个有序数组合并
```
function result(arr) {
        if(arr.length < 2){
            return arr
        }
        var illen = Math.floor(arr.length/2)
        var left = arr.splice(0,illen)
        var right = arr
        // console.log(left,right)
        var params = merge(result(left),result(right))
        params.unshift(0,arr.length)
        arr.splice.apply(arr,params)//将原来的arr数组替换成排序后的数组
        return arr
    }
    function merge(left,right){
        var result= []
        var ir = 0;
        var il = 0
        while(ir < right.length && il < left.length){
            if(left[il] < right[ir]){
                result.push(left[il++])
            }else{
                result.push(right[ir++])
            }
        }
        return result.concat(left.splice(il)).concat(right.splice(ir))
    }
```
5.快速排序
>思想
在数据集之中，选择一个元素作为”基准”（pivot）,所有小于”基准”的元素，都移到”基准”的左边；所有大于”基准”的元素，都移到”基准”的右边,对”基准”左边和右边的两个子集，不断重复第一步和第二步，直到所有子集只剩下一个元素为止。
```
 function result(arr) {
        if(arr.length <= 1){
            return arr
        }
        var index = Math.floor(arr.length/2)
        var pivot = arr.splice(index,1)[0]
        var left = []
        var right = []
        for(var i = 0; i< arr.length; i++){
            if(arr[i] <pivot){
                left.push(arr[i])
            }else{
                right.push(arr[i])
            }
        }
        return result(left).concat([pivot],result(right))
    }
```

6.希尔排序
> 思想
希尔排序也成为“缩小增量排序”，其基本原理是，现将待排序的数组元素分成多个子序列，使得每个子序列的元素个数相对较少，然后对各个子序列分别进行直接插入排序，待整个待排序列“基本有序”后，最后在对所有元素进行一次直接插入排序。因此，我们要采用跳跃分割的策略：将相距某个“增量”的记录组成一个子序列，这样才能保证在子序列内分别进行直接插入排序后得到的结果是基本有序而不是局部有序。希尔排序是对直接插入排序算法的优化和升级
```
unction result(arr) {
        var len = arr.length,
            temp,
            gap = 1;
        while(gap < len/3 ){
            gap  =  gap*3+1
        }
        for(gap;gap>0;gap = Math.floor(gap/3)){
            for(var k = gap;k<arr.length;k++){
                temp = arr[k];
                for(var j = k-gap;j >= 0&&arr[j]>temp;j-=gap){
                    arr[j+gap] = arr[j]
                }
                arr[j+gap] = temp
            }
        }
        return arr
```

**工作中的小问题**

1. 如何上传文件
> 用input提交，input displaynone 作为点击按钮的兄弟 点击按钮触发input的onchange事件
```
 handleAdd(event) {
      const { target } = event
      target.nextElementSibling && target.nextElementSibling.click() // 出发他的下一个兄弟元素的点击事件
    },
    handleFileChange(ev) {
      const files = ev.target.files //   <input type="file" accept=".xlsx" name="file" class="form-item__upload" @change="handleFileChange($event)">
      // 拿到文件对象
      const flag = true

      if (flag) {
        this.$confirm('确定上传该文件吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          importPatrolVehicleBase({ file: files[0] }).then(res => {
            this.$notify({ // 传给后台
              title: '成功',
              message: res.msg,
              type: 'success',
              duration: 1500
            })
            this.getList()
          }, err => {
            ev.target.value = ''
            console.log(err)
          })
        }).catch(() => {
          ev.target.value = ''
        })
      } else {
        this.$message.error('所选文件类型不符合')
      }
    },
```
2. 后台接口传文件如何下载文件
```
 axios({
        method: 'get',
        url: str,
        responseType: 'arraybuffer'
        // 假如excel 乱码 可以加个responseTYpe
      }).then(function(response) {
        const blob = new Blob([response.data], { type: 'application/vnd.ms-excel' }) // 创建一个blob对象
        const url = URL.createObjectURL(blob) 将blob对象转成一个链接
        const link = document.createElement('a') 创造一个a 标签
        link.setAttribute('href', url)
        link.setAttribute('download', response.headers['content-disposition'].match(regs)[0])
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click() 点击下载
        document.body.removeChild(link)
      })
```
4. froala富文本 上传本地图片 链接 转为Base64格式传给后台
```
function handleChange() {
// 拿到富文本中的html字符串
      var tempStr = this.$refs.froalaEditor.getHtml()
      // 正则获取 <img>中的 src=""
      var reg = /src=[\"\']([^\"\' ]+)/g
      if (reg.test(tempStr)) {
        var self = this
        var n = 0
        const temp = tempStr.match(reg)
        // async 函数返回的是promise
        var a = async function() {
          for (var i = 0; i < temp.length; i++) {
          // 将n张已经base64的图片 存入数组
          // await 等待baseImg异步执行完
            temp[i] = await self.baseImg(temp[i].replace('src="', '')
          }
        }
        // 拿到所有转换后的图片之后替换原来图片链接
        a().then(function() {
          tempStr = tempStr.replace(reg, 'src="' + temp[n++])
          // 此处注意 在请求的过程中浏览器不会替换+等特殊的符号为空串拿给后台，因此后台返回的base64是不可以正常渲染的
          // 此处包括table的html都是会被后台报错 因此传递富文本字符串最好都全部进行encodeURIComponent（）
          self.listQueryEditor.platDesc = encodeURIComponent(tempStr)
          self.handleSaveEditor()
        })
      } else {
        this.listQueryEditor.platDesc = encodeURIComponent(tempStr)
        this.handleSaveEditor()
      }
    },
// img 图片链接
function baseImg(img) {
   var image = new Image()
   image.src = img
   image.setAttribute('crossOrigin', 'Anonymous')
   var getBase64Image = function(image) {
     var canvas = document.createElement('canvas')
     canvas.width = image.width
     canvas.height = image.height
     var ctx = canvas.getContext('2d')
     ctx.drawImage(image, 0, 0, image.width, image.height)
     var ext = image.src.substring(image.src.lastIndexOf('.') + 1).toLowerCase()
     var dataUrl = canvas.toDataURL('image/' + ext)
     return dataUrl
   }
   return new Promise(function(resolve) {
   // 此处因为image.onload为异步，所以要有promise，否则外部拿不到dataUrl，因为onload还未完成
     image.onload = function() {
       resolve(getBase64Image(image))
     }
   })
 }
 ```
2.初始化组件失败
情况：由于组件还未加载完成，率先调用组件的method方法，后台报错 function undefined
解决：
A:
```
  var self = this
        setTimeout(function() {
          self.$refs.froalaEditors.setHtml(str)
        }, 1)
```
B:
```
 this.$nextTick(() => {
  this.$refs.froalaEditor1.setHtml(str)
 })
```

3.element-UI中的cascader组件 中的方法调用失败
情况： 由于在for循环中调用了cascader组件，因此$refs并不是唯一
解决：
```
this.$refs['myCascader'][index].getCheckedNodes()[0]
```


        













