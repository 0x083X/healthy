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
		wxPay(params) {
			const { timeStamp, nonceStr, orderID, signType, paySign, pay_id } = params
			uni.requestPayment({ 
				provider: 'wxpay', // 服务提提供商
				timeStamp: String(timeStamp), // 时间戳
				nonceStr, // 随机字符串
				package: orderID, 
				signType, // 签名算法
				paySign, // 签名
				success: async (res) => {
					const msg = await this.$request({
						url: `api/get/pay/result?id=${pay_id}`,
						method: 'GET',
					})
					const status = msg?.data?.data?.success
					console.log(msg, status)
					// if (status) {
						uni.redirectTo({
							url: '/pages/result/result'
						})
					// }
					// 业务逻辑。。。
				},
				fail: function (err) {
					console.log(err)
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