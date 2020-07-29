$(function () {
    // 点击切换到注册界面
    $('#link_reg').on('click', function () {
        $('.login-box').hide().siblings('.reg-box').show();
    })
    // 点击切换到登录界面
    $('#link_login').on('click', function () {
        $('.reg-box').hide().siblings('.login-box').show();
    })

    // 从layui中获取form对象-- 表单验证
    var form = layui.form;
    // 自定义校验验证规则
    form.verify({
        // 元素1 校验密码， 元素2 提示信息
        pwd: [/^[\S]{6,12}$/, '密码为6-12位字符，不能包含空格'],
        // pwd: [/^[\S]{6,12}$/, '密码密须是6到12位，且不能出现空格'],

        repwd: function (val) {//val是第二池输入的密码
            // 验证两次密码是否一致
            if ($('.reg-box [name="password"]').val() != val) return '两次输入密码不一致，请重新输入'
        }
    });

    // var layer = layui.layer;
    // 对象结构 ==var layer = layui.layer;
    var { layer } = layui;
    // 注册账号
    $('#reg_form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'post',
            // 局域网地址
            url: '/api/reguser',
            // 不在学校也可用
            // url: 'http://ajax.frontend.itheima.net/api/reguser',
            data: {
                username: $('#reg_form [name="username"]').val(),
                password: $('#reg_form [name="password"]').val()
            },
            success: function (res) {
                if (res.status !== 0) return layer.msg(res.message)
                // 注册成功跳转到登录页面
                $('#link_login').click();
                layer.msg(res.message)
            }
        })
    });

    // 登录
    $('#login_form').on('submit', function (e) {
        // 阻止默认事件
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/api/login',
            // 快速获取表单数据
            data: $('#login_form').serialize(),
            /* {//手动收集
                username: $('#login_form [name="username"]').val(),
                password: $('#login_form [name="password"]').val()
            }, */
            success: function (res) {
                if (res.status != 0) return layer.msg(res.message);
                // 登录成功将权限保存到本地  localStorage同一网站共享
                localStorage.setItem('token', res.token);//token 凭证
                layer.msg(res.message);
                // 登录成功跳转到后台首页
                location.href = '/index.html';
            }
        })
    });
})