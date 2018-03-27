# HTML 实践
不同开发人员的HTML编码时风格迥异，总结了一些有益的应用实践。
## 标签&属性
- 表单元素加上`name`属性，即符合语义又可作为CSS样式选择器避免引入过多的`class`。

    通过`input[name=age]`即可以获取JS引用又可以定制CSS样式。

        <input type='text' name='age' />
        <style>
            input[name=age]{
                color:blue;
            }
        </style>
- 不允许用户修改值的表单元素，类型选`button`，避免`readonly`属性兼容性问题。兼容性问题表现在设置了`readonly`的textInput无法通过JS修改其`value`属性值。

    &lt;input type='button' name='readonly' value='' /&gt; NOT <del>&lt;input type='text' readOnly /&gt;</del>

- `form`标签的属性`method`、`action`不能为空。
- 通过`label`内嵌表单元素，可读性好，定制样式方便。
- 使用`details`标签和`open`属性实现内容折叠效果。

        <details>
            <summary>可见的摘要文字小标题1</summary>
            <p>其它的内容默认不可见</p>
            <p>点击summary可以显示隐藏其它内容</p>
        </details>
        <details open>
            <summary>可见的摘要文字小标题2</summary>
            <p>默认展开其它的内容</p>v
            <p>点击summary可以显示隐藏其它内容</p>
        </details>
    控制小标记默认样式：

        details > summary {
            /**系统默认属性
                display: list-item
            */
            list-style: none;
        }
        details > summary::-webkit-details-marker {
            display: none;
        }
    details监听`toggle`事件

        document.querySelector('details').addEventListener('toggle', function(e){
            alert(e.target.open)
        }, false)

- 使用属性`hidden`实现元素的隐藏显示。

        <h4 hidden>看不见的标题</h4>
        <a hidden>看不见的链接</a>
        <button hidden>看不见的表单元素</button>
- `img`元素的属性`width`和`height`设置渲染尺寸，实际尺寸可以通过`naturalWidth`和`naturalHeight`获取。

        <!--以下图片在页面上显示宽：68px，高：27px。-->
        <img id='img' src='https://source.qunarzz.com/common/hf/logo.png' width='68' height='27' alt='logo'/>
        <script>
            //通过DOM属性可以获取到图片的实际尺寸宽：136px，高：54px。
            var image = document.querySelector('#img');
            alert([image.naturalWidth, image.naturalHeight]);
        </script>
- 使用`iframe`时设定属性`width`、`height`和`frameborder`。嵌入页面时外部需要容器元素

        <div class='frame-wrapper'>
            <iframe src='http://fakedomain.com' width='100%' height='100%' frameborder='0'>
        </div>
- 合理设置`script`的标签属性`defer`和`async`；两者都是和HTML解析并行加载资源，其中**async**是加载完中断HTML解析立即执行脚本，defer是等到HTML解析完后执行脚本。
<img alt='' src='https://www.w3.org/TR/2017/REC-html52-20171214/images/asyncdefer.svg' width='690'/>

- 元素样式*class*的处理可以使用`Element.classList`获取一个*DOMTokenList*对象，然后通过对象的方法如*add*，*remove*，*toggle*等操作*class*。
  - 可以避免字符串拼接过程中的空格。
  - *toggle*可以代替判断逻辑。
