<template>
    <div class="wrapper" @mouseenter = "showList=100">
        <div class="navigator" @mouseenter="showList = 0" @click="showList = 100">
            <div class="left">苹果时钟</div>
            <div class="right"></div>
            <div class="middle">时钟菜单</div>
        </div>
        <div class="menu" :style="{transform: 'translate(-50%,' + -showList + '%' + ')'}" @mouseleave="showList = 100">
            <router-view name="list" :listStyle="style1" ></router-view>    

        </div>
        <div class="content">
            <router-view name="list" id="left-tool"></router-view>
            <div class="clocks">
                <router-view name="clock"></router-view>
            </div>
        </div>
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
            flag : JSON.parse(sessionStorage.getItem('clockArr')),
            musicPath : '',
            showList : 100,
            style1 : {backcolor:'rgba(10,10,10,.3)',color:'#fff'},
            style2 : {backcolor:'pink',distance:'371px'}
        }
    },
    mounted () {
        this.$store.dispatch('getRing');
    },
    methods : {
        stopTimer (e) {
            console.log(e.target.innerText === "add clock" || (e.target.innerText === "add schedule" &&  this.$store.state.clockStatus === '开始'))
            if (e.target.innerText === "add clock" || (e.target.innerText === "add schedule" &&  this.$store.state.clockStatus === '开始')) {
                clearInterval(this.$store.state.timer);
            }
        },
        addMusic (e) {
            this.$store.state.musicName = '../../../static/music/' + e.target.innerText;
        },
        openFile () {
            var file = this.$refs.files.files[0];
            var reader = new FileReader();
            reader.readAsDataURL(file)
            reader.onload = function () {
                axios.get(reader.result).then(data=>{
                    console.log(data)
                })
                window.open(reader.result)
            }
        }
    },
    computed : {
        ...mapState(['clockStatus','musicName','image'])
    },
}
</script>
<style>
    .deal-name{
        white-space:nowrap;
        text-overflow :ellipsis;
        overflow:hidden;
    }
    .navigator{
        position:relative;
        z-index:1000;
        height:60px;
        line-height:60px;
        background-color:#20a0ff;
    }
    .content .clocks{
        margin-left:371px;
        height:97%;
        box-sizing:border-box;
        user-select:none;
        -webkit-user-select:none;
        -moz-user-select:none;
        -ms-suer-select:none;
    }
    .content{
        position:absolute;
        width:100%;
        height:100%;
    }
    .wrapper{
        width:100vw;
        height:100vh;
        
    }
    .middle{
        display:none;
    }
    .left{
        width:370px;
        height:100%;
        text-align:center;
        font-size:24px;
        border-right:1px solid #fff;
        float:left;
        color:#fff;
    }
    .menu{
        display:none;
        position:absolute;
        
        width:80%;
        z-index:999;
        transition:400ms;
    }
    #left-tool{
        width:371px;
    }
    @media all and (max-width :1200px) and (min-width: 0px) {
        #left-tool{
            display:none;
        }
        .content .clocks{
            margin-left:0px;
        }
        .menu{
            left:50%;
            display:block;
        }
        .navigator .middle{
            display:block;
            height:100%;
            text-align:center;
            font-size:24px;
            color:#fff;
        }
        .navigator{
            cursor:pointer;
        }
        .navigator:hover{
            background-color:#20a0ef
        }
        .navigator:hover + .menu{
            transform:translateY(0%);
        }
        .navigator .left,.right{
            display:none;
        }
    }

    
</style>