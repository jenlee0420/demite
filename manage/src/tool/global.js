import axios from 'axios'

const global = {
    displayJSON(str) {
        if (!str) { return }
        let data = JSON.parse(str)
        return data
    },
    getImg(id) {
        this.downloadImg(id).then(res=>{
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
    }
}
export default global;