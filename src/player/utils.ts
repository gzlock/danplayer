export function SecondsToString (seconds: number): string {
  let time = []
  // 小时
  let temp: string | number = Math.floor(seconds / (60 * 60))
  if (temp > 0) {
    if (temp.toString().length === 1) {
      temp = '0' + temp
    }
    time.push(temp)
  }

  // 分
  temp = Math.floor(seconds / 60) - Math.floor(seconds / 3600) * 60
  if (temp.toString().length === 1) {
    temp = '0' + temp
  }
  time.push(temp)

  // 秒
  temp = Math.floor(seconds) - Math.floor(seconds / 60) * 60
  if (temp.toString().length === 1) {
    temp = '0' + temp
  }
  time.push(temp)
  return time.join(':')
}
