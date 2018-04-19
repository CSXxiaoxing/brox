<template>
    <header>
        <div>
            <div class="hei"></div>
            <div class='btl'>
                <img src="src/srcImg/fanhui.png" alt="返回" @click="fhHome"/>
                <span>{{hashsh == '#/home'? "游戏大厅": "房间大厅"}}</span>
                <img src="src/srcImg/fenxiang.png" alt="分享"  @click="$parent.child_KA(5)" />
                <b
                v-if='hash!="home"'
                :class='$store.state.Music.autoplay ? "huan":"bai"' 
                @click.stop="$store.state.Music.autoplay=!$store.state.Music.autoplay">
                </b>
            </div>
        </div>
        <dl>
            <dt @click.capture='$parent.child_KA(2)'>
                <img :src="$store.state.user.userImg" />
            </dt>

            <dd>
                <span>{{$store.state.user.userName}}</span>
            </dd>

            <dd> 
                <span>ID:{{$store.state.user.userID}}</span>
                <span>
                    {{$parent.cardNum}}
                    <i @click='$parent.child_KA(3)'></i>
                </span>
            </dd>
        </dl>

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
        </mt-swipe>
        </p>

        <span :class='[(xxtype == 1 ? "xx":""),("homeServer")]' @click='kefu=true,xxtype=0'>
        </span>
        <mt-popup 
            v-model="kefu"
            popup-transition="popup-fade"
            class="kefu" >
            <span>咨询客服 <i @click="kefu = false"></i></span>
            <div class="ltk">
                <div class="ly">
                    <p v-for='text in connetArr' :class='text.slice(0,3)=="K&5"?"kefuR" :"kefuL"'><b v-if='text.slice(0,3)!="K&5"'>客服 ：</b>{{text.slice(3)}}<b v-if='text.slice(0,3)=="K&5"'> : {{$store.state.user.userName}}</b></p>
                </div>
                <!-- 输入用 -->
                <input type="text" class='shuru' v-model='connet' autofocus placeholder='输入咨询内容'/>
            </div>
            <mt-button @click="liuyan">
            </mt-button>
        </mt-popup>
    </header>
</template>

<style lang='scss' scoped>
    .kefu{
        border-radius: 0.277778rem;
        border-top-right-radius: 0.46rem;
        // position: absolute;
        // top: 8.240741rem;
        background: #F7E8D3;
        width: 88%;
        height: 7.6rem;
        span{
            display: block;
            color: #3D3D35;
            font-size: 0.72rem;
            // font-weight: 600;
            line-height: 1.2rem;
            width:100%;
            height: 1.12963rem;

            text-align: center;
            position: relative;
            i{
                display: block;
                height: 1.1rem;
                width: 1.1rem;
                position: absolute;
                right: 0%;
                top: 0%;
                transform: translate(0%, 0%);
                background: url('../../image/idMessage5.png') no-repeat;
                background-size: 1.1rem 1.1rem;
            }
        }
        .ltk{
            background: #fcfcfc;
            border-radius: 0.1rem;
            border: 1px solid #5c5c5c;
            width: 84%;
            height: 4.7rem;
          
            padding: 0 0.152593rem;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%,-54%);
            white-space: pre-wrap;
            // overflow: hidden;
            .ly{
                height: 3.9rem;
                overflow-x: hidden;
                overflow-y: auto;
                &>p{
                    font-size: 0.4rem;
                    // font-weight: 600;
                    line-height: 0.45rem;
                    width:100%;
                    height: 0.45rem;
                    color: #222;
                    b{
                        font-weight: 300;
                        color: #000;
                    }
                }
                &>.kefuR{
                    text-align: right;
                }
                &>.kefuL{
                    text-align: left;
                }
            }
            .ly::-webkit-scrollbar {
                display: none;
            }
            input{
                line-height: 0.725926rem;
                text-align: left;
                font-size: 0.42963rem;
                width: 100%;
            }
            &>.shuru{
                height: 0.8rem;
                line-height: 0.8rem;
                background: #fff;
                position: absolute;
                bottom: 0;
                left: 0;
                padding: 0 0.152593rem;
                box-sizing: border-box;
                border: 0 none;
                border-top: 1px solid #4c4c4c;
                background: #fff;
                z-index: 50;
            }
        }
        button{
          width:3.305556rem;
          height: 1.018519rem;
          line-height:0.925926rem;
          border-radius: 0.509259rem;
          font-size:0.555556rem;
          margin-bottom: 0.3rem;
          border: 0 none;
          color: white;
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translate(-50%,0);
          background: url('../../image/careTip.png') no-repeat;
          background-size: 3.305556rem 1.018519rem;
        }
    }
    .xx{
        border: 0.015rem solid red;
        border-top-left-radius: 0.2rem;
        border-bottom-left-radius: 0.2rem;
    }
</style>

<script type="text/javascript">
    import Vue from 'vue';
    import router from '../../router/';
    import http from '../../utils/httpClient.js';

    export default {
        data: function(){
            return {
                hash: location.hash.slice(-4),
                hashsh: location.hash,
                kefu: false,
                kefuType: 0,
                connet: '',
                connetArr: [],
                xxtype: 0,
            }
        },
        mounted:function(){
            http.post( '/Chat/getFeedback', {
                    uid: localStorage.oxUid,
                })
            .then(res => {
                console.log(res)
                if(res.status==1){
                    this.connetArr = res.data;
                    this.xxtype = 1;
                }
            })
        },
        methods: {
            test(){
                http.post( '/Chat/getFeedback', {
                        uid: localStorage.oxUid,
                    })
                .then(res => {
                    console.log(res)
                })
            },
            fhHome(){
                if(this.hash=="home"){
                    this.$parent.careTip2 = true;
                    this.$parent.errorTips2 = '确定退出游戏？';
                }else{
                    router.push({name: 'home'})
                }
            },
            liuyan(){
                // if(this.kefuType == 1){
                //     this.kefuType = 0;
                //     this.kefu=false;
                // }
                if(this.connet!=''){
                    this.connetArr.push("K&5"+this.connet)
                    http.post( '/Chat/Feedback', {
                        connect: this.connet,
                    })
                    .then(res => {
                        this.connet = '';
                        if(res.status==1){
                            // this.connetArr
                            // this.kefu=false;
                        } else if(res.status==2){
                            this.connetArr.push("H%3"+res.msg);
                            this.kefuType = 1;
                        }
                        console.log(res)
                    })
                } else {
                    this.kefu=false;
                }
                
            },
        }
    }
</script>