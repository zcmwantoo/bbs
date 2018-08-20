var http = require('http')

var server = http.createServer()

var fs = require('fs')

var template = require('art-template')
var url = require('url')
var items = []
server.on('request', function (request,response) {
    //将url地址转换为方便操作的对象,第二个参数如果是真的，查询属性总是被设置为querystring模块的parse（）方法返回的对象。
    // 如果是假的，返回的URL对象上的查询属性将是一个未解析的、未解码的字符串。默认值为false。
    var parseObj = url.parse(request.url,true)

    var pathname = parseObj.pathname

    if(pathname === '/') {
        fs.readFile('./view/index.html', function (err,data) {
            if(err) {
                return response.end('404')
            }
            data = template.render(data.toString(),{
                items: items
            })
            response.end(data)
        })
    } else if(pathname === '/post') {
        fs.readFile('./view/post.html', function (err,data) {
            if(err) {
                return response.end('404')
            }
            response.end(data)
        })
    } else if(pathname === '/login') {
        fs.readFile('./view/login.html', function (err,data) {
            if(err) {
                return response.end('404')
            }
            response.end(data)
        })
    } else if(pathname.indexOf('/static') === 0) {
        fs.readFile('.' + pathname, function (err,data) {
            if(err) {
                return response.end('404')
            }
            response.end(data)
        })
    } else if(pathname === '/comment') {
        var item = parseObj.query
        item.time = new Date()

        items.unshift(item)

        //重定向跳转到首页
        //        当用户重新请求/的时候，数组中的数据已经发生变化，用户看到的数据同步到页面


        //    如何通过服务器让用户重定向
        //      1.状态吗设置302临时重定向
        //    statusCode
        //      2.在响应头中通过location告诉客户端往哪儿重定向
        //    setHeader
        //    如果客户端发现收到服务器的响应的状态吗是302就会自动去响应头去找location，
        // 然后对该地址发起新的请求
        response.statusCode = 302
        response.setHeader('Location', '/')
        response.end()
    }



})

server.listen(5000,function () {
    console.log('server is running,Port number is 5000')
})