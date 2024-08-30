const fs = require('fs')
const path = require('path')
const execSync = require('child_process').execSync

function findNativeModules(dir, fileList = []) {
  const files = fs.readdirSync(dir)

  files.forEach((file) => {
    const filePath = path.join(dir, file)
    const fileStat = fs.lstatSync(filePath)

    if (fileStat.isDirectory()) {
      findNativeModules(filePath, fileList)
    } else if (filePath.endsWith('.node')) {
      fileList.push(filePath)
    }
  })

  return fileList
}

const resign = () => {
  if (process.platform !== 'darwin') return

  const nativeModules = findNativeModules('./node_modules')
  console.log(nativeModules)

  nativeModules.forEach((module) => {
    // const fullPath = path.join(appOutDir, "pog.app", module)
    execSync(`codesign --deep --force --verbose --sign "BLH4PG2L7J" "${module}"`)
  })
  console.log('signed all node modules')
}

resign()
