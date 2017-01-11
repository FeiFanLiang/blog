很多人，包括我，受书本知识消化不彻底的影响，认为 JS 中参数有两种传递方式：数字、字符串等按值传递；数组、对象等按地址（引用）传递。对此种观点，我们要谨慎。

```javascript
var v1 = []
var v2 = {};
var v3 = {};
function foo(v1, v2, v3)
{
    v1 = [1];
    v2 = [2];
    v3 = {a:3}
}

foo(v1, v2, v3);
alert(v1); // 空白
alert(v2); // [object Object]
alert(v3.a); // undefined
```

由此可见：v1、v2、v3 都没有被改变，v1 仍然是零个元素的数组，v2、v3 仍然是空白的对象。

但是，数组、对象等按值传递，是指变量地址的值。

数组、对象等的按值传递与数字、字符串还是有所不同的。**数字、字符串是把值直接复制进去了，而数组、对象是把变量地址复制进去的。**

前面我们让 v1、v2、v3 作为参数进入函数后，就有了地址副本，这些地址副本的指向和外面的 v1、v2、v3 的地址指向是相同的。但我们为 v1、v2、v3 赋了值，也就是说我们把地址副本的指向改变了，指向了新的数组和对象。这样内部的 v1、v2、v3 和外部的 v1、v2、v3 就完全断了。

如果我们不赋新值，而是直接操作它，那么，它操作到的，仍然是和外面的 v1、v2、v3 指向的同一块数组或对象。

```javascript
var v1 = []
var v2 = {};
var v3 = {a:0};
function foo(v1, v2, v3)
{
    v1.push(1);
    v2.a = 2;
    v3.a = 3;
}

foo(v1, v2, v3);
alert(v1); // 1
alert(v2.a); // 2
alert(v3.a); // 3
```

转自：http://www.cftea.com/c/2010/07/TKE282SFVCKL2RLS.asp

这种传地址的方式类似传引用，只不过c++引用在创建时就规定好了，不能更改，这里的地址类似引用，但可以更改。

下面的例子：

```javascript
var c1 = {v:1};
var c2 = c1;
c2.v = 11;
c2 = {v:2};
alert(c1.v); // 显示 11
alert(c2.v); // 显示 2
```

其实这个例子好理解， c2 赋新对象，c1 仍旧是老对象。

这个似乎有点小儿科。

```javascript
function c()
{
    var obj = {v:1};
    obj.func = function()
    {
        obj.v = 2;
    };
    
    return obj;
}

var c1 = c();
c1.func();
alert(c1.v); // 显示 2

var c2 = new c();
c2.func();
alert(c2.v); // 显示 2
```

由于 c 中使用了 return，所以 new 不 new 都一样，这里是直接操作的 obj 的属性，没有赋新对象，所以显示更改后的值 2。

```javascript
function c()
{
    var obj = {v:1};
    obj.func = function()
    {
        obj = {v:2};
    };
    
    return obj;
}

var c1 = c();
c1.func();
alert(c1.v); // 显示 1

var c2 = new c();
c2.func();
alert(c2.v); // 显示 1
```

这里显示 1，是由于为 obj 赋了新对象，而 return 后形成的变量（c1、c2）与 obj 是两个变量，所以 return 后形成的变量仍旧是老对象。

```javascript
function c()
{
    this.obj = {v:1};
    this.func = function()
    {
        this.obj = {v:2};
    };
}

/*
var c1 = c();
c1.func();
alert(c1.obj.v);
*/

var c2 = new c();
c2.func();
alert(c2.obj.v); // 显示 2
这里显示 2，是由于使用了 this。
```

转自：http://www.cftea.com/c/2010/09/5HU6LYB83MXXRL96.asp

