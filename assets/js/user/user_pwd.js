$(function(){
    //导入layui模块
    let form = layui.form
    // let layer = layui.layer

    //验证模块
    form.verify({
        pwd : [/^[\S]{6,12}$/,'密码必须6到12位，且不能出现空格'],
        samepwd : function(value){
            if(value === $('[name=oldPwd]').val()){
                return '原密码与新密码一致'
            }
        },
        //检验两次密码是否一致函数
        repwd : function(value){
            // 形参 value 拿到的是新密码的内容
            // 将 新密码 与 确认密码进行验证，不通过提示错误消息
            if($('[name=newPwd]').val() !== value){
                return '两次密码输入不一致'
            }
        }
    })

    //将更新的密码发送到服务器
    $('.layui-form').on('submit',function(e){
        e.preventDefault()

        //发起post请求
        $.ajax({
            method : 'POST',
            url : '/my/updatepwd',
            data : $(this).serialize(),
            success : function(res){
                if(res.status !== 0){
                    return layui.layer.msg('更新密码失败')
                }
                layui.layer.msg('更新密码成功')

                //更新成功后将表单数据重置 利用js原生的reset()方法
                $('.layui-form')[0].reset()
            }
        })
    })

})