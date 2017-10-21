
//https://ilikekillnerds.com/2017/05/convert-firebase-database-snapshotcollection-array-javascript/
export const snapshotToArray = snapshot =>
  Object.entries(snapshot).map(e =>
    Object.assign(e[1], { id: e[0] })
  )