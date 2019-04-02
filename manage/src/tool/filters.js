import axios from 'axios'

const filters = {
    displayJSON : function(str){
        console.log(str,'////...')
        if(!str){ return}
        let data = JSON.parse(str)
        let res=''
        data.forEach(e => {
            res+='<span>'+e.key+"</span><span>"+e.value+"</span>"
        });
        return data
    },
    
}
export default filters;