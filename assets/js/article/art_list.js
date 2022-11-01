$(function () {
    //分页模块
    let laypage = layui.laypage;

    //定义一个时间过滤器
    template.defaults.imports.dateFormat = (date) => {
        const dt = new Date(date)

        let y = dt.getFullYear()
        let m = padZero(dt.getMonth() + 1)
        let d = padZero(dt.getDate())

        let hh = padZero(dt.getHours())
        let mm = padZero(dt.getMinutes())
        let ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    //定义补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    //定义一个查询参数对象，在将来请求数据的时候 将查询参数对象提交到服务器
    let q = {
        pagenum: 1, //页码值
        pagesize: 2, //每页显示多少条数据
        cate_id: '',//文章分类的 Id
        state: '',//文章的发布状态
    }

    initTable()
    initCate()
    //在服务器获取数据并渲染表格
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                // console.log(res)
                if (res.status !== 0) {
                    return layui.layer.msg('获取文章类表失败')
                }
                //使用模版引擎渲染数据
                let htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                //当渲染完表格后就可以渲染分页
                renderPage(res.total)
            }
        })
    }

    //初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('获取分类数据失败')
                }
                //使用模版引擎渲染数据
                let htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                //通过layui重新渲染表单区域的 ui 结构
                layui.form.render()
            }
        })
    }

    //为筛选表单绑定submit事件
    $('#form-search').on('submit', function (e) {
        e.prevntDefault()
        //获取表单选中的数据
        let cate_id = $('[name=cate_id]').val()
        let state = $('[name=state]').val()
        //将获取选中的表单数据传给 q 通过 q所请求的数据 再渲染最新的表格
        q.cate_id = cate_id
        q.state = state
        //渲染最新的表格
        initTable()
    })

    //渲染分页的函数
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数
            limit: q.pagesize,//每页显示的条数
            limits: [2, 3, 5, 10], // 设置自定义排版layout中的limit条目选项区域的数量
            curr: q.pagenum, //设置默认被选中的页面
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            //页面发生切换的时候 触发 jump 回调函数
            //触发jump回调的两种方式：
            // 1 点击页码时，会触发 jump 函数回调 //使用第一种方法触发jump函数时 first为 undefined
            // 2 在调用laypage.render()方法的时候会 触发jump函数回调 //使用第二种方法触发jump函数时 first为 true 
            // 可以通过first的值，判断jump通过那种方式进行的回调
            jump: function (obj, first) {
                //将最新的页码值 赋值到 q 查询参数对象 
                q.pagenum = obj.curr //得到当前页
                //将最新的条目数 赋值到 查询参数对象 q的pagesize这个属性中 
                q.pagesize = obj.limit //点击条目数框的时候也会jump回调
                //根据最新的q 获取最新的数据列表 并渲染表格
                // initTable()
                // 解决 调用initTable()方法陷入死循环 的方法
                // 利用first的特性进行判断
                if (!first) {
                    initTable()
                }
            }
        })
    }


    //删除功能
    $('tbody').on('click', '.btn-delete', function () {
        //获取删除按钮的个数
        let len = $('.btn-delete').length
        //接收自定义属性Id的值
        let id = $(this).attr('data-id')
        //弹出框
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layui.layer.msg('删除文章失败')
                    }
                    layui.layer.msg('删除文章成功')
                    //当数据删除之后，需要判断这一页是否还有数据，如果没有剩余数据了
                    //则让页码值-1之后，再重新调用initTable()渲染数据
                    if (len === 1) {
                        //如果len的值等于1 说明删除之后页面就没有数据了
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })

            layer.close(index)
        })
    })

})