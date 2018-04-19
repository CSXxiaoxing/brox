<template>
	<mt-popup
    v-model="water"
    popup-transition="popup-fade" 
    id="water" >
		<mt-popup 
		    v-model="careTip"
		    popup-transition="popup-fade" :modal='false'
		    class="care" >
		    <span>通知 <i @click="careTip = false">×</i></span>
		    <p>该房间尚未公开</p>
		    <mt-button @click="careTip = false">  确定
		    </mt-button>
		</mt-popup >

		<header>
            <ul>
                <li @click='water=false'>
                    <i></i>
                </li>
                <li>流水报表</li>
            </ul>
        </header>

        <center>
            <!-- <p>{{waterList}}</p> -->
            <table  v-for='(list,listkey) in waterList' border="1" cellpadding="0" cellspacing="0">
    			<thead>
    				<tr>
    					<td colspan="4">第{{waterList.length - listkey}}局</td>
    				</tr>
    				<tr>
    					<td>昵称</td> <td>分数流水</td> <td>抽水分数</td> <td>结余分数</td>
    				</tr>
    			</thead>

    			<tbody>
                    <tr v-for = 'data in list'>
    					<td>{{data.zc_name}} <img src="src/srcImg/room002.png" v-if='data.zc_is_boss == 1'></td>
                        <td :class='data.zn_process >=0 ? "" : "red"' >{{ data.zn_process>=0 ? '+'+ data.zn_process : data.zn_process}}</td> 
                        <td>{{data.zn_points_give}}</td>
                        <td>{{data.zn_points_left}}</td>
    				</tr>
                    <!-- <tr>{{list}}</tr> -->
    				<!-- <tr class="total"  v-if="seen && fz">
    					<td>房间余剩分数</td> <td colspan="3">{{list}}</td>
    				</tr>
    				<tr class="open" v-if="!seen && fz">
    					<td colspan="4" @click="more">点击加载更多</td>
    				</tr> -->
    			</tbody>
    		</table>
        </center>

		
		<loading v-if='loading'></loading>
	</mt-popup>
</template>


<style lang='scss' scoped>
    #water{
        &>header{
            padding-top: 0.8rem;
            height: 1.633333rem;
        }
    }
</style>

<script type="text/javascript">
	import Vue from 'vue';
	import './water.scss';
    import http from '../../utils/httpClient.js';

	import loading from '../loading/loading.vue';
	Vue.component('loading', loading)

  	export default {
    data() {
      	return {
      		loading: false,		// loading
        	water: false,
        	seen: false,
            fz: false,
        	careTip : false,
            waterList :[],
      	};
    },
    mounted: function(){
        var id = this.$store.state.idRoom.id;
        this.gameResult(id)
    },
    methods:{
    	more(){
    		this.seen =!this.seen;
    	},
        gameResult (id) { // 先获取一波所有的游戏结果
            var self = this;
            http.post( '/GameLog/getData', {
                        roomid: id,
                    },'',this)
                .then(res => {
                    console.log(res.data)

                    if(res.status == 1){
                        var zWater = 0; // 庄总分
                        self.waterList = [];
                        self.$store.state.data.listOver = res.data;
                        self.$store.state.data.juAll = res.data.length;
                        res.data.forEach((item,idx)=>{

                            self.waterList.push([])    // 插入
                            item.DRs.forEach(xitem=>{
                                self.waterList[idx].push({
                                    name : xitem.zc_name,   // 名字
                                    water: xitem.zn_process,  // 分数流水
                                    wFen : xitem.zn_points_give,  // 抽水分数
                                    fen : xitem.zn_points_left, // 结余分数
                                    fraction : xitem.zn_points_total, // 剩余分数
                                    ForZ : xitem.zc_is_boss,  // 庄时1，普通玩家是2
                                })
                            })
                        })
                        console.log(self.waterList)
                    }
                })
        },
    	
  	}
	};
</script>