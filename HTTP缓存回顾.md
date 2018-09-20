# HTTP缓存回顾

http缓存是一种网络请求的机制，通过备份网络资源的方式解决*再次请求时*的效率问题。

每次请求从发送信息到接收响应中间的很多网络环节都可以做缓存，按照缓存资源面向的用户群体分为两类：

- 私有缓存，资源针对单个用户，如浏览器缓存
- 共享缓存，资源针对多个用户，如ISP缓存

通俗的讲浏览器、路由器、ISP等等都可以做缓存。

## 缓存应用的对象

http缓存应用基本局限于*GET*方式的请求，常见的几种可以运用缓存的响应：
- *200(OK)*的*GET*响应，返回内容包含HTML、图片或其他文件。
- *301(Moved Permanently)*的永久重定向。
- *404(Not Found)*页面
- *206(Partial Content)*分块的未结束的响应
- 定义了缓存key的非*GET*请求的响应

## 缓存的控制

可以在网络请求的请求/响应头中设置**Cache-Control**指令来分别设置缓存机制。

客户端可用的标准请求头指令

        Cache-Control: max-age=<seconds>
        Cache-Control: max-stale[=<seconds>]
        Cache-Control: min-fresh=<seconds>
        Cache-Control: no-cache
        Cache-Control: no-store
        Cache-Control: no-transform
        Cache-Control: only-if-cached

服务端可用的标准响应头指令

        Cache-Control: must-revalidate
        Cache-Control: no-cache
        Cache-Control: no-store
        Cache-Control: no-transform
        Cache-Control: public
        Cache-Control: private
        Cache-Control: proxy-revalidate
        Cache-Control: max-age=<seconds>
        Cache-Control: s-maxage=<seconds>

注意：
- *no-cache* 强制要求发送请求到原始服务器做校验。
- *max-age* 以秒为单位，是相对于请求时间的一个数字。
- 以上某些选项只对*共享缓存*生效，如*s-maxage*。
- 每次网络请求可能会经过多层中间缓存，无论是客户端（user agent）还是服务端（origin server）发出的指令都会影响传输过程中的所有缓存。

## 缓存有效期

缓存的有效期基于多个头部信息计算，计算规则如下：

1. 如果指定 *"Cache-control: max-age=N"*，有效期即为*N*。
2. 以上无，则从头信息中查找并计算*Expires*减去*Date*，差值即为有效期。
3. 以上无，则从头信息中查找并计算*Date*减去*Last-Modified*

详见[【RFC 7234#Calculating Freshness Lifetime】](https://tools.ietf.org/html/rfc7234#section-4.2.1)

## 缓存校验

到达缓存内容的过期时间后，内容需要被验证或者重新获取。只有在服务端返回*强校验器*或者*弱校验器*时缓存才会校验。参见 [Validators](https://developer.mozilla.org/en-US/docs/Web/HTTP/Conditional_requests#Validators)

**[ETag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag)** 响应头可以用作强校验器，在客户端再次发请求时作为请求头 [If-None-Match](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-None-Match) 的值传给服务端进行校验。

**[Last-Modified](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Last-Modified)** 响应头可以用作弱校验器，客户端再次发请求时作为请求头 [If-Modified-Since](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Modified-Since) 的值传给服务端校验。

服务端在验证时可以返回普通的响应状态*200*，也可以返回没有body的[304](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/304)响应状态表示客户端可以继续使用缓存文件，并更新被缓存文件过期时间。
