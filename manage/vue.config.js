module.exports = {
    baseUrl: './',
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/manage':{
                //target:'http://127.0.0.1:8080',
                target:'http://192.168.5.34:8080',
                changeOrigin:true,
                // pathRewrite:{
                //     '/api':''
                // }
            },
        }
    }
}