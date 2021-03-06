import wepy from 'wepy'
import qs from 'qs'
/* 当前模式 */
let mode = 'dev'

const config = {
    dev: {
        api: {
            default: 'http://118.24.75.118:8080'
            //default:'http://192.168.5.60:8080'
        },
        imgUrl:'http://test.cn/'
    },
}
let currentConfig = config[mode]

const init = {
    /*拦截器*/
    intercept: [
        /*网络请求拦截处理*/
        {
            name: 'request',
            data: {
                config(request) {
                    /* baseUrl > urlKey > defaultMode */
                    let data = request.data
                    let baseUrl = currentConfig.api.default
                    let token = wepy.getStorageSync('token')
                    let cookie= wepy.getStorageSync('Cookie')
                    if (request.urlKey) baseUrl = currentConfig.api[request.urlKey]
                    if (request.baseUrl !== undefined) baseUrl = request.baseUrl
                    request.url = baseUrl + request.url
                    // request.header = Object.assign({}, {'Content-Type': 'application/x-www-form-urlencoded'}, request.header)
                    request.header = Object.assign({}, {'Content-Type': 'application/json;charset=UTF-8'}, request.header)
                    request.header = Object.assign({}, {'Cookie': cookie}, request.header)
                    // if (!request.noToken && !!token){
                    //     if(data){
                    //         data.token = token
                    //     }
                    //     // request.data = Object.assign({'token':token}, request.data)
                    // }
                    // if (request.method === 'POST') {
                    //     request.data = qs.stringify(data)
                    // }
                    return request
                },
                success(response, re) {
                    /*if( response.code != 1 ){
                        wepy.clearStorageSync()
                    }*/
                    if (response.statusCode === 200) {
                        if(response.header['Set-Cookie']){
                            wepy.setStorageSync('Cookie',response.header['Set-Cookie'])
                        }
                        
                        // if(response.data.code){
                        //     response.data.code = String(response.data.code)
                        // }
                        return response.data
                    } else {
                        let msg = `服务器异常错误码：${response.statusCode}，联系管理员`
                        wepy.showModal({content:msg,showCancel:false})
                        throw `服务器异常错误码：${response.statusCode}，联系管理员`
                    }
                },
                fail(err,re) {
                    return err
                }
            }
        }
    ]
}

module.exports = {config, init, mode}
