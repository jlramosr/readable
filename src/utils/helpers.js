export const timestampToHuman = timestamp => 
  new Date(timestamp).toLocaleString('en-US')

export const capitalize = (str = '') => {
  return !str || typeof str !== 'string'
    ? ''
    : str[0].toUpperCase() + str.slice(1)
}