# 常见CSS问题

## css选择器优先级

1. <head><style>♦️</style></head>
2. <head><style>@import '/.css♦️'</style></head>
3. <head><link href=".css♦️"></link></head>>
4. <head><link href=".css♦️ > @import'/.css'"></link></head>>

### 选择器权重:
 o !important --------->   无穷
 o  行间样式------------->   1000
 o id------------------>   100
 o  class|属性|伪类------>   10
 o  标签|伪元素 --------->    1
 o  通配符--------------->   0

## link 和 @import 区别
> 两者都是为了加载css文件

1. link是在加载页面前css加载完毕   @import 先读取文件再加载
2. @import ie5以上不支持
3. js控制dom改变样式只能用link @import dom操作不了

## position种类 
1. absolute 决定定位 脱离文档流 相对于自身最近的父级进行定位
2. relative 保持原来的位置,参照自身进行定位
3. static 默认属性
4. sticky css3 新属性 类似relative 和 fixed 的合体 在目标区域内像前者 当页面滚动超出目标区域 其表现像后者
5. fixed 对可视窗口进行定位

## position设置为absolute 该元素会发生什么?

> 其和float一样都会默认改变为display:inline-block

##  如何去除浮动
> 清除浮动的原因,浮动元素不会脱离文字流(display:inline/inline-block),但是会脱离文档流
    border 不能被撑开 背景不能显示 margin设置值不能正确显示
    
    1. 底下添加新的元素 设置 clear:both
    2. 父级属性 overflow:hidden
    3. 添加一个 ::after{content:'';clear:both;display:block}

##  说说触发bfc几种方式

1. 设置float:left/right;
2. 设置overflow:hidden/auto/scroll
3. 设置display:inline-block/flex/table-cell
4. 设置position:absolute/fixed

## 常见的讲元素垂直水平居中的方式
1. 知道父级大小:
{ left:50%;right:50%;margin-left:-一半 margin-right:-一半}
2. 不知道宽高 
{ left:50%;right:50%;  transfrom:translateX(50%) translateY(50%)}
3. flex justify0content:center aligin-items:center
4. left:0 right:0 top:0 bottom:0 margin:auto

## 关于伪元素 你了解多少 伪类呢

伪元素相当于添加一个元素
伪类相当于在一个元素上添加样式,伪类没有数量上的限制
这两个都不实际存在于dom中
伪元素: before after frist-line frist-letter last-letter
伪类:hover frist-child last-child link active



+ 在 JAVASCRIPT 中，能形成作用域的有如下几点。 
        o 函数的调用
        o with语句
                ▪ with会创建自已的作用域，因此会增加其中执行代码的作用域的长度。
        o 全局作用域
        o 块级作用域(ES6中提出的)

## 作用域链

### 运行期上下文
>执行函数时会创建一个称为“运行期上下文(execution context)”的内部对象，运行期上下文定义了函数执行时的环境。每个运行期上下文都有自己的作用域链，用于标识符解析,当运行期上下文被创建时，而它的作用域链初始化为当前运行函数的[[Scope]]所 包含的对象。

>一般情况下，在运行期上下文运行的过程中，其作用域链只会被 with 语句和 catch 语句影响。

1.  with
+ 当代码运行到 with 语句时，运行期上下文的作用域链临时被改变了。一个新的可变对象 被创建，它包含了参数指定的对象的所有属性。这个对象将被推入作用域链的头部，这意 味着函数的所有局部变量现在处于第二个作用域链对象中，因此访问代价更高了。

2. catch
+ 当 try 代码块中发生错误 时，执行过程会跳转到 catch 语句，然后把异常对象推入一个可变对象并置于作用域的头 部。在 catch 代码块内部，函数的所有局部变量将会被放在第二个作用域链对象中。
``
try{
    doSomething();
}catch(ex){
    alert(ex.message); //作用域链在此处改变
}
``
+ 一旦 catch 语句执行完毕，作用域链机会返回到之前的状态。try-catch 语句在 代码调试和异常处理中非常有用，因此不建议完全避免。可以通过优化代码来减少 catch 语句对性能的影响。一个很好的模式是将错误委托给一个函数处理.
``
try{
    doSomething();
}catch(ex){
    handleError(ex); //委托给处理器方法
}
``

+ 优化后的代码，handleError 方法是 catch 子句中唯一执行的代码。该函数接收异常对象 作为参数，就可以更加灵活和统一的处理错误。由于只执行一条语句，且没有局部变 量的访问，作用域链的临时改变就不会影响代码性能了


### 为什么不建议使用 with?
1. 影响性能:
with 欺骗了词法,JavaScript引擎在编译阶段有些性能优化是依赖于能够根据代码的词法进行静态分析，并预先确定所有变量和函数的定义位置，才能在执行过程中快速的找到标识符。但如果引擎在代码中发现了 with，它只能简单地假设关于标识符位置,无法让引擎做到真正的优化,因此会降低了性能.

2. 减低代码的安全性:
with 它会在你不知的情况下把一些内部作用域声明的函数或者变量泄露到其他作用域.
3. 代码更加难于阅读

