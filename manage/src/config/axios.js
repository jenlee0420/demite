import axios from 'axios';
import qs from 'qs'

axios.defaults.baseURL = '/manage'
axios.interceptors.request.use(function (request) {
    request.header = Object.assign({}, {'Content-Type': 'application/x-www-form-urlencoded'}, request.header)
    if (request.method === 'post') {
        // request.data = qs.stringify(request.data)
    }
    return request
}, function (error) {
    return Promise.reject(error)
});
axios.interceptors.response.use(function (response) {
    if (response.statusCode === 200) {

    }
    if (process.env.NODE_ENV === 'development' && response.data.status.haserror) {
        // alert(response.data.status.errordesc)
    }
    return response.data
}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error)
});