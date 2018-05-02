<template>
    <header>
        <mt-popup 
            v-model="wenti"
            popup-transition="popup-fade"
            class="wenti" >
            <i @click='wenti = false'></i>
            <div>
                <div class='cals'>
                    <img src="../../oxImg/rule.png" alt="">
                </div>
            </div>
        </mt-popup>

        <div>
            <div class="hei"></div>
            <div class='nei'>
                <div class="l">
                    <div class="l_img" @click='$refs.onidMessageChild.idMessage=true;'>
                        <img :src="$store.state.user.userImg" alt="">
                    </div>
                    <div class="l_wz">
                        <span>{{$store.state.user.userName}}</span><br>
                        <span>ID:{{$store.state.user.userID}}</span>
                    </div>
                </div>
                <div class="c">
                    <div class="zs">
                        <img src="../../oxImg/zs.png" alt="">
                        <span>{{$store.state.user.userCard}}</span>
                        <img src="../../oxImg/tj.png" @click='$refs.onbuyRoomChild.buyRoom=true'>
                    </div>
                </div>
                <div class="r">
                    <img src="../../oxImg/home09.png" @click='toWx'>
                    <img src="../../oxImg/wh.png" v-if='$parent.wen == 999' @click='wenti=true'>
                    <img src="../../oxImg/home08.png" v-if='$parent.wen != 999'>
                </div>
            </div>
        </div>

        <div class="gb">
            <p>
                <i></i>
                <mt-swipe 
                    :show-indicators="false"
                    :prevent = 'true'
                    :speed="800" :auto="5000" 
                    class='autoOx'>
                    <mt-swipe-item v-for='notices in $store.state.oxCrowd.notice'>
                        <span>{{notices}}</span>
                    </mt-swipe-item>
                    <mt-swipe-item v-for='notices in $store.state.oxCrowd.notice'>
                        <span>{{notices}}</span>
                    </mt-swipe-item>
                    <mt-swipe-item>
                        <span>不充钱就想变强？不可能的。</span>
                    </mt-swipe-item>
                </mt-swipe>
            </p>
        </div>
        
        <idMessage ref="onidMessageChild" ></idMessage>
        <buyRoom ref="onbuyRoomChild" ></buyRoom>
        <toShare ref="ontoShare"></toShare>
    </header>
</template>

<style lang='scss' scoped>
    @import '../../utils/baseVar.scss';
    .wenti{
        width: 9.166667rem;
        height: 9.444444rem;
        background: $rule02 no-repeat;
        background-size: 100% 100%;
        padding: 1.6rem .4rem .8rem .58rem;
        box-sizing: border-box;
        &>i {
            position:absolute;
            right: -0.04rem;
            top: 0.22rem;
            width:0.944444rem;
            height:1.0rem;
            background: $off no-repeat;
            background-size:0.944444rem 1.0rem;
        }
        &>div {
            width: 100%;
            height: 100%;
            border-radius: .092593rem;
            overflow: hidden;
            position: relative;
            .cals{
                width: 100%;
                height: 100%;
                overflow-x: hidden;
                overflow-y: auto;
            }
            .cals::-webkit-scrollbar {
                display: none;
            }
            img {
                width: 100%;
                height: 12.962963rem;
                
                display: block;
            }
        }
    }
    .nei {
        padding: 0 .277778rem;
        height: 1.203704rem;
        font-size: .3rem;
        line-height: .32rem;
        color: #fff;
        // background: #fff;
        &>div {
            float: left;
            height: 100%;
        }
        &>.l {
            width: 33%;
            .l_img {
                float: left;
                width: .925926rem;
                height: .925926rem;
                position: relative;
                top: 50%;
                transform: translate(0,-50%);
                background: $home05 no-repeat;
                background-size: 100% 100%;
                &>img {
                width: .833333rem;
                height: .833333rem;
                border-radius: 50%;
                position: relative;
                top: 50%;
                transform: translate(0,-50%);
                }
            }
            
            .l_wz {
                float: left;
                position: relative;
                top: 50%;
                transform: translate(0,-56%);
                padding-left: .2rem;
                text-align: left;
            }
        }
        &>.c {
            width: 34%;
            &>.zs {
                width: 86%;
                position: relative;
                top: 50%;
                left: 50%;
                transform: translate(-48%,-50%);
                height: .481481rem;
                background: #392E50;
                border-radius: .240741rem;
                span {
                    height: 100%;
                    line-height: .481481rem;
                    transform: translateX(-0.1rem);
                    display: inline-block;
                    vertical-align: top;
                }
                img:nth-of-type(1){
                    height: 100%;
                    width: .574074rem;
                    display: inline-block;
                    position: relative;
                    transform: translateX(-0.2rem);
                }
                img:nth-of-type(2){
                    transform: translatey(-10%);
                    height: .574074rem;
                    width: .574074rem;
                    padding: 0 .027778rem;
                    display: inline-block;
                    float: right;
                }
            }
        }
        &>.r {
            width: 33%;
            &>img {
                height: .703704rem;
                width: .703704rem;
                padding: 0 .1rem;
                position: relative;
                top: 50%;
                transform: translate(0,-50%);
                float: right;
            }
        }
    }
</style>

<script type="text/javascript">
    import Vue from 'vue';
    import router from '../../router/';
    import http from '../../utils/httpClient.js';

    import idMessage from '../../module/homeModule/idMessage.vue'; // 个人参数
    Vue.component('idMessage', idMessage)
    import buyRoom from '../../module/homeModule/buyRoom.vue'; // 购买房卡
    Vue.component('buyRoom', buyRoom)
    import toShare from '../../module/shareModule/toShare.vue'; // 微信邀请
    Vue.component('toShare', toShare)

    export default {
        data: function(){
            return {
                hash: location.hash.slice(-4),
                hashsh: location.hash,
                wenti: false,   // 问题弹框
            }
        },
        mounted: function(){},
        methods: {
            test(){
            },
            fhHome(){
                if(this.hash=='home'){
                    this.$parent.careTip2 = true;
                    this.$parent.errorTips2 = '确定退出游戏？';
                }else{
                    router.push({name: 'home'})
                }
            },
            toWx(){ // 微信邀请
                this.$refs.ontoShare.dl();
            },
        }
    }
</script>