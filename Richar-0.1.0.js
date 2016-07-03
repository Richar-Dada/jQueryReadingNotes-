/**
 * Created by Administrator on 2016/6/13 0013.
 */
(function(window,undefined){

    Richar = function(selector){
        return new Richar.prototype.init(selector);
    };

    Richar.fn = Richar.prototype = {
        constructor : Richar,
        init : function(selector){
            if(Richar.isString(selector)){
                if(selector.charAt(0) === '<'){
                    [].push.apply(this,Richar.parseHTML(selector));
                }else{
                    [].push.apply(this,Richar.select(selector));
                }
            }else if(Richar.isRichar(selector)){
                return selector;
            }else if(Richar.isDom(selector)){
                this[0] = selector;
                this.length = 1;
            }else if(Richar.isArrayLike(selector)){
                [].push.apply(this,selector);
            }
            this.selector = selector;

        },
        size : function(){
            return this.length;
        }
    };

    Richar.extend = Richar.fn.extend = function(){
        if(arguments.length == 1){
            for(var key in arguments[0]){
                this[key] = arguments[0][key];
            }
        }else{
            for(var key in arguments[1]){
                arguments[0][key] = arguments[1][key];
            }
        }
    };

    Richar.each = function(arr,fn){
        for(var i=0;i<arr.length;i++){
            if(fn.call(arr[i],i,arr[i]) === false){
                break;
            }
        }
        return arr;
    };

    Richar.fn.extend({
        each :function(fn){
            return Richar.each(this,fn);
        }
    });



    Richar.fn.extend({
        css : function(k,v){
            if(arguments.length === 1){
                if(Richar.isString(k)){
                    if(this[0].currentStyle){
                        return this[0].currentStyle[k];
                    }else{
                        return window.getComputedStyle(this[0],null)[k];
                    }
                }else if(Richar.isObject(k)){
                    Richar.each(this,function(){
                        for(var key in k){
                            this.style[key] = k;
                        }
                    })
                }
            }else if(arguments.length === 2){
                Richar.each(this,function(){
                    this.style[k] = v;
                })
            }
            return this;
        }
    });

    Richar.fn.extend({
        attr : function(k,v){
            if(arguments.length === 1){
                return this[0].getAttribute(arguments[0]);
            }else if(arguments.length === 2){
                Richar.each(this,function(){
                    this.setAttribute(k,v);
                })
            }
            return this;
        },
        html : function(html){
            if(arguments.length === 1){
                Richar.each(this,function(){
                    this.innerHTML = html;
                })
            }else if(arguments.length === 0){
                return this[0].innerHTML;
            }
            return this;
        }
    });

    Richar.fn.extend({
        appendTo : function(target){
            var targets = Richar(target);
            var that = this;
            var nodes = [];
            Richar.each(targets,function(index){
                var nowTarget = this;
                Richar.each(that,function(){
                    if((that.length - 1) == index){
                        nowTarget.appendChild(this);
                    }else{
                        var node = this.cloneNode(true);
                        nowTarget.appendChild(node);
                        nodes.push(node);
                    }
                });
            });
            [].push.apply(this,nodes);
            return this;
        },
        append : function(element){
            return Richar.each(this,function(){
                Richar(element).appendTo(this);
            })
        },
        prependTo : function(target){
            var targets = Richar(target);
            var that = this;
            var nodes = [];
            Richar.each(targets,function(index){
                var nowTarget = this;
                Richar.each(that,function(){
                    if((that.length - 1) == index){
                        nowTarget.appendChild(this);
                    }else{
                        var node = this.cloneNode(true);
                        nowTarget.insertBefore(node,nowTarget.firstChild);
                        nodes.push(node);
                    }
                });
            });
            [].push.apply(this,nodes);
            return this;
        },
        prepend : function(element){
            return Richar.each(this,function(){
                Richar(element).prependTo(this);
            })
        }
    });

    Richar.extend({
        isString : function(str){
            return typeof str === 'string';
        },
        isNumber : function(num){
            return typeof num === 'number';
        },
        isBoolean : function(boo){
            return typeof boo === 'boolean'
        },
        isFunction : function(func){
            return typeof func === 'function';
        },
        isArray : function(arr){
            return Object.prototype.toString.call(arr) === '[object Array]';
        },
        isObject : function(obj){
            return Object.prototype.toString.call(obj) === '[object Object]';
        },
        isDom : function(dom){
            return dom.nodeType === 1;
        },
        isRichar : function(selector){
            return 'selector' in selector;
        },
        isArrayLike : function(selector){
            return selector && selector.length && selector.length > 0;
        }
    });

    Richar.extend({
        parseHTML : function(selector){
            var result = [];
            var div = document.createElement('div');
            div.innerHTML = selector;
            var cn = div.childNodes;
            for(var i=0;i<cn.length;i++){
                result.push(cn[i]);
            }
            return result;
        }
    })

    Richar.extend({
        select : function(selector){
            var result = [];
            var firstChar = selector.charAt(0);
            switch(firstChar){
                case '#' :
                    [].push.call(result,document.getElementById(selector.slice(1)));
                    break;
                case '.':
                    if(document.getElementsByClassName){
                        [].push.apply(result,document.getElementsByClassName(selector.slice(1)));
                    }else{
                        var allTag = document.getElementsByTagName('*');
                        for(var i=0;i<allTag.length;i++){
                            var arr = allTag[i].split(' ');
                            for(var j=0;j<arr.length;j++){
                                if(arr[j] == selector.slice(1)){
                                    result.push(allTag[i]);
                                }
                            }
                        }
                    };
                    break;
                default :
                    [].push.apply(result,document.getElementsByTagName(selector));
                    break;
            }
            return result;
        }
    });

    Richar.prototype.init.prototype = Richar.prototype;
    window.$ = window.Richar = Richar;
})(window);