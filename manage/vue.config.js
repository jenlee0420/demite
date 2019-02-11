module.exports = {
    baseUrl: './',
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/manage':{
                target:'http://192.168.5.43:8080',
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