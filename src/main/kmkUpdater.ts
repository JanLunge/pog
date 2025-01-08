import { appDir, currentKeyboard } from './store'
import * as fs from 'fs-extra'
import request from 'request'
import decompress from 'decompress'
import { mainWindow } from './index'

// downloads kmk to app storage
export const updateFirmware = async () => {
  const versionSha = 'dbc26504ac9111e6f0b5ba99d1dbf35275319e27'
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
    if (fs.existsSync(`${currentKeyboard.path}/kmk`)) {
      console.log('removing old kmk folder')
      fs.rmSync(`${currentKeyboard.path}/kmk`, { recursive: true, force: true })
    }
    if (!fs.existsSync(`${currentKeyboard.path}/kmk`)) {
      fs.mkdirSync(`${currentKeyboard.path}/kmk`)
    }
    console.log('writing version to keyboard', versionSha)
    fs.writeFileSync(`${currentKeyboard.path}/kmk/version`, versionSha)
    console.log('copying kmk to keyboard', `${currentKeyboard.path}/kmk`)
    const countFiles = async (src: string): Promise<number> => {
      const files = await fs.readdir(src, { withFileTypes: true })
      let count = files.length

      for (const file of files) {
        if (file.isDirectory()) {
          count += (await countFiles(`${src}/${file.name}`)) - 1 // subtract 1 to not count the directory itself twice
        }
      }
      return count
    }

    let processedFiles = 0
    const copyWithProgress = async (src: string, dest: string, totalFiles: number) => {
      const files = await fs.readdir(src, { withFileTypes: true })

      for (const file of files) {
        const srcPath = `${src}/${file.name}`
        const destPath = `${dest}/${file.name}`

        if (file.isDirectory()) {
          await fs.ensureDir(destPath)
          await copyWithProgress(srcPath, destPath, totalFiles)
        } else {
          console.log(
            'copying file',
            destPath,
            processedFiles,
            totalFiles,
            processedFiles / totalFiles
          )
          await fs.copy(srcPath, destPath)
          processedFiles++
          mainWindow?.webContents.send('onUpdateFirmwareInstallProgress', {
            state: 'copying',
            progress: (processedFiles / totalFiles) * 100
          })
        }
      }
    }

    try {
      const sourcePath = `${appDir}/kmk/kmk_firmware-${versionSha}/kmk`
      const totalFiles = await countFiles(sourcePath)
      await copyWithProgress(sourcePath, `${currentKeyboard.path}/kmk`, totalFiles)
      mainWindow?.webContents.send('onUpdateFirmwareInstallProgress', {
        state: 'done',
        progress: 1,
        message: 'Firmware updated successfully, to version ' + versionSha
      })
    } catch (err) {
      console.error('Error during copy:', err)
      mainWindow?.webContents.send('onUpdateFirmwareInstallProgress', {
        state: 'error',
        progress: 0
      })
    }
  } catch (err) {
    console.error(err)
  }
}
