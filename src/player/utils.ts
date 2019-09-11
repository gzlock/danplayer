export function SecondsToString (seconds: number): string {
  let time: Array<any> = []
  if (seconds > 0) {
    // 分
    let temp = Math.floor(seconds / 3600) * 60
    time.push(temp)

    // 秒
    temp = Math.floor(seconds) - Math.floor(seconds / 60) * 60
    time.push(temp)
  } else {
    time.push(0, 0)
  }

  return time.map(item => {
    if (item.toString().length === 1) {
      item = '0' + item
    }
    return item
  }).join(':')
}
