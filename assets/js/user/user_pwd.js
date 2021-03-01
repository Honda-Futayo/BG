$(() => {
    // 1.为密码框定义校验规则
    let form = layui.form
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        samePwd: value => {
            if (value === $('[name=oldPwd]').val()) return '新旧密码不能一致'
        },
        rePwd: value => {
            if (value !== $('[name=newPwd]').val()) return '两次密码不一致'
        }
    });
    $('#btnRes').click(e => {
        e.preventDefault()
        $('.layui-form')[0].reset()
    })
    $('.layui-form').on('submit', e => {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $('.layui-form').serialize(),
            success: function(res) {
                if (res.status !== 0) return layui.layer.msg('更新密码失败！')
                    // layui.layer.msg('更新密码成功！')

                // 重置表单
                $('.layui-form')[0].reset()

                //密码重置后跳转登录页面
                layui.layer.alert('更新密码成功！请重新登录', function(index) {
                    //do something
                    // 清除token
                    localStorage.removeItem('token')

                    // 跳转到登录页面
                    window.parent.location.href = '/login.html'
                    layer.close(index);
                });
            }
        })
    })
})