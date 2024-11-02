	
	const user = {
		namespaced: true,
			
		state: {
			userInfo: {
				avatarUrl: 'http://wx.qlogo.cn/mmopen/vi_32/BMIsAZopI103g6c50LLl6vuUFXepbdGz1z0LK7GECgxQFXz1bCzHG6rIS1QH2PbaUnIiclev0RYBAuZNOWuIYOoKBzWPb1EOsfx5icoND4iaqY/132' ,// 头像地址
				gender: 1 ,// 1为男性，0为女性
				nickName: 'trash', // 微信昵称
			}
		},
		
		mutations: {
			setUserInfo(state, payout) {
				Object.assign(state.userInfo, payout)
			}
		},
		
		actions: {
			
		}
		
	}
	

export default user