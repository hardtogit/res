String.prototype.toFirstUpper=function(){return this.charAt(0).toUpperCase()+this.substring(1)};
String.prototype.strlen=function(str,b){b=b||2;return str.replace(/[\u0391-\uFFE5]/g,"aaaaaaaa".substring(0,b)).length};
String.prototype.trim=function(){return this.replace(/(^\s+)|(\s+$)/g,'')};
String.prototype.toJSON=function(){return this.length<=2?{}:new Function("return "+this)()};
String.prototype.colorRgba=function(){var c=this.substring(1).toLowerCase(),m=['A','R','G','B'],rgba={};if(c.length<6)c=c+c;if(c.length<8)c='ff'+c;for(var i=0,n=0;i<4;i++,n+=2){rgba[m[i]]=parseInt("0x"+c.substring(n,n+2))}rgba.A=(rgba.A/255).toFixed(2);return rgba};
String.prototype.format=function(args){var f=this,b=f.match(/\{([\d|\w|\.|\_]*)\}/g),t,v;if(b!=null){for(var i=0;i<b.length;i++){t=b[i].replace(/\{|\}/g,''),v=args[t],f=f.replace(b[i],typeof(v)!='undefined'?v:"")}}return f};
String.prototype.appendTo=function(ele){ele.insertAdjacentHTML('beforeend',this);return ele.lastChild};
String.prototype.find=function(e){e=e||document;return e.find(this)};
String.prototype.findAll=function(e){e=e||document;return e.findAll(this)};
location.params=function(){var q=location.search,p={};if(q.length>0){q=q.substring(1).split('&');for(var i=0;i<q.length;i++){var a=q[i],b=a.indexOf('='),k=a.substring(0,b);p[k]=a.substring(b+1)}}return p};location.query=function(a,d){var c=W.location.search.substr(1),b=c.match(new RegExp("(^|&)"+a+"=([^&]*)(&|$)"));if(d){return(b==null?null:b[2])}else{return(b==null?null:unescape(b[2]))}};
document.find=Element.prototype.find=function(a){return this.querySelector(a)}
document.findAll=Element.prototype.findAll=function(a){return this.querySelectorAll(a)}
document.setCookie=function(k, v, o) {
	if (typeof(v) == 'undefined' && typeof(o) == 'undefined') {
		var a = k + "=";
        if (document.cookie.length > 0) {
            offset = document.cookie.indexOf(a);
            if (offset > -1) {
                offset += a.length;
                end = document.cookie.indexOf(";", offset);
                if (end == -1) { end = document.cookie.length }
                return unescape(document.cookie.substring(offset, end));
            }
        }
		return '';
	}
	
	if (v==null || v.length==0 || v == 0) {
		var exp = new Date();
		exp.setTime (exp.getTime()-1000);
		document.cookie = [k,'=; expires=', exp.toGMTString()].join('');
		return;
	}
	
	var os=(typeof(o)=='object'?o:({expires:o})),df={expires:'',path:'',domain:'',secure:''},c=[k,'=',escape(v)];
    for (var k in df)if(!os[k])os[k]=df[k];
    if (os.expires) {
        var date = new Date();
        if (typeof (os.expires) == 'number') {
            date.setTime(date.getTime() + (os.expires * 24 * 60 * 60 * 1000));
        } else if (typeof (os.expires) == 'object') {
            if (os.expires.year) date.setFullYear(date.getFullYear() + os.expires.year);
            if (os.expires.month) date.setMonth(date.getMonth() + os.expires.month + 1);
            if (os.expires.day) date.setDate(date.getDate() + os.expires.day);
            if (os.expires.hour) date.setHours(date.getHours() + os.expires.hour);
        }
        c.push(';expires=' + date.toGMTString());
    }
    if (os.path) c.push('; path=' + os.path);
    if (os.domain) c.push('; domain=' + os.domain);
    if (os.secure) c.push('; secure');
    document.cookie = c.join('');
};
