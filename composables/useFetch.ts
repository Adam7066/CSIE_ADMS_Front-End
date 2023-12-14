export const remixUrl = (url: string, paramsName: string, arr: Array<number>) => {
  url += url.includes('?') ? '&' : '?'
  url += paramsName + '=['
  for (let i = 0; i < arr.length; i++) {
    if (i !== 0) url += ','
    url += arr[i].toString()
  }
  url += ']'
  return url
}
