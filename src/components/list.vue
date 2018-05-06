<template>
    <div class="tool">
        <ul>
            <div>
                <div class="title" @click="slide[0] = !slide[0]">choose tool</div>
                <div class="ul-content" @click="stopTimer" :class="{'active' : slide[0]}">
                    <router-link to="/name" tag="li">add clock</router-link>
                    <router-link to="/name/clockPage" tag="li">add schedule</router-link>
                </div>
            </div>
            <div>
                <div class="title" @click="slide[1] = !slide[1]">choose music</div>
                <div class="ul-content clock-music" :class="{'active' : slide[1]}">
                    <li class="music-list" @click="slide[2] = !slide[2]">
                        默认音乐
                    </li>
                    <ul class="unwrite" :class="{'active' : slide[2]}" @click="addMusic">
                        <li>MYKOOL - Tabi.mp3</li>
                        <li>茅原実里 - みちしるべ.mp3</li>
                        <li>MYKOOL - Tabi.mp3</li>
                        <li>MYKOOL - Tabi.mp3</li>
                    </ul>
                    <li class="music-list" @click="slide[3] = !slide[3]">
                        本地音乐
                    </li>
                </div>
            </div>
            
        </ul>
    </div>
</template>
<script>
import {mapState,mapMutations} from 'vuex'
export default {
    data () {
        return {
            slide : {
                0 : false,
                1 : false,
                2 : false,
                3 : false,
            },
            musicPath : '',
            showList : 100,
            listStyles : {}
        }
    },
    props:['listStyle'],
    mounted () {
        // console.log(this.listStyle)
        // if (this.flag) {
        //     this.listStyles = this.listStyle
        // }else{
        //     this.listStyles = this.leftStyle
        // }
    },
    methods : {
        stopTimer (e) {
            // console.log(e.target.innerText === "add clock" || (e.target.innerText === "add schedule" &&  this.$store.state.clockStatus === '开始'))
            if (e.target.innerText === "add clock" || (e.target.innerText === "add schedule" &&  this.$store.state.clockStatus === '开始')) {
                clearInterval(this.$store.state.timer);
            }
        },
        addMusic (e) {
            this.$store.state.musicName = '../../../static/music/' + e.target.innerText;
        },
    },
    computed : {
        // ...mapState(['addMusic'])
    }
}
</script>
<style>
    .tool ul{
        transition:200ms;
    }
    .tool .unwrite{
        height:136px;
    }
    .ul-content ul li{
        width:100%;
        height:25%;
        color:#fff;
        padding:0 10px;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
        border:1px solid #fff;
        line-height:34px;
        box-sizing:border-box;
        background-color:#ffe1f1;
        text-align:left;
        cursor:pointer;
    }
    .music-list{
        text-align:center;
    }
    .wrapper .tool ul .clock-music{
        height:360px;
    }
    .tool ul .ul-content > li{
        width:100%;
        height:70px;
        background-color:#eed1ee;
        border-top:1px solid #eee;
        text-align:center;
        font-size:21px;
        line-height:70px;
        color:#fff;
        cursor:pointer;
    }
    .tool ul .ul-content li:hover{
        background-color:#e1e1e1;
    }
    .content .tool ul .rotate{
        transform:rotate(130deg);
    }
    .wrapper .tool ul .active{
        height:0px;
    }
    .tool ul .ul-content{
        width:100%;
        height:135px;
        box-sizing:border-box;
        transition:200ms;
        overflow:hidden;
    }
    .tool ul .title .btn{
        display:inline-block;
        width:16px;
        height:16px;
        transform:translateX(60px);
    }
    .tool ul .title{
        width:100%;
        height:75px;
        font-size:20px;
        color:#fff;
        font-weight:900;
        text-align:center;
        line-height:75px;
        background-color:#dfcfff;
        border:2px solid #fff;
        border-width:2px 0px 2px 0px;
        box-sizing:border-box;
        cursor:pointer;
    }
    .tool ul .title:hover{
        box-shadow:0 0 6px #cac6c6;
        background-color:#eef1e6;
    }
    .tool ul{
        width:100%;
    }
    .tool{
        float:left;
        width:100%;
    }
</style>