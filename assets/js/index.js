$(() => {
    getUserinfo()
        // 3.实现退出功能
        // 3.1点击退出按钮实现退出功能
    $('#btnLogout').click(() => {
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {
            //do something
            // 3.2. 清空本地存储中的 token
            localStorage.removeItem('token')

            // 3.3. 重新跳转到登录页面
            location.href = '/login.html'

            // 3.4关闭 confirm 询问框
            layer.close(index);
        });
    })
})

// 1.定义获取用户信息的函数 getUserinfo 函数
function getUserinfo() {
    // 1.1发起get请求
    $.ajax({
        type: "get",
        url: "/my/userinfo",
        success: res => {
            if (res.status !== 0) return layui.layer.msg(res.message)

            // 1.2渲染用户头像
            renderAvatar(res.data)
        }
    });
};
// 2.定义渲染用户信息头像的函数 renderAvatar 函数
function renderAvatar(data) {
    let name = data.nickname || data.username

    // 2.1设置欢迎文本
    $('.welcome').html('欢迎你&nbsp;&nbsp;' + name)

    // 2.2判断用什么头像
    if (data.user_pic !== null) {

        // 2.3使用图像头像
        $('.layui-nav-img').prop('src', data.user_pic).show()
        $('.text-avatar').hide()
    } else {

        // 2.4使用文字头像
        let first = name[0].toUpperCase()
        $('.layui-nav-img').hide()
        $('.text-avatar').html(first).show()
    }
};