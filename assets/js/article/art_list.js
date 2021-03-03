$(function() {

    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
    let q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }
    initList()

    // 1.获取文章列表渲染到页面
    function initList() {
        // 1.1发起ajax请求
        $.ajax({
            type: "get",
            url: "/my/article/list",
            data: q,
            success: function(res) {
                if (res.status !== 0) return layui.layer.msg('获取文章列表失败！')

                //1.2使用模板引擎
                let tplhtml = template('tpl-li', res)
                $('tbody').html(tplhtml)

                // 调用渲染分页的方法   
                initPage(res.total)
            }
        });
    };

    // 2.封装时间处理函数
    template.defaults.imports.initTime = function(date) {
        let time = new Date(date)
        let y = time.getFullYear()
        let m = ling(time.getMonth() + 1)
        let d = ling(time.getDate())
        let h = ling(time.getHours())
        let f = ling(time.getMinutes())
        let s = ling(time.getSeconds())
        return y + '-' + m + '-' + d + ' ' + h + ':' + f + ':' + s
    };

    // 2.1补零函数
    function ling(a) {
        return a < 10 ? '0' + a : a
    };

    // 3.初始化筛选文章分类的方法
    initCate()

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) return layui.layer.msg('获取分类数据失败！')
                    // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)

                // 通过 layui 重新渲染表单区域的UI结构
                // 有些时候， 你的有些表单元素可能是动态插入的。 这时 form 模块 的自动化渲染是会对其失效的。 虽然我们没有双向绑定机制（ 因为我们叫经典模块化框架， 偷笑.gif） 但没有关系， 你只需要执行 form.render(type, filter);方法即可。
                // 第一个参数： type， 为表单的 type 类型， 可选。 默认对全部类型的表单进行一次更新。 可局部刷新的 type 
                layui.form.render()
            }
        })
    };

    // 4.实现筛选的功能
    $('#form-search').on('submit', function(e) {
        e.preventDefault()

        // 获取表单中选中项的值
        let cate_id = $('[name=cate_id]').val()
        let state = $('[name=state]').val()

        // 为查询参数对象 q 中对应的属性赋值
        q.cate_id = cate_id
        q.state = state

        // 根据最新的筛选条件，重新渲染表格的数据
        initList()
    })

    // 5.分页的渲染
    function initPage(total) {
        layui.laypage.render({
            elem: 'pageBox',
            count: total,
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 设置默认被选中的分页
            limits: [2, 3, 5, 10],
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            jump: function(obj, first) {
                //obj包含了当前分页的所有参数，比如：
                //console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                //console.log(obj.limit); //得到每页显示的条数
                q.pagenum = obj.curr
                q.pagesize = obj.limit

                if (!first) {
                    initList()
                }
            }
        })
    };

    // 6.实现删除文章的功能
    $('tbody').on('click', '.btn-delete', function() {
        let len = $('.btn-delete').length
        let id = $(this).attr('data-id')

        layui.layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                type: "get",
                url: "/my/article/delete/" + id,
                success: function(res) {
                    console.log(res);
                    if (res.status !== 0) return layui.layer.msg('删除失败！')
                    layui.layer.msg('删除成功！')
                    if (len === 1) {
                        // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
                        // 页码值最小必须是 1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initList()
                }
            });
            layui.layer.close(index)
        });
    });

    // 7.实现编辑文章
    // 7.1点击编辑按钮的点击事件
    $('tbody').on('click', '#btn_bJ', function() {
        let id = $(this).attr('data-id')
            // 7.2发起ajax请求
        $.ajax({
            type: "get",
            url: "/my/article/" + id,
            success: function(res) {
                if (res.status !== 0) return layui.layer.msg('编辑文章失败！')
                location.href = '/article/art_pub.html?id=' + id
            }
        });
    });

})