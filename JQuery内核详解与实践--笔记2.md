#jQuery内核详解与实践--笔记2

## noConflict使用方法

在jQuery中，$是jQuery的别名，所有使用$的地方都可以使用jQuery来替换，如$('#msg')等同与jQuery('#msg')的写法。然而，当我们引入多个js库后，在另一个js库中也定义了$符合的话，那么我们在使用$符号时就发生冲突。下面以引入两个库文件jQuery.js和prototype.js为例进行说明:

**第一种情况：jQuery.js在prototype.js之后进行引入，如**
```javascript
	<script src="prototype.js" type="text/javascript"></script>	
	<script src="jquery.js" type="text/javascript"></script>
```
在这种情况下，我们在自己的js代码中如下写的话:
```javascript
	$('#msg').hide()
```
$永远代码的是jquery中定义的$符合，也可以写成jQuery('#msg').hide();如果想要使用prototype.js中定义的$，我们在后面再介绍。

**第二种情况：jquery.js在prototype.js之前进行引入，如**
```javascript
	<script src="jquery.js" type="text/javascript"></script>
	<script src="prototype.js" type="text/javascript"></script>
```
在这种情况下，我们在自己的js代码中如下写的话：
```javascript
	$('#msg').hide()
```
$此时代表的prototype.js中定义的$符合，如果我们想要调用jquery.js中的工厂选择函数功能的话，只能用全称写法jQuery('#mgs').hide()

下面先介绍在第一种引入js库文件顺序的情况下，如果正确的使用不同的js库中定义的$符号

**一、使用JQuery.noConflict()**
该方法的作用就是让jQuery放弃对$的所用权，将$的控制器交还给prototype.js，因为jquery.js是后引入的，所有最后拥有$控制权是jquery。它的返回值是jQuery，当在代码中调用了该方法后，我们就不可以使用$来电泳jquery的方法了，此时$就代表在prototype.js库中定义的$了。如下：
```javascript
	JQuery.noConflict();
	//此处不可以再写成$('#msg').hide() 此时的$代表prototype.js中定义的符号
	JQuery('#msg').hide();
```
自此以后$就代表prototype.js中定义的$，jquery.js中的$无法再使用，只能使用jquery.js中$的全称JQuery了。

**二、自定义JQuery的别名**
如果觉得第一种方法中使用了JQuery.noConflict()方法以后，只能使用JQuery全称比较麻烦的话，我们还可以为JQuery重定义别人。如下：
```javascript
	var $j = JQuery.noConflict();
	$j('#msg').hide();//此处$j就代表JQuery
```
自此以后$就代表prototype.js中定义的$,jquery.js中的$无法再使用，只能使用$j来作为jquery.js中JQuery的别名了。

**三、使用语句块，在语句块中仍然使用jquery.js中定义的$,如下**
```javascript
	JQuery.noConflict();
	JQuery(document).ready(function($){
		$('#msg').hide();//此时在整个ready时间的方法中使用的$都是jquery.js中定义的$
	})
```
或者使用如下语句块
```javascript
	(function($){
		....
		$('#msg').hide();//此时在这个语句块中使用的都是jquery.js中定义的$
	})(JQuery)
```
如果在第二种引入js库文件顺序的情况下，如果使用jquery.js中的$，我们还是可以使用上面介绍语句块的方法，如：
```javascript
	<script src="jquery.js" type="type/javascript"></script>
	<script src="prototype.js" type="text/javascript"></script>
	
	(function($){
		...
		$('#mgs').hide();//此时在这个语句块中使用的都是jquery.js中定义的$
	})(JQuery)
``` 

## jQuery工具方法

1. error 抛出错误信息
2. isFunction 判断参数是不是函数,实质是报装了jQuery.type方法
3. isArray 判断参数是不是数组，也是报装了一些type方法
4. isWindow 判断参数是不是窗口
```javascript
	isWindow : function(obj){
		return obj != null && obj == obj.window; //这里可以有一种情况是window == window.window window自身引用自己
	}
```
5. isNumeric 判断参数是不是数字
6. isEmptyObject 判断参数是不是空对象
7. isPlainObject 判断参数是不是new Object()或{}的纯粹对象
```javascript
	isPlainObject: function( obj ) {
		var key;

		//判断是不是一个对象
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			//Object原型是没有
			if ( obj.constructor &&

				!hasOwn.call(obj, "constructor") &&
				//只有Object原型才有isPrototypeOf属性
				!hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Support: IE<9
		// Handle iteration over inherited properties before own properties.
		if ( support.ownLast ) {
			for ( key in obj ) {
				return hasOwn.call( obj, key );
			}
		}

		//in不会遍历原型上的属性，如果undefined就证明obj没有自己的属性
		//判断属性是不是非继承属性，如果是则证明他没继承
		for ( key in obj ) {}

		return key === undefined || hasOwn.call( obj, key );
	},
```
8. type 判断对象的类型
9. camelCase 返回驼峰命名
10. nodeName 返回节点名字
11. each jQuery封装的遍历方法
```javascript
	//传三个参数的情况
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			//判断是不是数组，数组就用for遍历
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				//判断是不是对象，数组就用for in遍历
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},
```
12. trim 去除空格
13. makeArray 将参数转换成数组
14. inArray 查看是不是在数组里面
15. merge 合并两个数组
16. grep 过滤数组的
```javascript
	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [], //用来装返回值
			i = 0,
			length = elems.length,
			callbackExpect = !invert;//invert传进来的是一个boolean值

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			//执行callback会返回一个值后马上取反
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},
```
17. map 根据回调函数处理数组，返回新数组
18. now 返回当前时间戳