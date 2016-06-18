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

