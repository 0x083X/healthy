	
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
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}