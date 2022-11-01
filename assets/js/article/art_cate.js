$(function () {
    let form = layui.form

    initArtcateList()

    //获取文章分类列表
    function initArtcateList() {
        //发起get请求
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                let htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }

    // 为添加按钮绑定点击事件
    let indexAdd = null
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })

    // 使用事件委托 为 #form-add 表单绑定 submit事件 将数据传送到服务器
    $('body').on('submit', '#form-add', function (e) {
        //阻止默认行为
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('添加分类失败')
                }
                layui.layer.msg('添加分类成功')
                //在服务器获取新的内容并渲染
                initArtcateList()
                // 根据索引关闭弹出层
                layer.close(indexAdd)
            }
        })
    })

    // 使用事件委托 为编辑 .btn-edit 绑定点击事件 渲染表单
    let indexEdit = null
    $('tbody').on('click', '.btn-edit', function (e) {
        //阻止默认行为
        e.preventDefault()
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })

        // 通过每条数据的id值，获取相应的数据
        let id = $(this).attr('data-id')
        //发起请求获取相应的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                //将服务器上的数据 赋值给表单
                form.val('form-edit', res.data)
            }
        })
    })

    //使用事件委托 为 #form-edit 表单绑定 submit 事件 将数据传送到服务器
    $('body').on('submit', '#form-edit', function (e) {
        //阻止默认行为
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('更新分类失败')
                }
                layui.layer.msg('更新分类成功')
                //在服务器获取新的内容并渲染
                initArtcateList()
                // 根据索引关闭弹出层
                layer.close(indexEdit)
            }
        })
    })

    // 通过事件委托 为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        //获取id
        let id = $(this).attr('data-id')
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layui.layer.msg('删除分类失败')
                    }
                    layui.layer.msg('删除分类成功')
                    //渲染数据
                    initArtcateList()
                    layer.close(index);
                }
            })
        });

    })
})


