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
    applystatus(str){
        if(!str) return
        let re = ''
        switch(str){
            case 'applying':
                re = '申请中'
                break;
            case 'unlock':
                re = '已解锁'
                break;
            case 'refuse':
                re = '已拒绝'
                break;
        }
        return re
    }      ,
    applystatus2(str){
        if(!str) return
        let re = ''
        switch(str){
            case 'applying':
                re = '申请中'
                break;
            case 'comfirm':
                re = '已确认'
                break;
            case 'finish':
                re = '已完成'
                break;
            case 'refuse':
                re = '已拒绝'
                break;
        }
        return re
    } 
}
export default filters;