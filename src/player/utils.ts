export function SecondsToString (seconds: number, format: string = 'hh:mm:ss'): string {
  seconds = parseInt(seconds.toString(), 10)
  let h = 0
  let m = 0
  let s = 0
  if (seconds > 0) {
    // 时
    if (format.indexOf('h') > -1) h = Math.floor(seconds / 3600)
    // 分
    if (format.indexOf('m') > -1) m = Math.floor((seconds - (h * 3600)) / 60)
    // 秒
    s = seconds - (h * 3600) - (m * 60)
  }
  format = format
    .split('hh').join(h.toString().padStart(2, '0'))
    .split('h').join(h.toString())
    .split('mm').join(m.toString().padStart(2, '0'))
    .split('m').join(m.toString())
    .split('ss').join(s.toString().padStart(2, '0'))
    .split('s').join(s.toString())
  return format
}

export function LoadMimeType (url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const http = new XMLHttpRequest()
    http.open('GET', url)
    http.send()
    http.onreadystatechange = () => {
      if (http.readyState === XMLHttpRequest.HEADERS_RECEIVED) {
        if (http.status === 200) {
          const type = http.getResponseHeader('Content-Type')
          if (type) {
            resolve(type)
          } else {
            reject(new Error('No Content-Type'))
          }
        } else {
          reject(new Error('Http Status Not 200, return:' + http.status))
        }
        http.abort()
      }
    }
  })
}

export function Hash (str: string) {
  let hash = 0
  let i
  let chr
  if (str.length === 0) return hash
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + chr
    hash |= 0 // Convert to 32bit integer
  }
  return hash
}

export function RandomID (len: number = 6): string {
  const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

  let rtn = ''
  for (let i = 0; i < len; i++) {
    rtn += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length))
  }
  return rtn
}
