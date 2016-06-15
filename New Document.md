# jQuery内核与详解实践-笔记1

## load与ready事件的区别

>浏览器渲染顺序

>1.解析HTML结构
>
>2.加载样式表和脚本

>3.解析并执行脚本文件

>4.构建DOM HTML模型

>5.加载外部文件图片等

>6.页面渲染加载完成

load事件是原生JS的事件，他发生在页面加载完成的时候，也就是第六步；而且他就有一个特点，他只会执行一次。

```javascript
	window.onload = function(){
		alert(1);
	}
	window.onload = function(){
			alert(2);
		}
	window.onload = function(){
			alert(3);
		}
	//在这里，只会弹出3
```

ready事件是jQuery的事件，他是发生在DOM模型构造完成时，上面所说的第四步，他执行的时间比load事件早，而且他可以执行多次。

```javascript
	$(function(){
		alert(1);	
	})
	$(function(){
			alert(2);	
	})
	$(function(){
			alert(3);	
	})
	//执行时会先别弹出1、2、3
```

