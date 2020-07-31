$(function () {
    // 引入layui的对象
    var form = layui.form;
    layer = layui.layer;
    // 验证规则
    form.verify({
        nickname: function (value) {
            if (value.length > 6) return '昵称不能超过6位';
        }
    });

    // 获取用户信息
    initUsreInfo();

    // 表单重置
    $('#reSetBt').on('click', function (e) {
        e.preventDefault();
        initUsreInfo();
    })

    // 提交表单数据
    $('#myform').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/my/userinfo',
            data: $('#myform').serialize(),
            success: function (res) {
                if (res.status != 0) return layer.msg(res.message);
                layer.msg(res.message);
                initUsreInfo();
            }
        })
    })
})


// 获取用户信息
function initUsreInfo() {
    $.ajax({
        type: 'get',
        url: '/my/userinfo',
        success: function (res) {

            if (res.status !== 0) return layer.msg(res.message);
            // layui快速给表单输入框赋值
            layui.form.val('myform', res.data)
        }
    })
}