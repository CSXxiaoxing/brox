<template>
    <div>
    <!-- <i @click='onprize = false' class='wxx'  v-show='onprize'></i> -->
    <mt-popup
        v-model="onprize"
        popup-transition="popup-fade"
        class="openRecords" :class = '$store.state.idRoom.cardFn == 5 ? "five":"seven" '>
            <i @click='onprize = false' class='gxx'></i>

            <div class='xsllo'>
            <ul :style='"width:"+1.8*ooxDataL+"rem;"'>
                <li  v-for='(obj, inx) in ooxData'>
                    <table  cellspacing="0">
                    <tr>
                        <th>第 {{obj[1]}}局</th>
                    </tr>
                    <tr v-for='(data, ix) in obj[0].niu'>
                        <td :style='ix==obj[0].banker ? "color: #F6BBBD;":""'>
                            {{oox[data]}}
                        </td>
                    </tr>
                    </table>
                </li>
            </ul>
            </div>
    </mt-popup>
    <loading v-if='loading'></loading>
    </div>
</template>
<!-- cellspacing="0"// position: sticky; -->
<style lang='scss' scoped>
    @import '../../utils/baseVar.scss';
    td.yellow{
        color: #F2D923;
    }
    .gxx{
        height: 0.972222rem;
        width: 0.907407rem;
        position: absolute;
        right: 0.1rem;
        top: -0.1rem;
        background: $off no-repeat;
        background-size: 0.907407rem 0.972222rem;
    }
    .openRecords{
        height: 8.8rem;
        width: 9.555556rem;
        background: $open no-repeat;
        background-size: 9.555556rem 8.8rem;
        border-top-right-radius: 0.49rem;
        padding: 95px 50px 56px;
        box-sizing: border-box;
        .xsllo{
            width: 100%;
            position: relative;
            left: 50%;
            transform: translate(-50%,0);
            height: 6.851852rem;
            overflow-x: auto;
            overflow-y: hidden;
            border: 1px solid #8C996D;
        }
        .xsllo::-webkit-scrollbar {
            display: none;
        }
        ul{
            height: 100%;
            display: flex;
            li{
                width: 2rem;
                height: 100%;
                border-right: 1px solid #B4B6B1;
            }
            table{
                height: 100%;
                width: 100%;

                tr{
                    height: 12.5%;
                    background: #2B1E56;
                    border: 1px solid #fff;
                }
                tr:nth-of-type(1){
                    background: rgba(0,0,0,0);
                    color: #fff;
                    height: .533333rem;
                    // font-size
                }
                th{
                    font-size: 0.4rem;
                    border: 1px solid #A8B0A5;
                    background: rgba(0,0,0,0);
                }
                td{
                    border: 1px solid #fff;
                    font-size: 0.314815rem;
                    color: #FFFDC2;
                    font-weight: 600;
                }
                tr:nth-of-type(2n){
                    background: #1F1345;
                }
            }
        }
    }
</style>
 
<script type="text/javascript">
import http from '../../utils/httpClient.js'
import Vue from 'vue';
import loading from '../../components/loading/loading.vue';
import router from '../../router/';
Vue.component('loading', loading)
    export default {
        data: function () {
          return {
            loading: false,     // loading
            onprize : false,    // 对
            cardNum : this.$store.state.idRoom.cardFn,
            bureau : [],
            cardResult : [],
            
            // unshift
            index : [],
            ooxData: [],
            ooxDataL: 0,
            oox: ['没牛','牛一', '牛二', '牛三', '牛四', '牛五', '牛六', '牛七', '牛八', '牛九', '牛牛', '五花牛'],
          }
        },
        mounted: function(){
        },
        methods: {
            // 倒序inverted
            inverted : function(){
                function length(o) {
                    var count = 0;
                    for(var i in o){count ++;}
                    return count;
                };
                console.log(length(this.bureau));
            },

        }
    }
</script>