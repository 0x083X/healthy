<template>
	<view>
		<view class="order_container">
			<!-- 日期时间展示 -->
			<view class="timer_show">
				{{date}}
			</view>
			<map id="myMap" style="width: 100%; height: 280px;" :latitude="latitude" :longitude="longitude"
				:markers="markers" show-location></map>
			<form @submit="handleSubmitForm" @reset="formReset">
				<view class="form_item contact_number">
					<view class="item_label">
						<text>联系电话</text>
					</view>
					<input type="item_value" placeholder="请输入联系电话" />
				</view>
				<view class="form_item gender_select">
					<view class="item_label">性别</view>
					<radio-group name="gender_group">
						<label>
							<radio value="1" /><text>男</text>
						</label>
						<label>
							<radio value="0" /><text>女</text>
						</label>
						<label>
							<radio value="2" /><text>沃尔玛塑料袋</text>
						</label>
					</radio-group>
				</view>
				<view class="form_item requirement_state">
					<view class="common_content">
						<view class="item_label">
							<text>需求说明</text>
						</view>
						<radio-group name="checkbox" @change="handleSelectRequire">
							<label>
								<radio value="1" /><text>医院检查</text>
							</label>
							<label>
								<radio value="2" /><text>挂号打点滴</text>
							</label>
							<label>
								<radio value="3" /><text>小型手术陪护</text>
							</label>
							<label>
								<radio value="4" /><text>住院陪护</text>
							</label>
							<label>
								<radio value="5" /><text>其他</text>
							</label>
						</radio-group>
					</view>
					<view v-if="requirementValue == 5" class="other_requirement_content">
						<textarea name="other_requirement_value" id="other_requirement_value" cols="30" rows="10"
							placeholder="请输入其他需求说明"></textarea>
					</view>
				</view>
				<view class="form_item contract_way">
					<view class="item_label">
						<text>如何联系您</text>
					</view>
					<radio-group name="contract_way_group">
						<label>
							<radio value="1" /><text>电话联系</text>
						</label>
						<label>
							<radio value="0" /><text>微信联系</text>
						</label>
						<label>
							<radio value="2" /><text>短信联系</text>
						</label>
						<label>
							<radio value="2" /><text>按时到达地点之后联系</text>
						</label>
					</radio-group>
				</view>
				<view class="form_item contract_way">
					<view class="item_label">
						<text>就诊人特殊情况以及特殊要去说明</text>
					</view>
					<textarea name="special_instructions" id="special_instructions" cols="0" rows="10"
						placeholder="例如:老人或幼童/或者患者有传染可能"></textarea>
				</view>
				<view class="button_group">
					<button form-type="submit">Submit</button>
					<button type="default" form-type="reset">Reset</button>
				</view>
			</form>
		</view>
	</view>
</template>


<script>
	export default {
		data() {
			return {
				title: 'Hello',
				date: '',
				setTime: '',
				// 初始化的中心位置
				latitude: 23.099994,
				longitude: 113.324520,
				// 标记点
				markers: [{
					id: 1,
					latitude: 23.099994,
					longitude: 113.324520,
					name: 'T.I.T 创意园'
				}],
				// 需求说明
				requirementValue: '',
				// 其他需求说明
				otherRequirementValue: '',
			}
		},
		onLoad() {
			var setTime = setInterval(() => {
				let date = new Date()
				let year = date.getFullYear()
				let month = date.getMonth() + 1
				month >= 9 ? month : month = '0' + month
				let day = date.getDate()
				day >= 9 ? day : day = '0' + day
				let hour = date.getHours()
				hour >= 9 ? hour : hour = '0' + hour
				let minute = date.getMinutes()
				minute >= 9 ? minute : minute = '0' + minute
				let second = date.getSeconds()
				second >= 9 ? second : second = '0' + second
				this.date = year + '-' + month + '-' + day + "  " + hour + ":" + minute + ":" + second
			}, 1000)
			const _this = this;
			uni.getSystemInfo({
				success: (res) => {
					_this.mapHeight = res.screenHeight - res.statusBarHeight
					_this.mapHeight = _this.mapHeight
				}
			})
			this.getLocationInfo()
		},
		methods: {
			handleSubmitForm() {
				console.log('提交ss单内容');
			},
			handleResetForm() {
				console.log('重置表单结构');
			},
			// 获取地理位置
			getLocationInfo() {
				var that = this
				uni.getLocation({
					type: 'gcj02',
					success(res) {
						console.log(res, "当前位置");
						that.latitude = res.latitude
						that.longitude = res.longitude
						//标记点
						that.markers = [{
							id: 1,
							latitude: res.latitude,
							longitude: res.longitude,
							iconPath: '../../../static/img/pos.png',
						}]
						that.circles = [{ //在地图上显示圆
							latitude: res.latitude,
							longitude: res.longitude,
							fillColor: "#D9E6EF", //填充颜色
							color: "#A7B6CB", //描边的颜色
							radius: 50, //半径
							strokeWidth: 2 //描边的宽度
						}]
					}
				});
			},

			handleSelectRequire(event) {
				this.requirementValue = event.detail.value || ''
				console.log('requirementValue', this.requirementValue);
			}

		}
	}
</script>

<style>
	/* .order_container {
		height: 100%;

		.form_item {
			display: flex;
			align-items: center;
			height: 44px;
			padding: 10px;

			.item_label {
				padding-right: 8px;
			}

			.common_content {
				display: flex;
				align-items: center;
			}
		}

		.requirement_state {
			display: flex;
			flex-direction: column;
		}

		.other_requirement_content {
			width: 100%;
		}

		#other_requirement_value {
			width: 100%;
			height: 60px;
		}

		#special_instructions {
			height: 42px;
		}
	} */
</style>