$(function() {
    // 1.使用模板引擎渲染选择文章类别的下拉选择框
    initxiaL()

    function initxiaL() {
        $.ajax({
            type: "get",
            url: "/my/article/cates",
            success: function(res) {
                if (res.status !== 0) return layui.layer.msg('获取文章分类列表失败！')
                let htmlString = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlString)
                layui.form.render()
            }
        });
    };

    // 2.调用 initEditor() 方法，初始化富文本编辑器
    // 初始化富文本编辑器
    initEditor()

    // 3.图片封面裁剪的实现

    // 3.1. 初始化图片裁剪器
    var $image = $('#image')

    // 3.2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3.3. 初始化裁剪区域
    $image.cropper(options)

    // 3.4上传图片
    $('.layui-btn-danger').on('click', function(e) {
            $('#files').click()


        })
        // 3.5监听change事件
    $('#files').on('change', function(e) {
        var files = e.target.files
        if (files.length === 0) {
            return
        }
        var newImgURL = URL.createObjectURL(files[0])
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 4.发起ajax请求,发表文章
    let state1 = '已发布'

    function tiJiao(fd) {
        $.ajax({
            type: "post",
            url: "/my/article/add",
            data: fd,
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) return layui.layer.msg('发布文章失败！')
                layui.layer.msg('发布文章成功！')

                // 发布文章成功后，跳转到文章列表页面
                location.href = '/article/art_list.html'
            }
        });
    };
    // 4.1点击存为草稿就将state1改为草稿
    $('body').on('click', '.layui-btn-primary', function() {
        state1 = '草稿'
    })

    // 4.2为表单绑定 submit 提交事件
    $('#wZ-form').on('submit', function(e) {
        //  阻止表单的默认提交行为
        e.preventDefault()

        // 基于 form 表单，快速创建一个 FormData 对象
        let fd = new FormData($(this)[0])

        //  将文章的发布状态，存到 fd 中
        fd.append('state', state1)

        // 将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                //  将文件对象，存储到 fd 中
                console.log(blob);
                fd.append('cover_img', blob)

                //  发起 ajax 数据请求
                tiJiao(fd)
            })


    });


    let url_data = location.search
    let aaa = null
    if (url_data.length > 0) {
        url_data = url_data.substr(1).split('=')[1]

        // 发起ajax请求
        $.ajax({
            type: "get",
            url: "/my/article/" + url_data,
            success: function(res) {
                if (res.status !== 0) return layui.layer.msg('编辑文章失败！')
                console.log(res);
                layui.form.val("formTest", res.data);
                console.log(res.data.cate_id);
                // $.ajax({
                //     type: "get",
                //     url: "/my/article/cates",
                //     success: function(r) {
                //         console.log(r);
                //     }
                // });
                // $('#image').attr('src', res.data.cover_img)
            }
        });
    }

})