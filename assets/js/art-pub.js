$(function () {
    loadSelect();

    // 初始化富文本编辑器
    initEditor()

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 选择图片
    $('#btFile').on('click', function () {
        $('#coverFile').click();
    })


    // 获取图片并替换到封面
    $('#coverFile').on('change', function () {
        // 判断用户是否选择了图片
        if (this.files.length == 0) return layer.msg('请选择图片')

        // 选择了就获取图片在内存中的地址
        var newImgURL = URL.createObjectURL(this.files[0]);

        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域

    });

    // 定义默认发布状态
    var state = '已发布';
    // 提交数据-- 存为草稿
    $('#saveBt2').on('click', function () {
        state = '草稿';
    })

    // 提交数据
    $('#myform').on('submit', function (e) {
        e.preventDefault();
        // 用formData对象同意收集数据
        var fd = new FormData(this);
        /* fd.forEach(function (v, k) {
            console.log(k, v);
        }) */
        // 追加一个数据  状态数据
        fd.append('state', state);

        // 将获取选中的图片的二进制追加到fd中
        // 4. 将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob);

                // 发送数据
                $.ajax({
                    type: 'post',
                    url: '/my/article/add',
                    data: fd,
                    processData: false,
                    contentType: false,
                    success: function (res) {
                        if (res.status != 0) return layer.msg('数据提交失败，请重新提交');
                        layer.msg(res.message);
                        window.location.href = '/article/art-list.html'
                    }
                })
            })


    })
})


// 加载下拉框数据
function loadSelect() {
    $.ajax({
        type: 'get',
        url: '/my/article/cates',
        success: function (res) {
            if (res.status != 0) return layer.msg(res.message);
            var tpl = template('tpl-select', res);
            $('[name="cate_id"]').html(tpl);
            // 动态加载数据渲染，需重新渲染
            layui.form.render();
        }
    })
}