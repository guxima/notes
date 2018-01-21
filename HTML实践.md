# HTML 实践
不同人的HTML编码时风格迥异，总结一些有益的应用实践。
## 标签&属性
1. 表单元素加上`name`属性，即符合语义又可作为CSS样式选择器避免引入过多的`class`。
    
    通过`input[name=age]`即可以获取JS引用又可以定制CSS样式。

        <input type='text' name='age' />
        <style>
            input[name=age]{
                color:blue;
            }
        </style>
2. 使用`details`标签和`open`属性实现内容折叠效果。

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
        
3. 使用属性`hidden`实现元素的隐藏显示。

        <h4 hidden>看不见的标题</h4>
        <a hidden>看不见的链接</a>
        <button hidden>看不见的表单元素</button>
4. `img`元素的属性`width`和`height`设置渲染尺寸，实际尺寸可以通过`naturalWidth`和`naturalHeight`获取。
        
        <!--以下图片在页面上显示宽：68px，高：27px。-->
        <img id='img' src='https://source.qunarzz.com/common/hf/logo.png' width='68' height='27' alt='logo'/>
        <script>
            //通过DOM属性可以获取到图片的实际尺寸宽：136px，高：54px。
            var image = document.querySelector('#img');
            alert([image.naturalWidth, image.naturalHeight]);
        </script>
5. 不能手动修改value的`input`元素，类型选button，避免readOnly属性兼容性问题。

    &lt;input type='button' value='' /&gt; NOT <del>&lt;input type='text' readOnly /&gt;</del>
    