	
const BASEURL = "junzean.com.cn/"
	
export async function request(options) {
	const { url, method = 'GET', data = {} } = options
	return new Promise((resolve, reject) => {
		uni.request({
			url: `https://${BASEURL}${url}`,
			method,
			data,
			header:{
				authorization: uni.getStorageSync("token") || ''
			}
		}).then(res => {
				
			if (res.data.code === 401) {
				uni.showToast({
					title: '请先登录',
					icon: 'none'
				})
				uni.reLaunch({
					url: '/pages/login/login'
				})
				return
			}
			resolve(res)
		}).catch(err => {
			console.log(err, 'err')
		})
	})
}