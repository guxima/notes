# React 拾遗
  react对“View”层的实现值得学习，无论是设计思想还是实现细节都有可取之处。经过一段时间的使用(@v15.6)结合自己的一些思考得此小结。
## JSX
  从抵触到接纳经历了很长时间，初见时只觉语法不伦不类，尽管表现惊人也不打算考虑使用。随着ES6、babel大规模使用，加之代码编写规范化亟待解决，JSX最终得以使用。由此看来我的使用全是ES6语法及转换工具的发展促使。
- JSX是一种表达式，尽管看起来像某种特殊的HTML或XML，但在其所处的runtime里它是一种特殊的*表达式*，就像Javascript语言表达式一样有自己的解析规则、执行顺序等。把它当作**标记语言**可能更容易理解，可以非常清晰的表现出元素类型、属性枚举、嵌套关系等。
- JSX tag 决定了当前组件的类型，即`<TagName />`中的TagName，不同于HTML&[Custom element](https://www.w3.org/TR/custom-elements/#valid-custom-element-name)，自定义Tag必须以大写字母开头。
- JSX Props 和HTML属性名不同，React DOM使用`camelCase`
  - Props 默认值是`true`,仅指定属性名时
  - 字符串属性可以用`quotes`设置，其它通过`curly braces`。设定方式决定了组件内部获取到的值的类型如`<Tag pa='false' pb={false} />`
- JSX Children 通过嵌套的形式表达父子层级关系及渲染内容，当有条件判断逻辑时返回值类型决定了渲染逻辑
  - javasript表达式、函数都可以作为children，表达式会返回渲染的内容，而函数则是对`props.children`属性赋值，由此可见children可以是任意值。
  - 这些被忽略：`true | false | null | undefined`
  - 这些被渲染： `0 | '' | ""` [falsy values](https://developer.mozilla.org/en-US/docs/Glossary/Falsy)，起初搞不明白还跑去[React discuss](https://discuss.reactjs.org/t/falsy-values-confused-me/8098)发帖。
- 自定义Tag编译后在执行时会生成*React Elements*，根据这些元素*React DOM*负责更新内容至DOM节点。反过来看，react希望UI开发focus在对*React Elements*的处理上，由此产生改变前后的差异，进而由其内部操作更新DOM，dev无需关心具体的DOM操作，听起来令人激动。
## 组件
  不同于`Web Component` ，react组件有自己的设计原则。如同javascript函数一样接收任意的输入（props）然后输出`React elements`用于描述视图展现。这一切都是通过JSX来表达。

  组件的扩展方式强调组合优于继承，单一组件只完成单一功能。
## Props
- props的命名应该遵循组件的内部使用而不是其所处的上下文。
- 传值给子组件时，类型为內联函数可能会造成子组件的重复渲染，如`<ChildElement callback={()=>doSth()} />`，随着父组件渲染*callback*每次都会新创建。
- props可以设定默认值，*class component* 声明之后使用 `ClassComponent.defaultProps={k:v}`
## State
- state是和props相似的一个组件内部的特殊属性对象，由组件私有并完全控制。
- state存储的属性应该是用于`render()`里的，否则不要存在state里。组件上可以手动设置任意属性。
- 连续的`setState({s:v})`调用不会多次更新组件视图，对于响应性要求较高的界面不适合通过state更新。
- `this.state`的值是异步更新，如基于它的值计算下一次state，可以用`setState((prevState, props) => {s: v(prevState.s) } )`
- 通过state实现组件的单向数据流，自顶向下。组件拥有的state只能向下影响组件树上的数据或者UI
- *lifting state up* 在react的设计实现中，组件之间共享state必须把它上升到两组件最近的上层父组件中，依靠自顶向下的数据流实现。
## Key
Key帮助React在组件`render()`时辨别集合中的单个元素用作比较，但是`ReactDOM.render()`直接渲染时集合中的元素不需要key
## Refs
refs提供了一种props之外的父子组件交互形式
- 只能被用于*DOM elements*和*class components*，不能用于*functional components*。
- 避免使用，更不要过度使用
- refs callback为內联函数时，每当组件更新就会被调用两次，ref首先返回null给之前的callback用于清除旧值，再返回元素引用给新的callback设置新值。
## Context
类似*上下文*的概念，react组件设计的这种机制，可以实现组件树自某个节点自动向下传值，这种方式突破了嵌套节点传值通过props声明的界限，一直隐式的*贯穿*至末端的所有叶子节点，非常强大。
- 自节点向下传值`class components`需做两件事情
  - 声明成员函数 `getChildContext()`，由它返回的对象将作为**Context**实体向下传递
  - 声明类静态属性 `ClassComponents.childContextTypes`，是对以上返回对象的**全部字段**的类型约束，类型种类参见[prop-types](https://www.npmjs.com/package/prop-types)
- 任何子节点都可以引用context，需在引用前增加子节点`ClassComponents.contextTypes`字段类型约束，然后通过`this.context`获取属性值，否则context结果为`{}`
- 向下传递过程中context可以被修改，方法同定义
- context的更新需要借助于更新组件的*props*或者*setState()*，每次更新时都会调用`getChildContext()`，更新后的值会自上而下的反馈到所有子树节点。
