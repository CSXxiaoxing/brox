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
    					<td>昵称</td> <td>当前钻石</td> <td>奖金分数</td> <td>结余钻石</td>
    				</tr>
    			</thead>

    			<tbody>
                    <tr v-for = 'data in list'>
    					<td>{{data.nickname}} <img src="../../oxImg/room002.png" v-if='data.is_boss == 1'></td>
                        <td :class='data.points >=0 ? "" : "red"' >{{ data.points>=0 ? '+'+ data.points : data.points}}</td> 
                        <td>{{data.give_points}}</td>
                        <td>{{data.fact_points}}</td>
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
        // this.gameResult(id)
    },
    methods:{
    	more(){
    		this.seen =!this.seen;
    	},
        gameResult (id) { // 先获取一波所有的游戏结果
            var self = this;
        },
    	
  	}
	};
</script>