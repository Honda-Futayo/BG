$(() => {
    // 1.昵称的表单验证
    let form = layui.form

    form.verify({
        nickname: function(value) {
            if (value.length > 6) return '昵称长度必须在 1 ~ 6 个字符之间！'
        }
    });

    initUserInfo()

    // 2.初始化用户的基本信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) return layui.layer.msg()('获取用户信息失败！')
                console.log(res)

                // 2.1.使用form.val方法快速为表单赋值
                form.val('formUserInfo', res.data)
            }
        });
    };
    // 3.实现表单的重置效果
    $('#btnReset').click(e => {
        // 阻止表单的默认重置行为
        e.preventDefault()
        initUserInfo()
    });
    // 4.发起请求更新用户的信息
    // 4.1监听表单的提交事件
    $('.layui-form').on('submit', function(e) {
        // 阻止表单的默认提交行为
        e.preventDefault()

        // 发起 ajax 数据请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $('.layui-form').serialize(),
            success: function(res) {
                if (res.status !== 0) return layui.layer.msg('更新用户信息失败！')
                layui.layer.msg('更新用户信息成功！')

                // <iframe>中的子页面，如果想要调用父页面中的方法，使用 window.parent 即可
                // 调用父页面中的方法，重新渲染用户的头像和用户的信息
                window.parent.getUserinfo()
            }
        })
    })
})