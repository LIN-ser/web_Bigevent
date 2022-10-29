$(function(){
    //为“去注册账号”注册点击事件
    $('#link-reg').on('click',()=>{
         $('.login-box').hide()
         $('.reg-box').show()
    })
    //为“去登陆”注册点击事件
    $('#link-login').on('click',()=>{
        $('.login-box').show()
        $('.reg-box').hide()
    })

    //利用layui的form.verify()函数自定义规则
    //记得将自定好的规则写入 lay-verify=‘自定义规则中的名字’中
    let form = layui.form
    //导入layui.layer模块 //用于提示信息的
    let layer = layui.layer
    // pwd:[正则表达式,‘匹配不符合时的提示’]
    form.verify({
        pwd : [/^[\S]{6,12}$/,'密码必须6到12位，且不能出现空格'],

        //检验两次密码是否一致函数
        repwd : function(value){
            // 形参 value 拿到的是再次确认密码的内容
            // 将 密码 与 确认密码进行验证，不通过提示错误消息
            let pwd = $('.reg-box [name=password]').val()
            if(pwd !== value){
                return '两次密码输入不一致'
            }
        }
    })
    //为注册表单绑定submit事件
    $('#form_reg').on('submit',function (e){
        //1 阻止表单的默认行为
        e.preventDefault()
        //利用ajax发起post请求
        let data = {username : $('#form_reg [name=username]').val(),password : $('#form_reg [name=password]').val(),}
        $.post('/api/reguser',data,
            (res)=>{
                if(res.status !== 0){
                   return layer.msg(res.message, {icon: 5}) 
                }
                layer.msg('注册成功，请登录', {icon: 6})
                //注册成功跳转到登陆页面
                $('#link-login').click()
            }
        )
    })

    //为登陆表单绑定submit事件
    $('#form_login').submit(function(e){
        //阻止表单默认行为
        e.preventDefault()
        //发起ajax的post请求
        $.ajax({
            url : '/api/login',
            method : 'POST',
            //快速获取表单中的数据
            data : $(this).serialize(),
            success : (res)=>{
                if(res.status !== 0){
                    return layer.msg(res.message, {icon: 5}) 
                }
                layer.msg('登录成功', {icon: 6})
                //将登陆获取到的token字符串保存到本地浏览器中
                localStorage.setItem('token',res.token)
                //跳转到后台主页
                location = './index.html'
            }
        })
    })
})