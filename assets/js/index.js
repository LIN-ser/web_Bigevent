$(function(){
    //导入layui.layer模块 //用于提示信息和询问模块
    let layer = layui.layer
    //调用获取用户基本信息的函数
    getUserinfo()

    //点击退出 退出登陆功能
    $('#btnLogout').click(function(){
        layer.confirm('确定退出登陆?', {icon: 3, title:'提示'}, function(index){
            // 1 在退出时删除本地的token值
            localStorage.removeItem('token')
            // 2 退出后返回登陆页面
            location.href = '/code/login.html'
            
            // 关闭询问框的
            layer.close(index);
          });
    })
})



function getUserinfo(){
    //获取用户基本信息
    $.ajax({
        method : 'GET',
        url : '/my/userinfo',
        //headers 就是请求头配置对象
        // headers : {
        //     Authorization : localStorage.getItem('token') || ''
        // },
        success : function(res){
            if(res.status !== 0){
                return layer.msg('获取用户信息失败！')
            }
            //获取信息成功调用renderAvater函数
            renderAvater(res.data)
        },
        // // 无论成功还是失败，都会调用complete函数
        // complete : function(res){
        //     // console.log(res);
        //     if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！'){
        //         // 1 强制清空本地token
        //         localStorage.removeItem('token')
        //         // 2 强制跳转到登陆页面
        //         location.href = '/day1/code/login.html'
        //     }
        // }
    })
}

//封装渲染用户头像的函数
function renderAvater(user) {
    // 1 获取用户名称
    let name = user.nickname || user.username
    // 2 设置文本
    $('#welcome').html('欢迎&nbsp&nbsp' + name)
    // 3 渲染头像
    if(user.user_pic !== null){
        // 3.1 有头像优先渲染头像
        $('.layui-nav-img').attr('src',user.user_pic).show()
        $('.text-avater').hide()
    }else{
        // 3.2 没头像渲染就渲染用户名的第一个字母（并大写）
        $('.layui-nav-img').hide()
        $('.text-avater').html(name[0].toUpperCase()).show()
    }

}