/**
    校验手机号
    @param {String}phone 手机号
    @return {Boolean} 
*/
const phoneValid = function(phone) {
	if (/^(1)[0-9]{10}$/.test(phone)) {
		return true
	}
    return false
}

export {phoneValid}
