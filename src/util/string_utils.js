export function isFileString (str) {
  return str && Number(str.substring(0, 1)) > 0
}

export function isDriveString (str) {
  return str && str.indexOf(':') > -1
}

export function stringToArray (str) {
  return str ? str.split(' ').filter(item => item) : []
}

export function arrayToObject (arr) {
  return arr && arr.length >= 4
    ? {date: `${arr[0]} ${arr[1]}`, type: Number(arr[2] ? arr[2].replace(/,/g, '') : arr[2]) > 0 ? 'file' : arr[2], size: Number(arr[2] ? arr[2].replace(/,/g, '') : arr[2]) > 0 ? arr[2].replace(',', '') : '', name: arr.filter((item, index) => index > 2).join(' ')}
    : {}
}
