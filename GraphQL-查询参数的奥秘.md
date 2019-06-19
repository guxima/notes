# GraphQL-查询参数的奥秘

我们知道*rootValue*中的*resolver*方法和*Schema*中的查询入口*Query*或者*Mutation*是一一对应的，而且查询支持客户端传参数，那么*resolver*中如何接收这些参数呢？看个查询传参的例子：
```javascript
import {graphql, buildSchema} from 'graphql'

const schemaText = `
    type Query {
        fruits(id: ID = "ZnJ1aXQ"): Fruit # Schema定义查询可以接收的参数列表
    }

    type Fruit {
        id: ID!
        name: String
    }
`;
const schema = buildSchema(schemaText);
const query = `
    query fruits {
        fruits(id: "YmFubmF") { # 客户端查询声明传参
            id
            name
        }
    }
`;

const rootValue = {
    fruits: (args, ctx, info) => {  // resolver 方法接收到的参数列表
        const cols = [
            {id: 'ZnJ1aXQ', name: 'apple' },
            {id: 'YmFubmF', name: 'cherry' }
        ];

        return cols.find( item => (item.id === args.id ))
    }
};

graphql(schema, query, rootValue).then( ret => {
    console.log(ret ); //{ data: { fruits: { id: 'YmFubmF', name: 'cherry' } } }
})
```
**有四个地方需要注意，我们对照上例代码讲解下：**

首先是*Schema*中查询接口的参数定义，**定义参数需要声明类型，参数可以有默认值**，上例中*Schema*定义了*fruits*查询，并声明参数*id*，且*id*默认值为*ZnJ1aXQ*。
```
const schemaText = `
    type Query {
        fruits(id: ID = "ZnJ1aXQ"): Fruit 
    }
    ...
```
其次是客户端请求中，携带的查询参数，上例中*query*字符串声明携带参数`id="YmFubmF"`。
```javascript
const query = `
    query fruits {
        fruits(id: "YmFubmF") {
            id
            name
        }
    }
`;
```
无论是*Schema*还是*query*有个细节需要注意，**参数值如果是字符串必须使用双引号围绕**！！否则会遇到`GraphQLError: Syntax Error: Unexpected single quote character ('), did you mean to use a double quote (")?`

第三个地方是*resolver*接收参数
```javascript
const rootValue = {
    fruits: (args, ctx, info) => { 
        const cols = [
            {id: 'ZnJ1aXQ', name: 'apple' },
            {id: 'YmFubmF', name: 'cherry' }
        ];

        return cols.find( item => (item.id === args.id ));
    }
};
```
可以看到我们定义的*resolver*方法`fruits(args, ctx, info)`接收了三个参数，各个参数的释义如下：
- args：*resolver*的这个参数就是用来接收客户端参数的。本例中参数`args = {id: 'YmFubmF'}` **它是客户端所有请求参数的集合，参数以*key:value*的形式保存，类型与*Schema*中定义的一致**。
- ctx：*GraphQL*执行的时候传递的上下文变量。
- info：包含节点信息的对象集合，如*fieldName*，*fieldNodes*等字段相关信息和*schema*，*rootValue*等运行时信息。详见以下：
```
// ResolveInfo keys
{
    fieldName: fieldDef.name,
    fieldNodes: fieldNodes,
    returnType: fieldDef.type,
    parentType: parentType,
    path: path,
    schema: exeContext.schema,
    fragments: exeContext.fragments,
    rootValue: exeContext.rootValue,
    operation: exeContext.operation,
    variableValues: exeContext.variableValues
}
```

最后是*resolver*方法`fruits(...)`的返回值，上例中我们直接返回了一个对象字面量（`{id:'...', name:'...'}`）,如果我们返回的字段值是*函数*会怎么样呢？我们修改`rootValue`如下：
```javascript
const rootValue = {
    fruits: (args, ctx, info) => { 
        return {
            id: (args, ctx, info) => {
                //do something like fetch or sum
            },
            name: (args, ctx, info) => {
                //follow as id
            }
        }
    }
};
```
可以看到之前的字面量形式的*id*，*name*字段都改成了函数，并且都可以成为该字段的*resolver*，同理每个`rootValue`的字段都可以根据需要改成*resolver*的形式，这样可以极大的扩展`rootValue`的组织形式。
