import * as jsrsasign from 'jsrsasign'

export function sortParam(data) {
  const newKey = Object.keys(data).sort()
  // console.log(newKey)
  const NewData = {}
  for (let i = 0; i < newKey.length; i++) {
    NewData[newKey[i]] = data[newKey[i]]
  }
  // console.log(NewData)

  return Object.keys(NewData).map(function(key) {
    return key + '=' + NewData[key]
  }).join('&')
}

export function genParam(data) {
  data['sign'] = signature(data)

  const paramStr = Object.keys(data).map(function(key) {
    return ''.concat(encodeURIComponent(key), '=').concat(encodeURIComponent(data[key]))
  }).join('&')

  // console.log(paramStr)
  return paramStr
}

export function signature(data) {
  const param = sortParam(data)

  try {
    const priKey = '-----BEGIN RSA PRIVATE KEY-----\n' +
      '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\n' +
      '-----END RSA PRIVATE KEY-----\n'
    let rsa = new jsrsasign.RSAKey()
    rsa = jsrsasign.KEYUTIL.getKey(priKey)
    const sig = new jsrsasign.KJUR.crypto.Signature({ alg: 'SHA1withRSA' })
    sig.init(rsa)
    sig.updateString(param)
    return jsrsasign.hex2b64(sig.sign())
    // data['sign'] = jsrsasign.hex2b64(sig.sign())
    // return data
  } catch (e) {
    console.log(e)
  }
}
