//在调用$.get() $.post() $.ajax() 时 都会先调用ajaxPrefilter这个函数
//$.ajaxPrefilter()
//在这个函数中，可以拿到我们的配置对象
$.ajaxPrefilter(function(options){
    //在发起真正的ajax请求之前，统一拼接请求路径
    options.url = 'http://www.liulongbin.top:3007' + options.url

    //统一为 有权限的接口 设置headers请求头
    if(options.url.indexOf('/my/') !== -1){
        options.headers = {
            Authorization : localStorage.getItem('token') || ''
        }
    }

    // 统一挂载 complete 函数
    options.complete = function(res){
        if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！'){
            // 1 强制清空本地token
            localStorage.removeItem('token')
            // 2 强制跳转到登陆页面
            location.href = '/day1/code/login.html'
        }
    }
})