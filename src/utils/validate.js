/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

export function isNumeric(number) {
  const numberReg = /^[0-9]{6}$/
  return numberReg.test(number)
}

/**
 * 判断是否是一个有效的手机号码
 * @param phone
 * @returns {boolean}
 */
export function isPhoneAvailable(phone) {
  const phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/
  return phoneReg.test(phone)
}

/**
 * 判断密码是否包含大小写与数字
 * @param password
 * @returns {boolean}
 */
export function isValidPassword(password) {
  if (password.length < 8) {
    return false
  }
  const pwdReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/
  return pwdReg.test(password)
}
