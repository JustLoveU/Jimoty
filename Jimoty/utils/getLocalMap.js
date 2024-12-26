// 通过高德获取本地的位置
export function getLocalMap() {

	let historyCity = uni.getStorageSync('HistoryCity')

	if (historyCity && historyCity.time) {
		if (Date.now() - historyCity.time > 1000 * 60 * 60 * 24 * 30) {
			getIp()
		} else {
			console.log('位置已存在')
		}
	} else {
		getIp()
	}

}

function getIp() {
	let str = ''
	wx.getLocation({
		type: 'wgs84',
		success: function(data) {
			console.log('当前位置的经度：' + data.longitude)
			console.log('当前位置的纬度：' + data.latitude)
			let longitude = Number(data.longitude.toFixed(6))
			let latitude = Number(data.latitude.toFixed(6))

			uni.request({
				url: `https://restapi.amap.com/v3/geocode/regeo?location=${longitude},${latitude}&key=5a1b7f0c30df0aac815403ea512b3d32&extensions=base`,
				success(res) {
					if (typeof res.data.regeocode.formatted_address === 'string') {
						str = res.data.regeocode.formatted_address
					} else {
						str = '中国'
					}

					let obj = {
						city: str,
						time: Date.now(),
						length: 10000,
						longitude: longitude ? longitude : '112.92422633168802',
						latitude: latitude ? latitude : '28.912219082470116'
					}
					uni.setStorageSync('HistoryCity', obj)
				}
			})
		}
	})
}