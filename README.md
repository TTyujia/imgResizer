# imgResizer
基于jQuery实现的裁剪图片插件
# 应用场景
有时候，我们需要固定尺寸大小的图片显示在网页上，然后上传到服务器。但是我们选择的图片尺寸往往与这个尺寸不符，所以需要我们进行裁剪，导入当前的js进我们的系统，就可以避免使用其他工具，直接在网页上，即可实现图片的简单编辑。
# 代码
```
<!-- 依赖于jQuery -->
<script type="text/javascript" src="jquery-3.2.1.min.js"></script>
<script type="text/javascript" src="jquery.img-resizer.js"></script>

<img id="show_pic" src=""><button onclick="window.ImaResizer.show();">选择图片</button>

<!-- Something else -->
<script type="text/javascript">
    $.initImgResizer({
        imgWidth : 500, // 指定要裁剪的目标大小
        imgHeight : 250,
        onConfirm : function (base64Img) {
            // 裁剪结束后
            $("#show_pic").prop("src", base64Img).on("load", function () {
                console.log($(this).width(), $(this).height());
            });
        }
    });
    // 显示对话框
    window.ImaResizer.show();
</script>
```
