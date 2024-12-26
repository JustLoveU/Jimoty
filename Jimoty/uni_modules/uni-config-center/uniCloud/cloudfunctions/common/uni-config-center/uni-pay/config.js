const fs = require('fs')
const path = require('path')
module.exports = {
	// 统一 - 支付回调地址,格式为 "服务空间ID":"URL化地址"
	'notifyUrl': {
		// 线上环境服务空间-支付回调地址（如果只有一个服务空间，则只需要配置线上环境服务空间即可）
		'mp-67be408c-9398-4e3f-bf46-1df6dcf05919': 'https://fc-mp-67be408c-9398-4e3f-bf46-1df6dcf05919.next.bspapp.com/uni-pay-co',
	},
	'notifyKey': '5FB2CD73C7B53918728417C50762E6D45FB2CD73C7B53918728417C50AA20240922', // 跨云函数通信时的加密密钥，建议手动改下，不要使用默认的密钥，长度保持在64位以上即可
	// 微信支付相关
	'wxpay': {
		'enable': true, // 是否启用微信支付
		// 微信 - 小程序支付
		'mp': {
			'appId': 'wx593287587cccdf0f', // 小程序的appid
			'secret': '41fb92f13d1fb000b74b8f90392d9478', // 小程序的secret
			'mchId': '1684856582', // 商户id
			'key': 'LinBaoFangMiniProgram20240930API', // v2的api key
			'pfx': fs.readFileSync(__dirname + '/wxpay/apiclient_cert.p12'), // v2需要用到的证书
			'v3Key': '', // v3的api key
			'appCertPath': path.join(__dirname, 'wxpay/apiclient_cert.pem'), // v3需要用到的证书
			'appPrivateKeyPath': path.join(__dirname, 'wxpay/apiclient_key.pem'), // v3需要用到的证书
			'version': 2, // 启用支付的版本 2代表v2版本 3 代表v3版本
		},
		// 微信 - 公众号支付
		// 'jsapi': {
		// 	'appId': '', // 公众号的appid
		// 	'secret': '', // 公众号的secret
		// 	'mchId': '', // 商户id
		// 	'key': '', // v2的api key
		// 	'pfx': fs.readFileSync(__dirname + '/wxpay/apiclient_cert.p12'), // v2需要用到的证书
		// 	'v3Key': '', // v3的api key
		// 	'appCertPath': path.join(__dirname, 'wxpay/apiclient_cert.pem'), // v3需要用到的证书
		// 	'appPrivateKeyPath': path.join(__dirname, 'wxpay/apiclient_key.pem'), // v3需要用到的证书
		// 	'version': 2, // 启用支付的版本 2代表v2版本 3 代表v3版本
		// },
	},
	// 微信虚拟支付
	// 'wxpay-virtual': {
	// 	// 微信 - 小程序支付
	// 	'mp': {
	// 		'appId': 'wx3bb83933eae376cb', // 小程序的appid
	// 		'secret': 'dbb18f76630a17ad49c7d319f61c040c',
	// 		'mchId': '1684856582', // 商户id
	// 		'offerId': '', // 支付应用ID
	// 		'appKey': '', // 现网AppKey（正式环境）
	// 		'sandboxAppKey': '', // 沙箱AppKey
	// 		'rate': 100, // 代币兑换比例，比如1元兑换100代币，那么这里就是100（需要开通虚拟支付的时候也设置成 1 人民币 = 100 代币）
	// 		'token': '', // 微信小程序通信的token，在开发 - 开发管理 - 消息推送 - Token(令牌)
	// 		'encodingAESKey': '', // 必须43位，微信小程序消息加密密钥，在开发 - 开发管理 - 消息推送 - EncodingAESKey(消息加解密密钥)
	// 		'sandbox': false, // 是否是沙箱环境（注意：沙箱环境异步回调可能有延迟，建议直接正式环境测试）
	// 	}
	// }
}