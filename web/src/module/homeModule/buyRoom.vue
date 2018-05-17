<template>
  <div>
  <mt-popup 
  v-model="buyRoom" 
  popup-transition="popup-fade" 
  class="buy" >
  <div class="buyR_modal" style='z-index: 2000' @touchend='noBuyMoal'></div>
    <mt-popup 
        v-model="buyK" :modal='false'
        popup-transition="popup-fade"
        class="caress" >
        <span><i @click="buyK = false">×</i></span>
        <mt-button @click="buyKa(1)">支付宝支付</mt-button>
        <mt-button @click="buyKa(2)">微信支付</mt-button>
    </mt-popup >

    <ul>
        <li v-for='data in buyArr' :key='"zs"+data.id'>
            <div>
                <p>{{data.name}}</p>
                <p>RMB:{{data.price}}元</p>
                <mt-button @click='buyK=true,buyID=data.id'></mt-button>
            </div>
        </li>
    </ul>
  </mt-popup>
  <loading v-if='loading'></loading>
  </div>
</template>

<style lang='scss' scoped>
    @import '../../utils/baseVar.scss';
    .buyR_modal{
            position: absolute; 
            left: 50%;
            top: 50%;
            -webkit-transform: translate(-50%, -50%);
            -moz-transform: translate(-50%, -50%);
            -ms-transform: translate(-50%, -50%);
            -o-transform: translate(-50%, -50%);
            transform: translate(-50%, -50%);
            width: 200%;
            height: 200%;
            filter:alpha(opacity=50);  
            -moz-opacity:0.5;  
            -khtml-opacity: 0.5;  
            opacity: 0.5;
            background: #000;
            display: none;

    }
    // 点击按钮
    .button {
        background-position: center;
        border: 0 none;
        outline: none;
        color: white;
        &:active {
            position: relative;
            top: 0.046296rem;
            left: 0.018519rem;
        }
    }
    .buy{   // 购买钻石
        width: 7rem;
        height: 11.1rem;
        background: $buyzs no-repeat;
        background-size: 7rem 11.1rem;
        ul{
            text-align: center;
            width: 5.277778rem;
            height: 100%;
            padding-top: 2.5rem;
            position: absolute;
            left: 50%;
            transform: translate(-50%,0);
            li{
                width: 5.277778rem;
                height: 1.851852rem;
                background: $zs02 no-repeat;
                background-size: 5.277778rem 1.851852rem;
                margin-bottom: .092593rem;
                position: relative;
                &>div {
                    color: #fff;
                    font-size: .333333rem;
                    line-height: .37037rem;
                    p:nth-of-type(2){
                        color: #F3E8EE;
                        margin-top: .03rem;
                    }
                    position: absolute;
                    top: 50%;
                    right: 0;
                    transform: translate(0,-50%);
                    width: 60%;
                }
                button {
                    margin-top: .092593rem;
                    width: 1.722222rem;
                    height: .555556rem;
                    background: $buy no-repeat;
                    background-size: 1.722222rem .555556rem;
                    border: 0 none;
                    border-radius: (.555556/2)+rem
                }
            }
        }
    }
    .caress{
        border-radius: 0.277778rem;
        width: 8.425926rem;
        height: 5.37037rem;
        background: url('../../oxImg/careTipK.png') no-repeat;
        background-size: 8.425926rem 5.37037rem; 
        margin-top: -1rem;
        span{
            display: block;
            color:white;
            font-size: 0rem;
            width:8.87037rem;
            height:2.12963rem;
            line-height: 1.805556rem;

            text-align: center;
            position: relative;
            right: 0.87037rem;
            bottom: 0.462963rem;
            position: relative;
            i{
                display: block;
                height: 0.611111rem;
                width: 0.611111rem;
                position: absolute;
                right: 0%;
                top: 50%;
                transform: translate(-80%, -50%);
                background: $careTip01 no-repeat;
                background-size: 0.611111rem 0.611111rem;
            }
        }

        button{
          width:4rem;
          height: 1.2rem;
          line-height:0.925926rem;
          border-radius: 0.509259rem;
          font-size:0.555556rem;
          margin-bottom:0.462963rem;
          border: 0 none;
          color: white;
          background: $zhifu no-repeat;
          background-size: 4rem 1.2rem;
          position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%,-66%);
        }
        button:nth-of-type(2){
          width:4rem;
          height: 1.2rem;
          line-height:0.925926rem;
          border-radius: 0.509259rem;
          font-size:0.555556rem;
          margin-bottom:0.462963rem;
          border: 0 none;
          color: white;
          background: $zhifu no-repeat;
          background-size: 4rem 1.2rem;
          transform: translate(-50%,66%);
        }
    }
</style>

<script type="es6">
  import Vue from 'vue';
  import http from '../../utils/httpClient.js';
  import router from '../../router/';
  import loading from '../../components/loading/loading.vue';
  Vue.component('loading', loading)
  export default {
    data() {
      return {
        loading: false,     // loading
        buyK: false, // 选择支付方式
        buyRoom: false,

        moreCard: false,
        cardNum: '',
        cardNumError: 'n张以上，几折优惠',
        list:[],

        buyArr: [], // 参数
        buyID: 0,   // 购买钻石的id
        num: 0,
        num_id: 0,
      };
    },
    mounted:function(){
        http.post('/Room/getDiamond',{}).then( res =>{
            if(res.code == 200){
                this.buyArr = [];
                for(var i=0; i<res.data.length; i++){
                    var obj = {
                        id: res.data[i].id,
                        name: res.data[i].name,
                        price: res.data[i].price,
                    }
                    this.buyArr.push(obj)
                }
            }
        })
    },
    methods: {
        buyKa(n){   // 购买

            var self = this;
            var href = location.href;
            href=href.replace('#','');

            http.post('/Room/buyDiamond',{
            // http.post('http://wanji888.hamingniao.com/RoomCard/getData',{
                    // id: Number(localStorage.brUid),
                    commodityid: this.buyID,
                    returnurl: href,
                    // num: 1,
                    type: n,// 1支付宝 2微信
                },'',this)
                .then(res => {
                    console.log(res)
                    if(res.code == 200){
                        this.buyK = false; // 选择支付方式
                        this.buyRoom = false;
                    }
                    if(n==1){
                        self.$parent.iframeCss = 'iframeCss02';
                    } else {
                        self.$parent.iframeCss = 'iframeCss03';
                    }
                    // self.$parent.iframe = res.url;
                    self.$parent.iframe = res.data.url;
                    console.log(res.data.url)
                    // window.open(res.url)
                })
        },
        buyCard(num,id){      // 购买房卡
            this.num = num;
            this.num_id = id;
            this.buyK = true;
        },
        noBuyMoal() {
            this.moreCard = false;
            document.getElementsByClassName('buyR_modal')[0].style.display = 'none';
        },
    }
  }
</script>