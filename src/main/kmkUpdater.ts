import { appDir, currentKeyboard } from './store'
import * as fs from 'fs-extra'
import request from 'request'
import decompress from 'decompress'
import { mainWindow } from './index'

// downloads kmk to app storage
export const updateFirmware = async () => {
  const versionSha = 'f6346937d865f7e1f6baaae93ae5c9be935aae75'
  console.log('updating kmk firmware', appDir, versionSha)
  const file_url = `https://github.com/KMKfw/kmk_firmware/archive/${versionSha}.zip`
  const targetPath = appDir + 'kmk.zip'
  if (!fs.existsSync(appDir)) {
    fs.mkdirSync(appDir)
  }
  // Save variable to know progress
  let received_bytes = 0
  let total_bytes = 0
  mainWindow?.webContents.send('update-kmk-progress', {
    state: 'downloading',
    progress: received_bytes / total_bytes
  })

  const out = fs.createWriteStream(targetPath)
  // download the newest version on
  await new Promise<void>((resolve, reject): void => {
    request
      .get(file_url)
      .on('response', (data) => {
        // Change the total bytes value to get progress later.
        total_bytes = parseInt(data.headers['content-length']) || 1028312
        console.log('updated total', total_bytes, data.headers, data.statusCode)
      })
      .on('data', (chunk) => {
        // Update the received bytes
        received_bytes += chunk.length
        console.log(total_bytes, received_bytes)
        mainWindow?.webContents.send('onUpdateFirmwareInstallProgress', {
          state: 'downloading',
          progress: received_bytes / total_bytes
        })
      })
      .pipe(out)
      .on('finish', async () => {
        console.log('kmk downloaded')
        mainWindow?.webContents.send('onUpdateFirmwareInstallProgress', {
          state: 'unpacking',
          progress: 0
        })
        resolve()
      }).onerror = (err) => {
      console.error(err)
      reject()
    }
  })
  // decompress the downloaded zip file
  await decompress(`${appDir}kmk.zip`, `${appDir}/kmk`)
    .then((files) => {
      console.log('kmk decompressed', files.length)
      mainWindow?.webContents.send('onUpdateFirmwareInstallProgress', {
        state: 'copying',
        progress: 0
      })
    })
    .catch((error) => {
      console.log(error)
    })
  // file copy needs to await the decompression
  try {
    console.log('moving kmk into keyboard')
    // write a file to the keyboard with the version sha
    fs.mkdirSync(`${currentKeyboard.path}/kmk`)
    fs.writeFileSync(`${currentKeyboard.path}/kmk/version`, versionSha)
    fs.cp(
      `${appDir}/kmk/kmk_firmware-${versionSha}/kmk`,
      `${currentKeyboard.path}/kmk`,
      { recursive: true },
      (e) => {
        console.log('Copying of KMK done', e)
        mainWindow?.webContents.send('onUpdateFirmwareInstallProgress', {
          state: 'done',
          progress: 0
        })
      }
    )
  } catch (err) {
    console.error(err)
  }
}
