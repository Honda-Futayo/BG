$(() => {
    // 1.1注册页面的点击跳转事件
    $("#link_reg").click(() => {
        $(".login-box").hide();
        $(".reg-box").show();
    });

    // 1.2登录页面的点击跳转事件
    $("#link_login").click(() => {
        $(".login-box").show();
        $(".reg-box").hide();
    });

    // 2.设置表单的自定义验证
    // 2.1从layui中获取form对象
    let form = layui.form;

    // 2.2通过form.verify()函数自定义校验规则
    form.verify({
        // 2.3密码的自定义校验
        pass: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
        // 2.4确定密码的自定义校验
        repass: value => {
            let reval = $('.reg-box [name=password]').val()
            if (reval !== value) return "两次密码不一致"
        }
    });

    // 3.发起注册用户的Ajax请求
    // 3.1使用layer提示消息
    let layer = layui.layer;
    // 3.2监听注册表单的提交事件
    $('#reg-form').on('submit', e => {
        // 3.3阻止表单的默认提交行为
        e.preventDefault()

        // 3.4发起Ajax的POST请求
        // 获取数据发起请求
        let data = {
            username: $('.reg-box [name=username]').val(),
            password: $('.reg-box [name=password]').val()
        };
        const url = '/api/reguser';
        $.ajax({
            type: "POST",
            url: url,
            data: data,
            success: res => {
                if (res.status !== 0) return layer.msg(res.message)
                layer.msg('注册成功，请登录！')

                // 3.5触发去登录的点击事件
                $("#link_login").click()

                // 3.6清空注册页面的表单数据
                $('#reg-form')[0].reset()
            }
        });
    });
    // 4.发起登录的Ajax请求
    // 4.1监听登录表单的提交事件
    $('#login-form').on('submit', e => {
        // 4.2阻止表单的默认提交行为
        e.preventDefault()

        // 4.3发起Ajax的POST请求
        // 获取数据发起请求
        let data = $('#login-form').serialize();
        console.log(data);
        const url = '/api/login';
        $.ajax({
            type: "POST",
            url: url,
            data: data,
            success: res => {
                console.log(res);
                if (res.status !== 0) return layer.msg(res.message)
                layer.msg(res.message)

                // 4.4清空注册页面的表单数据
                $('#login-form')[0].reset()

                // 4.5将登录成功得到的 token 字符串，保存到 localStorage 中
                localStorage.setItem('token', res.token)

                // 4.6跳转到后台主页
                location.href = '/index.html'
            }
        });
    });
})