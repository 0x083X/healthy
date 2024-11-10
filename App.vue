<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	* {
		box-sizing: border-box;
	}
	html,
	body,
	uni-page-body {
		height: 100%;
	}
</style>
