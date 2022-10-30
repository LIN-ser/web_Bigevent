$(function () {

    // 1.1 获取裁剪区域的 DOM 元素
    let $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    //为上传绑定点击事件
    $('#btnChooseImage').on('click', function () {
        $('#file').click()
    })

    //为文件选择框绑定change事件
    $('#file').on('change', function (e) {
        //获取用户选择的文件
        let filelist = e.target.files
        if (filelist.length === 0) {
            return layui.layer.msg('获取照片失败')
        }

        // 1 拿到用户选择的文件
        let file = e.target.files[0]
        // 2 将文件转化为路径
        let newImgURL = URL.createObjectURL(file)
        // 3 销毁原来的路径，替换新选择照片的路径
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    $('#btnUpload').on('click', function () {
        // 1 拿到用户裁剪的图片
        let dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

        // 2 将拿到的图片发送给服务器 并渲染出来
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('更新图片失败')
                }
                layui.layer.msg('更新图片成功')
                //渲染头像
                window.parent.getUserinfo()
            }
        })
    })
})
