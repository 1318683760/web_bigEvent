$(function () {

    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比  4/3 16/9....
        aspectRatio: 1 / 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)
    // 点击选择图片
    $('#btnChooseImage').on('click', function () {
        $('#file').click()
    })
    // 将选择的图片显示在页面中
    $('#file').on('change', function () {
        if (this.files.length == 0) return layer.msg('请选择要上传的图片');

        // 获取选择的图片的URL
        var imgURL = URL.createObjectURL(this.files[0])
        // 3. 重新初始化裁剪区域
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', imgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域

    });

    // 获取裁剪后的图片上传到服务器
    $('#uploadBt').on('click', function () {
        var dataURL = $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')

        $.ajax({
            type: 'post',
            url: '/my/update/avatar',
            data: dataURL,
            success: function (res) {
                if (res.status != 0) return layer.msg('图片上传失败，请重新上传');
                layer.msg('图片上传成功');
                window.parent.getUserInfo();
            }
        })
    })
})