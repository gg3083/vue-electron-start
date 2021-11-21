export function fileSizeFormat (val) {
  let res = val
  if (val) {
    if (val.indexOf(',')) {
      val = val.replace(/,/g, '')
    }
    let num = Number(val)
    if (num >= 1e9) {
      res = `${(num / 1e9).toFixed(2)} gb`
    } else if (num >= 1e6 && num < 1e9) {
      res = `${(num / 1e6).toFixed(2)} mb`
    } else if (num >= 1e3 && num < 1e6) {
      res = `${(num / 1e3).toFixed(2)} kb`
    } else if (num < 1e3) {
      res = `${num} 字节`
    }
    return res
  }
  return res
}
export function typeFormat (row) {
  if (row.type === '<DIR>') {
    return '文件夹'
  }
  let type = row.name.substring(row.name.lastIndexOf('.') + 1, row.name.length)
  return type + ' 文件'
}
