	
const BASEURL = "81.70.52.238/"
	
export async function request(options) {
	const { url, method = 'GET', data = {} } = options
	console.log('81.70.52.238/api/login/openID')
	// console.log(`${BASEURL}/${url}`.indexOf('\u200b'), method, data)
	new Promise((resolve, reject) => {
		uni.request({
			// url: `${BASEURL}${url}`,
			url: 'http://81.70.52.238/api/login/openID',
			method,
			data,
		})
	})
}