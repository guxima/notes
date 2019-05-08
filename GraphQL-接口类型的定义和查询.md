# GraphQL-接口类型的定义和查询

如果你在*GraphQL schema*中定义了*interface*并且有相关的*implements*对象类型，那么在请求中就可以查询该接口类型或者实现了该接口的其他对象类型的数据。看个例子：
```javascript
import {graphql, buildSchema} from 'graphql'

const schemaText = `
    type Query {
        fruits: Fruit 
    }

    interface Fruit {
        id: ID!
        name: String
    }

    type Apple implements Fruit {
        id: ID!
        name: String
        price: Int
    }
`;
const schema = buildSchema(schemaText);
const query = `
    query fruits {
        fruits{ 
            id
            name
        }
    }
`;
const rootValue = {
    fruits: () => { 
        return {id: 'YmFubmF', name: 'cherry', price: 6}
    }
};

graphql(schema, query, rootValue).then( ret => {
    console.log(ret );
})
```
可能出乎你的意料，以上代码会报错:

`GraphQLError: Abstract type Fruit must resolve to an Object type at runtime for field Query.fruits with value { id: "YmFubmF", name: "cherry", price: 6 }, received "undefined". Either the Fruit type should provide a "resolveType" function or each possible type should provide an "isTypeOf" function.`

错误提示的内容是有指导意义的，在实例化`GraphQLInterfaceType`或`GraphQLObjectType`对象的时候添加特定的方法可以解决问题，但是上例中我们使用`buildSchema(...)`的方式是没有办法注入任何一个方法的。关于这个问题的讨论参见 [Issue 1379](https://github.com/graphql/graphql-js/issues/1379)。

目前的解决办法是在*resolver*的增加属性`__typename`并设置为正确的*对象类型*。上例部分代码修改如下：
```javascript
// 修改resolver
const rootValue = {
    fruits: () => { 
        return {id: 'YmFubmF', name: 'cherry', price: 6, __typename: 'Apple'}
    }
};
```
再次运行会得到正确结果！这里有个疑问假设我们想查询*Apple*对象类型的*price*字段，能在*query*中直接增加么？
```javascript
// query中增加price字段
const query = `
    query fruits {
        fruits{ 
            id
            name
            price
        }
    }
`;
```
运行后发现上述修改会报错：`GraphQLError: Cannot query field "price" on type "Fruit". Did you mean to use an inline fragment on "Apple"?`，按照提示进行修改后
```javascript
// query中增加price字段
const query = `
    query fruits {
        fruits{ 
            id
            name
            ... on Apple {
                price
            }
        }
    }
`;
```
**接口类型对象多用在*resolver*返回的对象类型不同但是又需要统一处理结果的情况。请求的查询字段范围只能限定在接口定义的范围内。如果想额外返回不同对象类型的特定字段，则需要通过在查询中使用*inline fragment*实现。**