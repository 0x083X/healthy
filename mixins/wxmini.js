import { mapState } from 'vuex'
export default {
	data() {
		return {
			
		}
	},
	computed: {
		...mapState('wxmini', ['appId', 'wxPayState'])
	},
	methods: {
		// 获取签名
		getSign(params, signType) {
			return signType(params).toUpperCase()
		},
		wxPay() {
			console.log(this.appId, this.wxPayState)
			debugger
			const timeStamp = String(Date.now())
			const params = `timeStamp=${timeStamp}&nonceStr=${this.wxPayState.noncestr}&package=${this.wxPayState.package}`
			uni.requestPayment({
				provider: 'wxpay', // 服务提提供商
				timeStamp, // 时间戳
				nonceStr: this.wxPayState.nonceStr, // 随机字符串
				package: this.wxPayState.package,
				signType: "MD5", // 签名算法
				paySign: this.getSign(params, this.$md5), // 签名
				success: function (res) {
					console.log('支付成功',res);
					// 业务逻辑。。。
				},
				fail: function (err) {
					console.log('支付失败',err);
				}
			});		
		}
	}
}