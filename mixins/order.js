export default {
	methods: {
		async deleteOrder(item) {
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
			// this.getOrderList()
		},
		async cancelOrder(item, url = '/pages/order_list/order_list') {
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
			uni.reLaunch({
				url
			})
			// this.getOrderList()
		},
	},
}