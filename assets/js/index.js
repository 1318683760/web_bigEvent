$(function () {
    // 提示文本 对象解构赋值简写
    var { layer } = layui;
    // 加载页面获取用户信息
    getUserInfo();

    // 退出登录
    $('#logout').on('click', function () {
        layer.confirm('确定退出?', { icon: 3, title: '提示' }, function (index) {
            // 销毁凭证
            localStorage.removeItem('token');
            // 跳转登录页面
            location.href = '/login.html'

            layer.close(index);
        });
    })
})
// 加载页面获取用户信息
function getUserInfo() {
    $.ajax({
        type: 'get',
        url: '/my/userinfo',
        // jq固定写法 添加请求头 
        /* headers: {
            // 凭证
            // Authorization: localStorage.getItem('token') || ''//短路运算
        }, */
        success: function (res) {
            if (res.status != 0) return layer.msg(res.message);
            layer.msg(res.message);
            renderAvatar(res.data);
        },
        complete: function (res) {
            // console.log(res);
            // 未登录访问index拦截
            if (res.responseJSON.status == 1) {
                localStorage.removeItem('toke');
                location.href = '/login.html';
            }
        }
    })
}

// 用户信息渲染
function renderAvatar(user) {
    var name = user.nickname || user.username;
    $('.userinfo .username').html(name);

    if (user.user_pic == null) {
        var first = name[0].toUpperCase();
        $('.text-avater').html(first).show();
    } else {
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avater').hide();
    }


}