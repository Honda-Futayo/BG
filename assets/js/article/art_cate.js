$(() => {
    // 1.获取并使用模板引擎渲染表格的数据
    // 1.1请求接口获得数据
    initArtCateList()

    function initArtCateList() {
        $.ajax({
            type: "get",
            url: "/my/article/cates",
            success: function(res) {
                // 1.2使用模板引擎渲染表格的数据
                let htmlStr = template('tpl-article', res)
                    // 1.3渲染html结构
                $('.layui-table tbody').html(htmlStr)
            }
        });
    }
    // 2.添加类别的点击事件
    let indexAdd = null
    $('#btnAdd').on('click', () => {

        // 2.1使用open弹出层，type=1,title=头部名字,content=内容，用模板引擎做,area=弹出层的大小
        indexAdd = layui.layer.open({
            type: 1,
            title: '添加文章分类',
            content: $('#tpl-open').html(),
            area: ['500px', '250px']
        });
    });

    // 2.2监听提交事件
    $('body').on('submit', '#open-form', (e) => {
        e.preventDefault()

        // 2.3发起ajax请求
        $.ajax({
            type: "post",
            url: "/my/article/addcates",
            data: $('#open-form').serialize(),
            success: function(res) {
                console.log(res);
                if (res.status !== 0) return layui.layer.msg('新增分类失败！')
                    // 重新渲染
                initArtCateList()
                layui.layer.msg('新增分类成功！')

                // 2.4根据索引，关闭对应的弹出层
                layui.layer.close(indexAdd)
            }
        });
    });

    // 2.5添加重置的点击事件
    $('#liRes').on('click', e => {
        e.preventDefault()
        $('#open-form')[0].reset()
    });

    // 3.编辑和删除的点击事件
    // 3.1编辑
    let indexEdit = null
    let form = layui.form

    $('tbody').on('click', '.btn-edit', function() {

        // 3.2获取点击编辑按钮的自定义id属性的值用于ajax请求
        let id = $(this).attr('data-id')
        indexEdit = layui.layer.open({
                type: 1,
                title: '修改文章分类',
                content: $('#tpl-bianJi').html(),
                area: ['500px', '250px']
            })
            // 3.3将数据渲染到弹出的表格中
        $.ajax({
            type: "get",
            url: "/my/article/cates/" + id,
            success: function(res) {
                //3.4给表单赋值
                form.val("bianJi-form", res.data);

            }
        });
    });

    // 3.5监听提交事件
    $('body').on('submit', '#bianJi-form', e => {
        e.preventDefault()

        // 3.6发起ajax请求
        $.ajax({
            type: "post",
            url: "/my/article/updatecate",
            data: $('#bianJi-form').serialize(),
            success: function(res) {
                console.log(res);
                if (res.status !== 0) return layui.layer.msg('更新分类信息失败！')
                    // 3.7重新渲染
                initArtCateList()
                layui.layer.msg('更新分类信息成功！')

                // 3.8根据索引，关闭对应的弹出层
                layui.layer.close(indexEdit)
            }
        });
    });
    // 4.删除
    $('tbody').on('click', '.btn-delete', function() {
        let id = $(this).attr('data-Id')
            // 4.1点击后弹出对话框确定是否删除
        layui.layer.confirm('确定删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            // 4.2发起ajax请求
            $.ajax({
                type: "get",
                url: "/my/article/deletecate/" + id,
                success: function(res) {
                    if (res.status !== 0) return layui.layer.msg('删除文章分类失败！')

                    // 4.3重新渲染
                    initArtCateList()
                    layui.layer.msg('删除文章分类成功！')
                }
            });
            layer.close(index);
        });
    });
});