### [JavaScript 函数参数传递到底是值传递还是引用传递](http://bestchenwu.iteye.com/blog/1076557)

   在传统的观念里，都认为[JavaScript](http://lib.csdn.net/base/javascript)函数传递的是引用传递(也称之为指针传递)，也有人认为是值传递和引用传递都具备。那么JS的参数传递到底是怎么回事呢？事实上以下的演示也完全可以用于[Java](http://lib.csdn.net/base/javase)

    首先来一个比较简单的，基本类型的传递:

```javascript
function add(num){
   num+=10;
   return num;
}
num=10;
alert(add(num));
aelrt(num);
//输出20,10
```

 对于这里的输出20,10，按照JS的官方解释就是在基本类型参数传递的时候，做了一件复制栈帧的拷贝动作，这样外部声明的变量num和函数参数的num，拥有完全相同的值，但拥有完全不同的参数地址，两者谁都不认识谁，在函数调用返回的时候弹出函数参数num栈帧。所以改变函数参数num，对原有的外部变量没有一点影响。

    再来看一个较复杂的，对象引用类型的传递:

```javascript
function setName(obj){
    obj.name="ted";
}
var obj=new Object();
setName(obj);
alert(obj.name);
//输出ted
```

 以上代码的运行的实质是:创建了一个object对象，将其引用赋给obj(在C里面就直接是一个内存地址的赋值)，然后在传递函数参数的时候，做了一件与前一个方法相同的事情，复制了一个栈帧给函数参数的obj，两者拥有相同的值(不妨将其理解为object对象的地址)，然后在setName做改变的时候，事实上是改变了object对象自身的值(在JAVA里称之为可变类)，在改变完成之后同样也要弹出函数参数obj对应的栈帧。

      所以对应的输出是改变后object对象的值

     那么可能有的朋友可能会问，这样也可以理解为一个引用传递(指针传递)呀？不，这里严格的说，在和JAVA类似的语言中，已经没有了指针，在JAVA里将上述过程称之为一个从符号引用到直接引用的解析过程。在C里面，指针就是一个具有固定长度的类型(在大多数的C编译器里是2个字节)，但在JAVA类似的语言里，引用也有自己的属性和方法，只是你不能直接去访问和控制它，所以它从某种意义上也是一种对象，这种机制也很大程度的避免了内存泄露，术语称之为内存结构化访问机制。

    为了证明上述观点，稍微改造下上述例子:

```javascript
function setName(obj){
    obj.name="ted";
    obj=new Object();
    obj.name="marry";
}
var obj=new Object();
setName(obj);
alert(obj.name);
//输出ted
```

 这个例子与上一个例子的唯一不同是这里将一个新的对象赋给了函数参数obj，这样函数参数obj和原有的引用obj参数，有着完全不同的值和内存地址。

    值的一提的是，在[Python](http://lib.csdn.net/base/python)中就没有这样的争论，因为Python里面一切都是对象，只是对象可以按照存储类型(容器类型还是标量模型) 、更新类型(是否可变)、访问模型(直接访问、序列访问、映射访问)来划分，访问模型是最多被讨论的，也是最清晰的区分方式。所以毫无疑问，在Python里面，函数传递方式只有一种---引用对象传递

\-------------

# JavaScript函数参数，传值还是传址？

首先，十万以及万分肯定的说一句， JavaScript 函数传递参数时，是值传递。虽然您可能不信，因为 ECMAScript 变量可能包含两种不同数据类型的值：基本数据类型，和引用数据类型。难道引用数据类型传递的时候难道也是值传递吗？答，没错。

 

**引用类型的值是什么东西？**

> 当一个变量向另一个变量复制引用类型的值时，会将存储在栈中的值（栈中存放的值是对应堆中的引用地址）复制一份到为新变量分配的空间中。
>
> 不同的是，这个值的副本其实是一个指针，而这个指针指向存储在堆中的一个对象。复制操作结束后，两个变量实际上引用同一个对象。

> ```javascript
> var user = new Object();
> var admin = user;
> admin.name = "xiaoxiaozi";
> alert(user.name); //返回 xiaoxiaozi
> ```

该过程其实是这样的（引用型变量的复制）：

 

所以说，**引用类型的值实际上是对其引用对象的一个指针。**

------

**函数参数的传递**

基本类型我们不做讨论，那玩意除了值还真没别的。咱们继续来说引用类型。请看下面示例：

> ```javascript
> function setName(obj){
>     obj.name = "xiaoxiaozi";
> }
> var person = new Object();
> setName(person);
> alert(person.name); // 返回 xiaoxiaozi
> ```

在向参数传递引用类型值时，会把这个值在内存中的地址复制给一个局部变量，因此这个局部变量的变化会反映在函数的外部。

> ECMAScript 中，所有函数的参数都是按值来传递的。基本类型值的传递和基本类型变量复制一致（采用在栈内新建值），引用类型值的传递和引用类型变量的复制一致（栈内存放的是指针，指向堆中同一对象）

因此在调用函数setName()时，person 被复制给了 obj ，因此在函数内部 obj 与 person 引用的是同一个对象，或者说是对同一个对象的引用。所以在给 obj 引用对象加上 name 属性时，person 引用的对象也有了 name 属性，因为虽然 obj 与 person 不同，但是二者引用的对象是同一个。

但是，千万不要认为，在局部作用域中修改的对象会在全局作用域中反映出来就说参数是按引用传递的。为了证明是值传递，让我们再来看如下例子：

> ```javascript
> function setName(obj){
>     obj.name = "xiaoxiaozi";
>     obj = new Object();
>     obj.name = "admin";
> }
> var person = new Object();
> setName(person);
> alert(person.name); // 结果依旧是 xiaoxiaozi
> ```

在调用 setName() 函数初时，obj 与 person 引用的是同一对象，所以首次的 name 属性赋值会对 person 有所影响。但是当 obj 被重新定义时，其引用的对象已经与 person 不同，所以后面设置的 name 属性，不会对 person 引用的对象有任何影响。

感觉上面的这个例子非常好，大家可以仔细体会一下，我也是看到了这个例子才决定从文中《javascript高级程序设计》摘抄(貌似没有摘，就是抄)的。

转自：http://blog.csdn.net/yy20071313/article/details/41721309