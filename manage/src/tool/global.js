import axios from 'axios'

const global = {
    displayJSON(str) {
        if (!str) { return }
        let data = JSON.parse(str)
        return data
    },
    getImg(id) {
        this.downloadImg(id).then(res=>{
            // $loading().close()
            return 'data:image/png;base64,'+res
        })
    },
    getImgSrc(src){
        if(!src) {return}
        return 'data:image/png;base64,'+src
    },
    downloadImg(id){
        return new Promise((resolve, reject) => {
            axios.post('/file/download', {
                id: id
            }).then(res => {
                resolve(res.data)
            })
        })
    },
    transTime(time, opt = 'yyyy-MM-dd hh:mm'){
        if (time === '' || time === undefined) {
            return 0;
        } else {
            var time1 = new Date(time * 1000)
            var time2 = this.dateFormat(time1, opt);
            return time2;
        }
    },
    dateFormat(time1, fmt) {
        var o = {
            "M+": time1.getMonth() + 1, //月份
            "d+": time1.getDate(), //日
            "h+": time1.getHours(), //小时
            "m+": time1.getMinutes(), //分
            "s+": time1.getSeconds(), //秒
            "q+": Math.floor((time1.getMonth() + 3) / 3), //季度
            "S": time1.getMilliseconds() //毫秒
        };
        if (fmt == '' || fmt == undefined) {
            fmt = '';
        } else {
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (time1.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
        return fmt;
    }
}
export default global;