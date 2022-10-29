//在调用$.get() $.post() $.ajax() 时 都会先调用ajaxPrefilter这个函数
//$.ajaxPrefilter()
//在这个函数中，可以拿到我们的配置对象
$.ajaxPrefilter(function(options){
    //在发起真正的ajax请求之前，统一拼接请求路径
    options.url = 'http://www.liulongbin.top:3007' + options.url
})