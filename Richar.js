/**
 * Created by Administrator on 2016/6/11 0011.
 */
(function(window,undefined){
    //定义window减少window查询的范围，压缩时window参数也可以压缩，如果没有参数window，使用window后，压缩时他就不可压缩了
    //在早期的浏览器undefined是可以赋值的，参数定义了undefined他就永远等于undefined

    var Richar = function(selector){
        // 为什么不用 new Richar() 来创造一个实例？
        //因为使用 new Richar() 就相当于不断在调用自己，程序就会卡死
        return new Richar.fn.init(selector); //把init当作一个构造函数创建一个实例
    };

    Richar.fn = Richar.prototype = {
        init : function(selector){
            if(typeof selector === 'string' ){
                [].push.apply(this,Richar.select(selector));
            }
            return this;
        },
        size : function(){
            return this.length;
        }
    };

    //extend 扩展函数模块 在Richar对象和Richar原型上都添加这个方法
    Richar.extend = Richar.fn.extend = function(o1,o2){
        if(arguments.length === 1){
            for(var key in arguments[0]){
                this[key] = arguments[0][key];
            }
        }else if(arguments.length === 2){
            for(var key in o2){
                o1[key] = o2[key];
            }
        }

    }

    //each模块

    Richar.extend({
        each : function(arr,fn){
            for(var i=0;i<arr.length;i++){
                var flag = fn.call(arr[i],i,arr[i]);
                if(flag === false){
                    break;
                }
            }

        }
    });

    Richar.fn.index = 1;
    Richar.fn.extend({
        each : function(fn){
            Richar.each(this,fn);
        }
    });



    //选择器模块
    Richar.extend({
        select : function(selector){
            var result = [];
            var firstChar = selector.charAt(0);
            switch(firstChar){
                case '#':
                    [].push.call(result,document.getElementById(selector.slice(1)));
                    break;
                case '.':
                    if(document.getElementsByClassName){
                        [].push.apply(result,document.getElementsByClassName(selector.slice(1)));
                    }else{
                        var allTag = document.getElementsByTagName('*');
                        for(var i=0;i<allTag.length;i++){
                            var arr = allTag[i].className.split(' ');
                            for(var j=0;j<arr.length;j++){
                                if(arr[j] == selector.slice(1)){
                                    result.push(allTag[i]);
                                }
                            }
                        }
                    }
                    break;
                default :
                    [].push.apply(result,document.getElementsByTagName(selector));
                    break;
            }
            return result;
        }
    })

    Richar.fn.init.prototype = Richar.prototype; //使init的实例原型指向Richar的原型，这样实例就可以访问Richar原型上的方法
    window.$ = window.Richar = Richar; //把Richar添加到window的对象上，他就是一个对外接口，外面就可以用到他

})(window);