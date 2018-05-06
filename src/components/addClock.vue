<template>
    <div>
        <div class="clock-wrapper">
            <div class="wrapper-content">
                <div class="clock-navigator">
                    <div class="clock-take">
                        <div class="clock-input">
                            <input type="text">
                        </div>
                        <input type="submit" value="新增" class="clock-btn" @click="flag && (show = !show)">
                    </div>
                </div>
                <div class="clock-list">
                    <div class="clock-title">
                        <div>
                            <label>
                                <input type="checkBox" ref="totalChoose" @change="totalChoose">
                            </label>
                        </div>
                        <div>名字</div>
                        <div>时间</div>
                        <div>处理什么事情</div>
                        <div class="clock-control"><span>操作</span></div>
                    </div>
                    <ul class="list-content">
                        <li v-for="(item,index) in arr" :key="index" >
                            <div class="clock-title list" @click="openClock(item,index,$event)">
                                <div>
                                    <label>
                                        <input type="checkBox" ref="choose">
                                    </label>
                                </div>
                                <div class="deal-name">{{item.name}}</div>
                                <div>{{item.time.hour}}:{{item.time.minute}}:{{item.time.second}}</div>
                                <div>{{item.work}}</div>
                                <div class="clock-control">
                                    <div id="control-content">
                                        <div ref="start">开始</div>
                                        <div ref="rem">删除</div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="clock-add" v-if="show">
            <div class="clock-info">
                <div class="add-content">
                    <div>
                        <div>时钟名称：</div>
                        <span v-show="show1">输入名称不符合要求</span>
                        <div class="clock-input" id="set-length" >
                            <input type="text" v-model="vals.name" placeholder="名称长度不超过12个">
                        </div>
                    </div>
                    <div class="set-time">
                        <div>输入需要工作的时间：</div>
                        <span v-show="show2">请输入正确时间</span>
                        <div class="clock-input" id="shot-length">
                            <input type="text" v-model="vals.time.hour" style="text-align:center;" placeholder="时">
                        </div>
                        <div class="clock-input" id="clock-btn"@click="vals.time.minute >= 59 ? vals.time.minute = '0' : ++vals.time.minute">+</div>
                        <div class="clock-input" id="shot-length">
                            <input type="text" v-model="vals.time.minute" style="text-align:center;" placeholder="分">
                        </div>
                        <div class="clock-input" id="clock-btn" @click="vals.time.minute == (0 || '') ? vals.time.minute = 0 : --vals.time.minute" >-</div>
                        <div class="clock-input" id="shot-length">
                            <input type="text" v-model="vals.time.second" style="text-align:center;" placeholder="秒">
                        </div>
                    </div>
                    <div class="work">
                        <div>输入工作内容：</div>
                        <span v-show="show3">输入字符不超过20个</span>
                        <div class="clock-input" id="set-textarea">
                            <input type="text" v-model="vals.work" style="width:98%">
                        </div>
                    </div>
                    <div class="send-info">
                        <ul>
                            <li class="cancel" @click="show = false">取消</li>
                            <li class="send" @click="sendMsg">提交</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {mapState,mapMutations} from "vuex"
