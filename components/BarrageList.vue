<template>
	<view class="danmu-container">
		<view v-for="(track, index) in tracks" :key="index" class="danmu-track"
			:style="{ top: `${index * trackHeight}px` }">
			<view v-for="(danmu, danmuIndex) in track.danmus" :key="danmu.id" class="danmu-item"
				:style="{ animationDuration: `${danmu.duration}s`, animationDelay: `${danmu.delay}s`, color: danmu.color }"
				@animationend="handleAnimationEnd(index, danmuIndex)">
				{{ danmu.text }}
			</view>
		</view>
	</view>
</template>

<script>
	import {
		request
	} from '../utils'

	export default {
		data() {
			return {
				tracks: [],
				maxTracks: 5,
				danmuQueue: [],
				currentTrackIndex: 0,
				trackHeight: 20, // 每个轨道的高度
			};
		},
		async mounted() {
			await this.getData();
			this.processQueue();
		},
		methods: {
			addDanmu(text) {
				const duration = this.calculateDuration(text); // 根据文本长度计算持续时间
				const delay = Math.random() * 5; // 随机延迟0到5秒
				const color = this.getRandomColor(); // 获取随机颜色
				const id = Date.now(); // 唯一标识符

				this.danmuQueue.push({
					text,
					duration,
					delay,
					color,
					id
				});
			},
			async getData() {
				const res = await request({
					url: 'api/get/barrage',
				})
				const barrageList = res.data.data || [];
				barrageList.forEach((text) => {
					this.addDanmu(text);
				});
			},
			calculateDuration(text) {
				// 根据文本长度计算持续时间，假设每个字符需要0.2秒来滚动（更慢的速度）
				return Math.min(20, text.length * 0.2 + 6); // 最小6秒，最大20秒
			},
			getRandomColor() {
				// 生成随机颜色
				const letters = '0123456789ABCDEF';
				let color = '#';
				for (let i = 0; i < 6; i++) {
					color += letters[Math.floor(Math.random() * 16)];
				}
				return color;
			},
			processQueue() {
				if (this.danmuQueue.length === 0) return;

				for (let i = 0; i < this.maxTracks; i++) {
					if (!this.tracks[i] || this.tracks[i].danmus.length === 0) {
						const nextDanmu = this.danmuQueue.shift();
						if (nextDanmu) {
							if (!this.tracks[i]) {
								this.$set(this.tracks, i, {
									danmus: []
								});
							}
							this.tracks[i].danmus.push(nextDanmu);
						}
					}
				}
				setTimeout(this.processQueue,100)
			},
			handleAnimationEnd(trackIndex, danmuIndex) {
				const danmu = this.tracks[trackIndex].danmus[danmuIndex]
				this.removeDanmu(trackIndex, danmuIndex)
				this.addDanmu(danmu.text)
			},
			removeDanmu(trackIndex, danmuIndex) {
				this.tracks[trackIndex].danmus.splice(danmuIndex, 1);
			},
		},
	};
</script>

<style scoped>
	.danmu-container {
		position: relative;
		width: 100%;
		height: 100px;
		overflow: hidden;
	}

	.danmu-track {
		position: absolute;
		left: 0;
		width: 100%;
		height: 20px;
	}

	.danmu-item {
		position: absolute;
		right: 0;
		/* 初始位置在屏幕右侧 */
		white-space: nowrap;
		transform: translateX(100%);
		/* 初始位置在屏幕外 */
		animation-name: scroll-left;
		animation-timing-function: linear;
		will-change: transform;
	}

	@keyframes scroll-left {
		from {
			transform: translateX(100%);
		}

		to {
			transform: translateX(-100vw);
		}
	}
</style>