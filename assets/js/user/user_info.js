$(function(){
    //导入layui的表单模块
    let form = layui.form
    let layer = layui.layer

    //验证规则
    form.verify({
        nickname : function(value){
            if(value.length > 6){
                return '昵称长度不能超过1-6个字符'
            }
        }
    })

    initUserinfo()

    //初始化用户信息
    function initUserinfo (){
        $.ajax({
            method : 'GET',
            url : '/my/userinfo',
            success : function(res){
                if(res.status !== 0){
                    return layer.msg('获取信息失败')
                }
                console.log(res);
                //在这里调用form.val()为表单填充值
                form.val('formUserinfo',res.data)
            }
    
        })
    }

    //重置表单数据
    $('#btnReset').on('click',function (e) {
        //阻止表单默认重置行为
        e.preventDefault()
        initUserinfo ()
    })

    //监听表单的提交事件
    $('.layui-form').on('submit',function(e){
        //阻止表单默认行为
        e.preventDefault()
        //发起ajax请求
        $.ajax({
            method : 'POST',
            url : '/my/userinfo',
            data : $(this).serialize(),
            success : function(res){
                if(res.status !== 0){
                    return layer.msg('更新用户信息失败')
                }
                console.log(res);
                layer.msg('更新用户信息成功')
                //成功的话渲染头像跟名称
                // 只需调用父页面的渲染函数即可
                window.parent.getUserinfo()
            }
        })
    })
})

