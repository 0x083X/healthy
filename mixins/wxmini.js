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
		},
		addressard(address) {
			let matches = ''
			let province = '';
			let city = '';
			let area = '';
		
			matches = address.match(/(.*?(省|自治区))/)
			if (matches && matches.length > 1) {
				province = matches[matches.length - 2];
				address = address.replace(province, '');
			}
		
			matches = address.match(/(.*?(市|自治州|地区|区划|县))/)
			if (matches && matches.length > 1) {
				city = matches[matches.length - 2];
				address = address.replace(city, '');
			}
		
			matches = address.match(/(.*?(区|县|市|镇|乡|街道))/)
			if (matches && matches.length > 1) {
				area = matches[matches.length - 2];
				address = address.replace(area, '');
			}
		
			let obj = {
				province,
				city,
				area,
				address
			}
		
			return obj;
		},
	}
}