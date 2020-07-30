// 在调用$.ajax前 会调用 ajaxPrefilter options表示$.ajax里面的参数集合
$.ajaxPrefilter(function (options) {
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }//短路运算
    }
    options.url = 'http://ajax.frontend.itheima.net' + options.url;

})