<template>
    <footer>
        <ul>
            <li @click='$parent.child_KA(6)'>
                <span>好友</span>
                <span class='dot' v-if='$store.state.system.lodin.length>0'>{{$store.state.system.lodin.length}}</span>
            </li>
            <li @click='$parent.varRoom'><span>创建房间</span></li>
            <li @click='$parent.child_KA(1)'><span>进入房间</span></li>
            <li @click='$parent.child_KA(4)'><span>我的房间</span></li>
        </ul>
    </footer>
</template>
<script type="text/javascript">
    export default {
        data: function(){
            return {
            
            }
        }
    }
</script>