export default {
    data () {
        return {
            show : false,
            show1 : false,
            show2 : false,
            show3 : false,
            vals : {
                name : '',
                time : {
                    hour : '',
                    minute : '',
                    second : ''
                },
                work : '',
                choose : false,
            },
            arr : [],
            flag : true,
        }
    },
    mounted () {
        this.arr = JSON.parse(sessionStorage.getItem('clockArr'))
        this.arr = this.arr === null ?  [] : this.arr;
        let resTime = JSON.parse(sessionStorage.getItem('resTime'));
        if (this.arr !== [] && this.arr && resTime) {
            resTime.choose = false;
            this.arr.forEach((item,index) => {
                item.choose = false;
                if (item.name === resTime.name) {
                    this.arr[index] = resTime;
                }
            })
        }
    },
    methods : {
        totalChoose () {
            if (this.$refs.totalChoose.checked === false) {
                this.dealArr(this.arr,false)
            }else{
                this.dealArr(this.arr,true);
            }
        },
        dealArr (arr,flag) {
            if (arr !== [] || !arr) {
                arr.forEach(((item,index) => {
                    this.$refs.choose[index].checked = flag;
                    item.choose = flag;
                }))
            }
        },
        judgeName (name) {
            let arr = [],
                judger;
            if (this.arr.length !== 0) {
                this.arr.forEach(item => {
                    arr.push(item.name)
                })
                if (arr.includes(name)) {
                    judger = false;
                }else{
                    judger = true;
                }
                return judger;
            }else{
                return true;
            }
            
        },
        sendMsg () {
            var reg = /(0[0-9])$/g;
            var obj = {};
            if (this.vals.name.length > 12 || this.vals.name.length === 0) {
                this.show1 = true;
            }else if (!this.judgeName(this.vals.name)) {
                this.show1 = true;
            }else{
                this.show1 = false;
                obj.name = this.vals.name;
            }
            var timeObj = this.vals.time
            if ( isNaN(timeObj.hour) || timeObj.hour >= 24 || timeObj.hour <0 || isNaN(timeObj.minute) || timeObj.minute >= 60 || timeObj.minute <0 || isNaN(timeObj.second) || timeObj.second >= 60 || timeObj.second <0) {
                this.show2 = true;
            }else{
                this.show2 = false;
                for (var prop in this.vals.time) {
                    if (this.vals.time[prop] < 10 ) {
                        this.vals.time[prop] = '0' + parseInt(this.vals.time[prop])
                    }
                }
                obj.time = this.vals.time;
            }
            if (this.vals.work.length > 20) {
                this.show3 = true
            }else{
                this.show3 = false;
                obj.work = this.vals.work;
            }
            if (!this.show1 && !this.show2 && !this.show3) {
                obj.choose = false;
                this.arr.push(obj);
                this.show = false;
                this.vals = {
                    name : '',
                    time : {
                        hour : '',
                        minute : '',
                        second : ''
                    },
                    work : '',
                    choose : false,
                    flag : true
                };
                sessionStorage.setItem('clockArr',JSON.stringify(this.arr));
            }
        },
        openClock (info,i,e) {
            if (e.target === this.$refs.rem[i]){
                if (confirm('确定删除该苹果时钟?') ) {
                    if (info.choose === true) {
                        let newarr = [];
                        this.arr.forEach((item) => {
                            if (item.choose !== true) {
                                newarr.push(item);
                            }else{
                                sessionStorage.removeItem('setClock-/=' + item.name)
                            }
                        })
                        this.arr = newarr;
                        this.$refs.choose.forEach(dom =>{
                            dom.checked = false;
                        })
                    }else{
                            this.arr.splice(i,1);
                            sessionStorage.removeItem('setClock-/=' + info.name)
                    }//点击删除 批量删除列表元素
                    sessionStorage.setItem('clockArr',JSON.stringify(this.arr));
                }
            }else if (e.target === this.$refs.choose[i]) {
                info.choose = info.choose === true ? false : true;
                console.log(info.choose)
                e.target.checked = info.choose;
            }else{
                if (e.target === this.$refs.start[i]) {
                    this.$store.state.clockStatus = "暂停"
                }else{
                    this.$store.state.clockStatus = "开始"
                }
                this.$router.push({path : '/name/clockPage'});
            }
            sessionStorage.setItem('clockArr',JSON.stringify(this.arr))
            sessionStorage.setItem('setClock',JSON.stringify(info));
        },
        ...mapMutations(['setSession','remSession','getSession'])
    },
    computed : {
        ...mapState(['clockStatus'])
    },
    watch : {
        arr (val) {
                val.length > 9 ? this.flag = false : this.flag = true;
                if (val.length === 0) {
                    this.$refs.totalChoose.checked = false;
                }
        }
    }
}
</script>
<style>
    .deal-name{
        white-space:nowrap;
        text-overflow :ellipsis;
        overflow:hidden;
    }
    .list-content:hover{
        background-color:#fffcff;
    }
    .clock-control #control-content div:nth-of-type(1){
        background-color:#b9ff18;
        
        color:#fff;
    }
    .clock-control #control-content div:nth-of-type(1):hover{
        background-color:#b9ed08;
    }
    .clock-control #control-content div:nth-of-type(2){
        background-color:red;
        color:#fff;
    }
    .clock-control #control-content div:nth-of-type(2):hover{
        background-color:#f10000;
        color:#fff;
    }
    .clock-control #control-content div{
        flex:5;
        width:50px;
        height:36px;
        margin:0 5px;
        text-align:center;
        line-height:36px;
        border-radius:10%;
        cursor:pointer;
    }
    .clock-control #control-content{
        position:absolute;
        left:50%;
        transform:translateX(-50%);
        display:flex;
        margin:auto;
        border:0px;
    }
    
    .add-content > div > span{
        font-size:14px;
        color:red;

    }
    .send{
        background-color:#20a0ff;
        color:#fff;
    }
    .send:hover{
        background-color:#20afff;
    }
    .cancel{
        border:1px solid #777;
        color:#777;
    }
    .cancel:hover{
        color:#20a0ff;
        border-color:#20a0ff;
    }
    .send-info{
        position:absolute;
        bottom:-20px;
        width:100%;
        height:40px;
    }
    .send-info ul{
        width:200px;
        float:right;
        margin-right:100px;
        overflow:hidden;
    }
    .send-info ul li{
        float:left;
        width:60px;
        height:40px;
        margin:0 3px;
        border-radius:4px;
        text-align:center;
        line-height:40px;
        cursor:pointer;
        box-sizing:border-box;
    }
    #set-textarea{
        width:70%;
    }
    .work{
        width:100%;
    }
    #clock-btn{
        width:35px;
        margin:0 4px;
        font-size:24px;
        line-height:32px;
        text-align:center;
        color:#20a0ff;
        cursor:pointer;
    }
    #clock-btn:hover{
        background-color:#eef1f1;
    }
    #shot-length{
        width:60px;
        
    }
    #shot-length input{
        width:40px
    }
    #set-length{
        width:400px;
        border:1px solid #20a0ff;
    }
    #set-length input{
        outline:transparent;
        width:378px;
    }
    .clock-add{
        position:absolute;
        top:0;
        left:0;
        width:100%;
        height:100%;
        background-color:rgba(0,0,0,.2);
        z-index:9999;
    }
    .clock-add .clock-info{
        position:absolute;
        width:50%;
        height:50%;
        left:50%;
        top:50%;
        transform:translate(-50%,-50%);
        background-color:#fff;
    }
    .clock-add .clock-info .add-content{
        display:flex;
        flex-direction:column;
        width:80%;
        height:80%;
        margin:6% auto 0;
    }
    .add-content > div{
        width:100%;
        height:80px;
        margin: 15px 0px 10px 20px;
    }
    .clock-title .clock-control{
        flex:4;
        position:relative;
    }
    
    .clock-title div:nth-of-type(4){
        flex:3;
    }
    .clock-title div:nth-of-type(1) label{
        float:left;
        margin-left:10px;
    }
    .clock-title div:nth-of-type(1) label{
        width:16px;
        height:16px;
    }
    .clock-title div{
        float:left;
        height:40px;
        text-align:center;
        border-right:1px solid #eee;
        margin:0 auto;
        color:#555;
        flex:1;
    }
    .list div{
        height:36px;
        border-right:1px solid #eee;
        background-color:#fff;
    }
    .list{
        display:flex;
        border:1px solid #eee;
        box-sizing:border-box;
        width:100%;
        height:40px;
        line-height:40px;
        background-color:#fff;
        cursor:pointer;
    }
    .list:hover{
        background-color:#ffefff;
    }
    .clock-list > .clock-title{
        display:flex;
        width:100%;
        height:40px;
        line-height:40px;
        background-color:#ddd;
    }
    .clock-list{
        width:100%;
        height:100%;
        margin-top:50px;
    }
    .clock-take{
        width:400px;
        height:100%;
        margin:10px 0px 0px 20px;
    }
    .clock-take .clock-btn{
        width:60px;
        height:35px;
        margin-left:10px;
        transform:translateY(50%);
        line-height:35px;
        font-weight:600;
        text-align:center;
        border:0px;
        color:#fff;
        background-color:#20a0ff;
        border-radius:8px;
        cursor:pointer;
    }
    .clock-take .clock-btn:hover{
        background-color:#20b0ff;
    }
    .clock-take .clock-btn:focus{
        outline-color:transparent;
    }
    .clock-input{
        width:192px;
        height:35px;
        line-height:35px;
        padding:1px;
        border-radius:3px;
        background-color:#fff;
        border:1px solid #20a0ff;
        box-sizing:border-box;
        transform:translateY(50%);
    }
    .clock-input input{
        width:170px;
        height:28px;
        font-size:16px;
        border:0px;
        padding:0px 0px 0px 8px;
    }
    .clock-input input:focus{
        outline-color:transparent;
    }
    .clock-take .clock-btn, .clock-input{
        float:left;
    }
    .clock-navigator{
        width:100%;
        height:70px;
        background-color:#eef1f1;
        margin-top:30px;
        line-height:70px;
    }
    .wrapper-content{
        width:90%;
        height:100%;
        margin:0 auto;
    }
    .clock-wrapper{
        width:100%;
        height:824px;
    }
</style>