<template>
	<view class="">
		<u-radio-group
		    v-model="autoChoose"
		    placement="column"
			iconPlacement="right"
		  >
			<u-radio
			  v-for="item in payTypeConfig"
			  :customStyle="{marginBottom: '8px'}"
			  :key="item.type"
			  :label="item.name"
			/>
		  </u-radio-group>
	</view>
</template>

<script>
	import payTypeConfig from '../utils/payTypeConfig'
	export default {
		props: {
			payTypeConfig: {
				type: Object,
				require: true
			},
			autoChoose: {
				type: String,
				require: true
			}
		},
		data() {
			return {
			}
		}
	}
</script>

<style lang="scss">
	
</style>