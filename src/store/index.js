import Vue from "vue"
import vuex from "vuex"
import axios from "axios"
Vue.use(vuex);
export default new vuex.Store({
    state : {
        timer : undefined,
        clockStatus : '暂停',
        setClocks : '',
        musicName :'../../../static/music/MYKOOL - Tabi.mp3',
        clockArr : [],
        resTime : [],
        image : [],
    },
    mutations : {
        setSession ($store,obj) {
            sessionStorage.setItem(obj[0],JSON.stringify(obj[1]));
        },
        remSession (name) {
            sessionStorage.removeItem(name);
        },
    },
    actions : {
        getRing () {
            axios.get('http://route.showapi.com/819-1',{
                    params : {
                        showapi_appid : 63173,
                        showapi_sign : '0bb1d16039114805b2fb79401e992183',
                        type : 34,
                        num : 20,
                        page : 1
                    }
              }).then(data => {
                this.state.image = data.data.showapi_res_body;
            })//这是福利
        }
    }
})