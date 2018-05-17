const assist = {
    szClick(self, http) {  // 新-申请上庄
        self.$store.dispatch('yinx10010');
        http.post('/Card/applyBanker', {
            room_id: self.user.rid,
        }).then(res => {
            if (res.code == 200) {
                self.$store.state.user.type = 2;
            }
        })
    },
    xzClick(self, http) {  // 新-申请下庄
        self.$store.dispatch('yinx10010');
        http.post('/Card/applyLostBanker', {
            room_id: self.user.rid,
        }).then(res => {
            if (res.code == 200) {
                self.$store.state.user.type = 5;
            }
        })
    },
}
export default assist;