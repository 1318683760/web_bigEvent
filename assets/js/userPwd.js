$(function () {

    layui.form.verify({
        pwd: [/^\S{6,12}$/, '密码长度为6-12位'],
        rePwd: function (value) {
            if ($('[name="newPwd"]').val() !== value) {
                return '密码不一致';
            }
        }
    });

    $('#pwdForm').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/my/updatepwd',
            data: $('#pwdForm').serialize(),
            success: function (res) {
                if (res.status != 0) return;
                localStorage.removeItem('token');
                // iframe 标签里面跳转主页面需要找window的父级的location.href
                window.parent.location.href = '/login.html';
            }
        })
    });
})