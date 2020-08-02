$(function () {
    // 定义参数对象
    var query = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 5, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }

    // 用于保存弹窗 后边用于清除
    var box = null
    // 加载所有数据
    load();
    // 加载下拉框数据
    loadSelect();
    

    // 美化时间操作  
    template.defaults.imports.dateformat = function (time) {
        var dt = new Date(time);
        // padStart() 补零操作
        var y = (dt.getFullYear()).toString().padStart(2, '0');
        var m = (dt.getMonth()).toString().padStart(2, '0');
        var d = (dt.getDay()).toString().padStart(2, '0');

        var hh = (dt.getHours()).toString().padStart(2, '0');
        var mm = (dt.getMinutes()).toString().padStart(2, '0');
        var ss = (dt.getSeconds()).toString().padStart(2, '0');

        return `${y}年${m}月${d}日  ${hh}时${mm}分${ss}秒`;

    }

    // 点击编辑 editBt
    $('#list_art').on('click', '#editBt', function () {
        alert()
    })

    // 点击删除 
    $('#list_art').on('click', '#delBt', function () {
        var id = $(this).attr('data-index');

        layer.confirm('确定要删除？', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                type: 'get',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status != 0) return layer.msg(res.message)
                    layer.msg(res.message);
                    // 判断页面剩余数据，当没有数据时页码-1并重新加载数据
                    if ($('#delBt').lengh == 1) {
                        query.pagenum = p.pagenum == 1 ? 1 : query.pagenum;
                    }
                    load();
                }
            })
            layer.close(index);
        });



    });


    // 筛选数据
    $('#screen').on('submit', function (e) {
        e.preventDefault();
        var eleId = $('#selectName').val();
        var selectStatus = $('#selectStatus').val();
        // 为查询参数对象 query 中对应的属性赋值
        query.cate_id = eleId;
        query.state = selectStatus;
        // 根据最新的筛选条件，重新渲染表格的数据
        load();
    })

    // 加载所有数据
    function load() {
        $.ajax({
            type: 'get',
            url: '/my/article/list',
            data: query,
            success: function (res) {
                if (res.status != 0) return layer.msg(res.message);
                // 获取成功，用模板引擎渲染页面
                var tpl = template('tpl', res);
                $('#list_art').html(tpl);
                // 分页
                renderPageNum(res.total);
            }
        })
    }

    // 定义分页方法
    function renderPageNum(total) {
        //执行一个laypage实例
        layui.laypage.render({
            elem: 'pageNum', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: query.pagesize,//每页显示条数
            curr: query.pagenum,//设置默认被选中的的分页
            limits: [4, 6, 8, 10, 12],//选择显示数据数量
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],//分页功能
            jump: function (obj, first) {
                // 解决点击页码时跳转
                query.pagenum = obj.curr;
                // 解决点击选择显示数据数量时跳转
                query.pagesize = obj.limit;
                // 不是第一次加载才执行
                if (!first) load();
            }
        });
    }


})

// 加载下拉框数据
function loadSelect() {
    $.ajax({
        type: 'get',
        url: '/my/article/cates',
        success: function (res) {
            if (res.status != 0) return layer.msg(res.message);
            var tpl = template('tpl-select', res);
            $('[name="select"]').html(tpl);
            // 动态加载数据渲染，需重新渲染
            layui.form.render();
        }
    })
}

