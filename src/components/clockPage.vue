<template>
<div>
    <div class="page-wrapper">
            <div class="page-clock">
                <div v-if="success">
                    <div class="page-name">{{setClock.name}}</div>
                    <div class="page-volume">
                        <div class="page-add" @click="adjustVolume(true)" :style="{left : volumePersent + '%'}">增大闹铃音量</div>
                        <div class="page-minu" @click="adjustVolume(false)" :style="{right : volumePersent + '%'}">降低闹铃音量</div>
                    </div>
                    <div class="page-control">
                        <div class="page-change" @click="controlClock">{{endStatus ? endStatus : easyClockStatus}}</div>
                        <div class="icon-list">
                            <svg width="50" height="50" @click="num = num === -100 ? 0 : -100">
                                <path d="M 0 10 L 50 10"></path>
                                <path d="M 0 20 L 50 20"></path>
                                <path d="M 0 30 L 50 30"></path>
                                <path d="M 0 40 L 50 40"></path>
                            </svg>
                        </div>
                    </div>
                    <div>
                        <svg width="610px" height="610px" @click="closeAlarm">
                            <path id="path1" d="M 305 5 A 300 300 360 1 1 304.99 5"></path>
                            <path id="path2" d="M 305 5 A 300 300 360 1 1 304.99 5" :style="{strokeDashoffset : strokeOff + 'px',}"></path>
                            <path id="path3" d="M 305 15 A 290 290 360 1 1 304.99 15" :style="{strokeDashoffset : volumeLength + 'px',}"></path>
                            <path id="path4" d="M 305 15 A 290 290 360 1 1 304.99 15"></path>
                        </svg>
                        <div class="page-status">{{easyClockStatus === "暂停" ? '进行中...' : '休息一下...'}}</div>
                        <div class="page-time">
                            <span>{{totalTime}}:{{setClock.time.second}}</span>
                            <div>{{endClockStatus ? endClockStatus : setClock.work}}</div>
                        </div>
                    </div>
                    
                    <div class="page-list" :style="{'transform': 'translateY(' + num + '%)'}">
                        <ul>
                            <li class="page-list-title">
                                choose Clock
                            </li>
                            <li v-for="(item,index) in arr" @click="chooseClock(item,index)" ref="setClass">
                                <div class="deal-name">name:{{item.name}}</div>
                                <div>time:{{item.time.hour}}:{{item.time.minute}}:{{item.time.second}}</div>
                            </li>
                        </ul>
                    </div>
                </div>
                <router-link to="/name" tag="div" class="page-error" v-else>
                    抱歉，您还未添加时钟~~~戳屏幕添加时钟吧(^o^)
                </router-link>
            </div>
            <audio :src="musicName" ref="audio"></audio>
            
    </div>
