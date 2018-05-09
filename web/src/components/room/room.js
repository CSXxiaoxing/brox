const room = {
    jetton : function(idx,self,e){  // 选择筹码
        e = e || event;
        if (self.chouma.one == idx) {
            self.chouma.one = -1;
        } else {
            self.chouma.one = idx;
            self.chouma.LandR = `left:${e.pageX}px;top:${e.pageY}px;`
        }
        return this;
    },
    yazhu : function(idx,self,http,e){ // 押注
        e = e || event;
        // console.log(idx)
        if (self.user.initType != 5) {  // 压分阶段
            return false;
        }
        console.log(self.$store.state.user.userCard)
        var fefefe = [ 1, 5, 10, 50, 100 ];
        var fen = null;
        switch(self.chouma.one){
        case 1:  fen=1;   break;
        case 2:  fen=5;   break;
        case 3:  fen=10;  break;
        case 4:  fen=50;  break;
        case 5:  fen=100; break;
        }
        if (Number(self.$store.state.user.userCard) < fen){
            return false;
        }
        http.post('/Card/cardLog', {
            room_id: self.user.rid,     // 房间id
            card_num: idx,               // 第几副牌
            points: fen,               // 压分分数
        })
            .then(res => {
                if (res.code == 200) {
                    self.chouma.liCss[idx] = 1;
                    var header_H = document.querySelector('#app').offsetHeight;
                    var imgOnes = document.getElementsByClassName('clickFen02');
                    var idxCard = self.move.bounce.length;
                    self.move.imgNum += 1;                          // 复制
                    self.$set(self.move.srcImgStyle, idxCard, `visibility:visible;left:${e.clientX-10}px;top:${e.clientY-10}px;z-index:510;transform:translate(-50%,-50%);`);
                    self.move.bounce[idxCard] = fen;                  // 压分分数
                }
            })
    },
    cuoinit : function(self,ev){ // 搓牌开始
        ev = ev || event;
        var hezi =document.getElementsByClassName('cuopaiCard')[0].getBoundingClientRect();
        self.ka.type=0;
        self.ka.initY=0;
        self.ka.cardH=0;
        self.ka.heziType='';
        if (ev.changedTouches.length == 1) {    // 只有一个手指触摸
            var touY = ev.changedTouches[0].pageY;
            self.ka.cardH = hezi.height;
            self.ka.initY = touY;
        }
        return this;
    },
    cuoka : function(self,ev){ // 搓牌实现
        ev = ev || event;
        var img1_H=document.getElementsByClassName('cuopaiCard')[0].children[0].getBoundingClientRect().height;
        var img1_W=document.getElementsByClassName('cuopaiCard')[0].children[0].getBoundingClientRect().width;
        var [init_touY, init_H, touY] = [self.ka.initY, self.ka.cardH, ev.changedTouches[0].pageY];
        var y = init_touY-touY;

        if (ev.changedTouches.length == 1 && touY<init_touY) {    // 只有一个手指触摸
            self.ka.heziType = 'height:'+(init_H-y)+'px;';
            self.ka.img02    = 'transform: translate(-50%, -'+(y*2)+'px);z-index: 50;';
            if(y>=img1_H/2){
                self.ka.type = 1;
                self.ka.heziType = 'height:'+(self.ka.cardH)+'px;';
                self.ka.img02 = 'height:'+img1_H+'px;width:'+img1_W+'px;top: 0;transform: translate(-50%,0.3rem); transition: all 0.3s; z-index: 50;';
            }
        }
        return this;
    },
    cuoEnd: function(self,ev){ // 搓牌结束
        ev = ev || event;
        if(self.ka.type == 0){
            self.ka.heziType = 'height:'+(self.ka.cardH)+'px;';
            self.ka.img02 = 'transform: translate(-50%, 0px);z-index: 50;';
        }
        return this;
    },
    
}

export default room;