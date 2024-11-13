	
const BASEURL = "81.70.52.238/"
	
export async function request(options) {
	const { url, method = 'GET', data = {} } = options
	return new Promise((resolve, reject) => {
		uni.request({
			url: `http://${BASEURL}${url}`,
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