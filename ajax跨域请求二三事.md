# Ajax跨域请求

跨域问题产生的原因在于客户端和服务端不同源导致的，解决要从这两方面入手。

虽然多数情况下可以通过设置*same origin*的形式解决ajax请求数据跨域问题，但是不够硬核，所以整理了移动端ajax跨域请求数据的关键知识点。

## 客户端 XMLHttpRequest.withCredentials

这个属性是用来设置客户端发起跨域请求时是否携带*用户凭证*信息的，诸如浏览器*cookie*，HTTP认证*authorization headers*或者*TLS client certificates*证书。需要注意的是同源请求时这个属性值被忽略。

该属性会影响请求返回的设置*cookie*的效果，默认情况下该值为*false*即不允许通过HTTP响应设置*cookie*，如果想要设置*cookie*则该值需要手动设定为*true*。服务端*cookie*的设定遵循*同源策略*，任何第三方请求的响应只能设定与它*同源*的cookie值，访问机制同理。

## 服务端 HTTP Headers Access-Control-Allow-Origin

浏览器会把客户端的跨域请求发送给服务端，但是会检查服务端返回的响应头*Access-Control-Allow-Origin*是否允许当前*origin*获得数据。

响应头的值可以设定为`*`，表示允许任意*origin*获得响应数据。但是如果请求*with credentials*，则该值必须设定为**单一的origin**，否则会导致请求异常。

## 服务端 HTTP Headers Access-Control-Allow-Credentials

当发起的跨域请求*with credentials*时，服务端的响应头中需要返回该值为`true`，浏览器才会按照响应头设定*cookie*。





