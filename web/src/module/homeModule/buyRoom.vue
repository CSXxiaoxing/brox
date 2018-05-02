<template>
  <div>
  <mt-popup 
  v-model="buyRoom" 
  popup-transition="popup-fade" 
  class="buy" >
  <div class="buyR_modal" style='z-index: 2000' @touchend='noBuyMoal'></div>
    <mt-popup
      v-model="moreCard"
      popup-transition="popup-fade"
      :modal='false'
      class="more">
        <span>
            <b @click="noBuyMoal"></b>
        </span>
        <p>{{cardNumError}}</p>
        <p>请输入购买的房卡数量</p>
        <input  class="num" v-model.trim='cardNum' ></input>
        <mt-button @click="cardNumber" ></mt-button>
    </mt-popup>
    <mt-popup 
        v-model="buyK" :modal='false'
        popup-transition="popup-fade"
        class="caress" >
        <span><i @click="buyK = false">×</i></span>
        <mt-button @click="buyKa(1)">支付宝支付</mt-button>
        <mt-button @click="buyKa(2)">微信支付</mt-button>
    </mt-popup >

    <ul>
        <li v-for='data in 4'>
            <div>
                <p>钻石X999</p>
                <p>RMB:10元</p>
                <mt-button></mt-button>
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
        background: url('../../image/careTipK.png') no-repeat;
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
                background: url('../../image/careTip01.png') no-repeat;
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
          background: url('../../image/zhifu.png') no-repeat;
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
          background: url('../../image/zhifu.png') no-repeat;
          background-size: 4rem 1.2rem;
          transform: translate(-50%,66%);
        }
        // button:active {
        //     position: relative;
        //     left: 0.018519rem;
        //     bottom: -0.046296rem;
        // }
    }
  .more{    // 购买房卡
      width: 8.407407rem;
      height: 5.787037rem;
      background: $oxCrowd_015 no-repeat;
      background-size: 8.407407rem 5.787037rem;

      @include border-radius(0.185185rem);
      span{
        display: block;
        color:white;
        font-size: 0.62963rem;
        width:8.796296rem;
        height:1.805556rem;
        line-height: 1.527778rem;

        background-position: center;
        text-align: center;
        position: relative;
        right: 0.833333rem;
        bottom: 0.277778rem;
        
          b{
            display: block;
            height: 0.611111rem;
            width: 0.611111rem;
            position: absolute;
            right: 0%;
            top: 50%;
            transform: translate(-80%, -50%);
            background: url('../../image/careTip01.png') no-repeat;
            background-size: 0.611111rem 0.611111rem;
          }
      }

      p:nth-of-type(1){
        padding-bottom: 0.185185rem;
        position:relative;
        bottom:0.277778rem;
        color:red;
        text-align:center;
        font-size:0.416667rem;
      }
      p:nth-of-type(2){
        margin-bottom: 0.185185rem;
        margin-left: 1.28rem;
        font-size:0.324074rem;
        font-weight: bold;
        text-align: left;
      }

      .num{
        width: 6.018519rem;
        height: 1.064815rem;
        font-size: 0.666667rem;
        text-align: center;
        margin: 0.0rem 0.0rem 0.0rem 0.092593rem;
        @include border-radius(0.138889rem);
        border: 0.027778rem solid #D2C3AE; 
        color: #0BBA05;
        background-color: rgba(0,0,0,0);
      }
      button{
        @include border-radius(0.481481rem);
        width: 3.305556rem;
        height: 0.962963rem;
        line-height: 0.962963rem;
        font-size:0.555556rem;
        margin: 0.398148rem 0;

        background: $login006 no-repeat;
        background-size: 3.305556rem 0.962963rem;
        @extend .button;
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

        num:0,
        num_id:0,
      };
    },
    mounted:function(){},
    methods: {
        buyKa(n){   // 购买

            var self = this;
            var href = location.href;
            href=href.replace('#','');

            http.post('/RoomCard/buyCard',{
                    id: Number(localStorage.oxUid),
                    commodityid: Number(this.num_id),
                    returnurl: href,
                    num: Number(this.num),
                    type: n,// 1支付宝 2微信
                },'',this)
                .then(res => {
                    if(n==1){
                        self.$parent.iframeCss = 'iframeCss02';
                    } else {
                        self.$parent.iframeCss = 'iframeCss03';
                    }
                    
                    self.$parent.iframe = res.url;
                    console.log(res.url)
                    // window.open(res.url)
                })
        },
        buyCard(num,id){      // 购买房卡
            this.num = num;
            this.num_id = id;
            this.buyK = true;
        },
        cardNumber(){
            let reg = new RegExp("^[0-9]*$");
            if(!reg.test(this.cardNum)){
                this.cardNumError = '请输入正确数量';
                setTimeout(()=>{
                    this.cardNumError = 'N张以上，几折优惠';
                }, 1800)
                return false;
            } else if(this.cardNum == 0){
                this.cardNumError = '请输入房卡数量';
                setTimeout(()=>{
                    this.cardNumError = 'N张以上，几折优惠';
                }, 1800)
                return false;
            } else {
                console.log(this.cardNum.replace(/^[0]+/,''))
                this.buyCard(this.cardNum,4);
            }
        },
        buyModal(event) {
            var vModal = document.getElementsByClassName('buyR_modal')
            var Cvar = document.getElementsByClassName('buy')
            var touModal = ()=>{
                vModal[0].style.zIndex <= Cvar[0].style.zIndex ? 
                ( vModal[0].style.zIndex++ && touModal() ) : 
                vModal[0].style.display = 'block';
            }
            touModal()
        },
        noBuyMoal() {
            this.moreCard = false;
            document.getElementsByClassName('buyR_modal')[0].style.display = 'none';
        },
        more() {
            this.buyModal(event);
            this.moreCard = true;
        },
    }
  }
</script>