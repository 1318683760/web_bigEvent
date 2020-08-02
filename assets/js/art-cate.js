$(function () {
    // 加载数据
    getArtData();
    // 用于保存弹窗 后边用于清除
    var box = null
    // 添加数据
    $('#addBt').on('click', function () {
        // 弹框
        box = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#addTpl').html()
        });
    });
    // 提交添加的数据
    $('body').on('submit', '#addForm', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/my/article/addcates',
            data: $('#addForm').serialize(),
            success: function (res) {
                if (res.status != 0) return layer.msg('数据添加失败');
                layer.close(box);
                getArtData();
            }
        })
    })

    // 点击编辑
    $('#list_art').on('click', '#editBt', function () {
        // 弹框
        box = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#editTpl').html()
        });

        var id = $(this).attr('data-index');
        queryData(id);
    });

    // 提交修改后的数据
    $('body').on('submit', '#editForm', function (e) {
        // alert()
        e.preventDefault();
        // uploadData();
        $.ajax({
            type: 'post',
            url: '/my/article/updatecate',
            data: $('#editForm').serialize(),//快速获取表单里面的
            success: function (res) {
                if (res.status != 0) return layer.msg('数据更新失败')
                layer.msg('数据更新成功')
                layer.close(box);
                getArtData();
            }
        })

    })

    // 点击删除 delBt
    $('#list_art').on('click', '#delBt', function () {
        var id = $(this).attr('data-index');
        layer.confirm('确定要删除？', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                type: 'get',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status != 0) return layer.msg(res.message);
                    layer.msg(res.message);
                    getArtData();
                }
            });
            layer.close(index);
        })

    });

})


// 获取数据
function getArtData() {
    $.ajax({
        type: 'get',
        url: '/my/article/cates',
        success: function (res) {
            if (res.status != 0) return layer.msg('获取数据失败');
            loadPage(res);
        }
    })
}

// 渲染数据 模板引擎
function loadPage(res) {
    var tpl = template('tpl', res);
    $('#list_art').html(tpl);
}

// 根据id查询数据
function queryData(id) {
    $.ajax({
        type: 'get',
        url: '/my/article/cates/' + id,
        Header: {
            Authorization: localStorage.getItem('token')
        },
        success: function (res) {
            if (res.status != 0) return layer.msg('数据获取失败');
            // <form class="layui-form"  lay-filter="editForm" 
            // 注意把表单域里面的name属性和数据包的属性名一一对应
            layui.form.val('editForm', res.data);

        }
    });

}

