export default {
	methods: {
		async deleteOrder(item) {
			this.loading = true
			const orderIds = item instanceof Array ? item : [item]
			const res = await this.$request({
				url: "api/batch/delete/order",
				method: "POST",
				data: {
					orderIds
				}
			})
			if (res.data.status !== 0) {
				uni.showToast({
					title: res.data.message,
					icon: 'none'
				})
				return
			}
			uni.reLaunch({
				url: '/pages/order_list/order_list'
			})
			this.loading = false
			// this.getOrderList()
		},
		async cancelOrder(item, url = '/pages/order_list/order_list') {
			this.loading = true
			const {
				orderId,
				pay_id
			} = item
			const res = await this.$request({
				url: "api/cancel/order",
				method: "PUT",
				data: {
					orderId,
					pay_id
				}
			})
			if (res.data.status !== 0) {
				uni.showToast({
					title: res.data.message,
					icon: 'none'
				})
				return
			}
			this.loading = false
				
			if (url === '/pages/order_list/order_list') {
				uni.reLaunch({
					url
				})
			} else {
				uni.redirectTo({
					url
				})
			}
			// this.getOrderList()
		},
	},
}