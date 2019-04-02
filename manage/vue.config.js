module.exports = {
    baseUrl: './',
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/manage':{
                // target:'http://127.0.0.1:8080',
                target:'http://192.168.5.7:8080',
                changeOrigin:true,
                // pathRewrite:{
                //     '/api':''
                // }
            },
            '/ms':{
                target: 'https://www.easy-mock.com/mock/592501a391470c0ac1fab128',
                changeOrigin: true
            }
        }
    }
}