</div>
</template>
<script>
import {mapState,mapMutations} from 'vuex';
export default {
    //设置铃声音量条
    //铃声列表
    //响应式布局
    data () {
        return {
            setClock : JSON.parse(sessionStorage.getItem('setClock')),
            arr : JSON.parse(sessionStorage.getItem('clockArr')),
            status : "停止",
            lock : true,
            strokeOff : 0,
            volumeStroke : 0,
            persent : 0,
            volumeLength : 0,
            volumePersent : 0,
            oneVolumeLength : 0,
            getLength : 0,
            num : 0,
            testArr : [],
            success : true,
            endStatus : "",
            endClockStatus :"",
            show : true,
            animation : undefined,
            easyClockStatus : this.$store.state.clockStatus,
            // timer : this.$store.state.timer,
        }
    },
    mounted () {
        if (!this.arr ||this.arr.length === 0) {
            this.success = false;
        }else{
            this.success= true;
            let time = this.setClock.time,
                len = this.arr.length,
                vals = sessionStorage.valueOf();
            this.getLength = document.getElementsByTagName('path')[5].getTotalLength();
            this.oneVolumeLength = 0.1 * document.getElementsByTagName('path')[7].getTotalLength();
            for (var i = 0; i < len;i++) {
                if (vals['setClock-/=' + this.arr[i].name]) {
                    if (this.arr[i].name === JSON.parse(vals['setClock-/=' + this.arr[i].name]).name) {
                        this.arr[i] = JSON.parse(vals['setClock-/=' + this.arr[i].name]);
                    }
                }
                if (this.arr[i].name === this.setClock.name) {
                    this.setClass(i);
                    this.setClock = this.arr[i];
                }
            }//更新arr列表
            this.persent = this.getLength/(time.hour * 60 * 60 + time.minute * 60 + Number(time.second));
            if (this.easyClockStatus === "开始") {
                this.easyClockStatus = "开始"
            }else{
                this.easyClockStatus = "暂停"
                this.startClock();
            }
        }
    },
    methods : {
        adjustVolume (flag,e) {
            let dom = this.$refs.audio;
            if (flag) {
                if (dom.volume > 0.9 ) {
                    dom.volume = 1
                    this.volumeLength = 0 ;
                }else{
                    dom.volume = (Math.floor(dom.volume * 100) + 10)/ 100;
                    this.volumeLength += this.oneVolumeLength;
                } 
            }else{
                if (dom.volume <= 0.1) {
                    dom.volume = 0
                    this.volumeLength = -1822;
                }else{
                    dom.volume = (Math.floor(dom.volume * 100) - 10)/ 100;
                    this.volumeLength -= this.oneVolumeLength;
                    
                }
            }
        },
        chooseClock (item,i) {
            clearInterval(this.$store.state.timer);
            this.easyClockStatus = "开始"
            this.setClock = item;
            this.setClass(i);
            let time = this.setClock.time;
            this.persent = this.getLength/(time.hour * 60 * 60 + time.minute * 60 + Number(time.second));
            this.strokeOff = 0;
            sessionStorage.setItem('setClock',JSON.stringify(this.setClock))
        },
        setClass (i) {
            this.$refs.setClass.forEach((item) => {
                item.className = '';
            })
            this.$refs.setClass[i].className = 'make-sign' ;
        },
        controlClock () {
            console.log(this.easyClockStatus)
            if (this.easyClockStatus === "暂停") {
                this.easyClockStatus = "开始";
                clearInterval(this.$store.state.timer)
            }else{
                this.easyClockStatus = "暂停";
                this.startClock();
            }
        },
        startClock () {
            if (this.lock) {
                var vm = this;
                this.$store.state.timer = setInterval(function () {
                    vm.strokeOff += vm.persent;
                    vm.dealTime();
                },1000)
            }
        },
        dealTime () {
            let time = this.setClock.time,
                clockName = this.setClock.name;
            time.second = this.binaryTime(time.second);
            if (parseInt(time.hour + time.minute + time.second) === 0) {
                this.second--;
                clearInterval(this.$store.state.timer);
                this.lock = false;
                this.$refs.audio.play();
                this.startAlarm();
                this.deleteElement(clockName);
                this.endStatus = "恭喜,任务结束";
                this.endClockStatus = "点击此处关闭音乐";
                return;
            }else if (time.second === '0-1') {
                time.minute = this.binaryTime(time.minute);
                time.second = 59;
            }else if (time.minute === -1) {
                time.minute = 59
                time.hour = this.binaryTime(time.hour)
            }else if (time.hour === "0-1") {
                time.hour = 0;
            } 
            sessionStorage.setItem('clockArr',JSON.stringify(this.arr));
            sessionStorage.setItem('resTime',JSON.stringify(this.setClock));
            sessionStorage.setItem('setClock',JSON.stringify(this.setClock));
            sessionStorage.setItem('setClock-/=' + this.setClock.name,JSON.stringify(this.setClock));
        },
        deleteElement (name) {
            for (var i = 0,len = this.arr.length; i < len; i++) {
                if (this.arr[i].name === name) {
                    this.arr.splice(i,1);
                    sessionStorage.removeItem('setClock-/=' + name);
                    sessionStorage.setItem('clockArr',JSON.stringify(this.arr));
                    break;
                }
            }
            
            
        },
        binaryTime (time) {
            if (!isNaN(Number(time))){
                if (time <= 10) {
                    let num = Number(time) - 1
                    time = "0" + num
                }else{
                    time--
                }
                return time;
            }
        },
        startAlarm () {
            if (this.$refs.audio.currentTime && this.$refs.audio.currentTime > 60) {
                this.$refs.audio.pause();
                cancelAnimationFrame(this.animation);
            }
            window.requestAnimFrame = (function(){
                return window.requestAnimationFrame ||
                    window.webkitRequestAnimationFrame ||
                    window.mozRequestAnimationFrame ||
                    function( callback ){
                        window.setTimeout(callback, 1000 / 60);
                    };
            })();
            this.animation = requestAnimationFrame(this.startAlarm);
        },
        closeAlarm () {
            if (this.endClockStatus === "点击此处关闭音乐") {
                this.$refs.audio.pause();
                cancelAnimationFrame(this.animation);
            }
        },
        ...mapMutations(['setSession','remSession'])
    },
    computed : {
        totalTime () {
            var time2 = this.setClock.time;
            time2.minute = time2.minute === "0-1" ? -1 : time2.minute;
            return time2.hour * 60 + Number(time2.minute);
        },
        ...mapState(['clockStatus','musicName'])
    },
    watch : {

    }
}
</script>
<style>
    .page-clock .page-volume{
        position:relative;
        width:100%;
        height:36px;
        transform:translateY(-24px);
    }
    .page-clock .page-volume div{
        position:absolute;
        width:49%;
        height:100%;
        border:4px solid #fff;
        background-color:#fff;
        box-sizing:border-box;
        color:#20a0ff;
        font-size:16px;
        line-height:26px;
        cursor:pointer;
    }
    .page-clock .page-volume div:hover{
        color:#fff;
        background-color:transparent;
    }
    .page-clock .page-volume .page-add{
        padding-right:20px;
        border-left:0;
        border-top-right-radius:20px;
        border-bottom-right-radius:20px;
        left:0;
        text-align:right;
    }
    .page-clock .page-volume .page-minu{
        padding-left:20px;
        border-top-left-radius:20px;
        border-bottom-left-radius:20px;
        right:0;
        text-align:left;
        border-right:0;
    }
    .page-error{
        width:100%;
        height:100%;
        color:#fff;
        font-size:40px;
        text-align:center;
        line-height:924px;
        cursor:pointer;
    }
    .page-error:hover{
        background-color:rgba(255,255,255,.2);
    }
    .showlist{
        transform:translateY(-100%);
    }
    .page-list .page-list-title{
        border-top:0px;
        color:#20a1ff;
    }
    .page-list{
        position:absolute;
        z-index:1;
        width:160px;
        position:absolute;
        right:10px;
        top:826px;
        border-top-left-radius: 12px;
        border-top-right-radius:12px;
        transition:200ms;
        background-color:#fff;
    }
    .page-list li{
        border-top:1px solid #eee;
        text-align:center;
        line-height:56px;
        width:100%;
        height:56px;
    }
    .page-list li:not([class="page-list-title"]):hover{
        cursor:pointer;
        background-color:#eef1f1;
    }
    .page-list li div{
        width:100%;
        height:50%;
        text-align:left;
        line-height:28px;
        padding-left:12px;
        color:#aacfcf;
    }
    .page-list .make-sign div{
        color:#20a1ff;
    }
    .icon-list svg{
        transform:translate(-30%,-100%);
    }
    .icon-list{
        position:absolute;
        width:200px;
        height:200%;
        top:0px;
        right:0px;
        background-color:#20a0ff;
        cursor:pointer;
    }
    .icon-list:hover path{
        stroke:#fff;
    }
    .icon-list svg path{
        stroke:#f1eaea;
        stroke-width:6px;
    }
    .page-control{
        width:100%;
        height:76px;
        margin:0 auto;
        position:absolute;
        bottom:20px;
        z-index:10;
        background-color:
    }
    .page-control .page-change{
        width: 200px;
        height:70px;
        border:3px solid #fff;
        border-radius:8px;
        color:#fff;
        text-align:center;
        line-height:70px;
        font-size:24px;
        margin:0 auto;
        cursor:pointer;
    }
    .page-change:hover{
        background-color:#fff;
        color:#20a0ff;
    }
    .page-wrapper .page-name,.page-status{
        width:100%;
        height:100px;
        text-align:center;
        font-size:50px;
        color:#fff;
    }
    .page-status{
        width:160px;
        height:24px;
        margin:0 auto;
        font-size:24px;
        transform:translateY(200px);
    }
    .page-clock .page-time{
        color:#fff;
        font-size:80px;
        font-weight:400;
        width:300px;
        text-align:center;
    }
    .page-clock .page-time div{
        text-align:center;
        margin:0 auto;
        font-size:30px;
    }
    svg:hover ~ .page-time,svg:hover ~ .page-status{
        color:#20a0ff;
    } 
    .page-clock svg:hover > #path2{
        fill:#fff;
        stroke:#eef1f1;
    }
    .page-clock .page-time,svg{
        position:absolute;
        left:50%;
        top:50%;
        transform:translate(-50%, -50%);
    }
    .page-clock svg #path1{
        stroke:transparent;
        stroke-width:10;
        fill:transparent;
    }
    .page-clock svg #path2{
        stroke:#fff;
        stroke-linecap:round;
        stroke-width:8;
        fill:transparent;
        animation:showClock 1000ms ease-out;
        transition:100ms;
        stroke-dasharray:1885px;
    }
    .page-clock svg #path4{
        stroke:transparent;
        stroke-width:10;
        fill:transparent;
    }
    .page-clock svg #path3{
        stroke:#fff;
        stroke-linecap:round;
        stroke-width:8;
        fill:transparent;
        transition:100ms;
        stroke-dasharray:1822px;
        animation:showVolume 1000ms ease-out ;
    }
    @keyframes showClock {
        0% {
            stroke-dashoffset:1885px;
        }
        100%{
            stroke-dashoffset:0px;
        }
    }
    @keyframes showVolume{
        0%{
            
            stroke-dashoffset:1822px;
        }
        100%{
            
            stroke-dashoffset:0px;
        }
    }
    .page-clock{
        position:relative;
        top:20px;
        width:90%;
        height:90%;background-color:#20a0ff;
        margin:0 auto;
        border-radius:20px;
        box-shadow:0 0 10px #665666;
        overflow:hidden;
    }
    .page-wrapper{
        width:100%;
        height:1024px;
    }
    
</style>