import { appDir, currentKeyboard } from './store'
import * as fs from 'fs-extra'
import request from 'request'
import decompress from 'decompress'
import { mainWindow } from './index'
import { detectionFirmware } from './pythontemplates/detection'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { app } from 'electron'
import { bootpy } from './pythontemplates/boot'

// downloads kmk to app storage
export const updateFirmware = async () => {
  const versionSha = '5a6669d1da219444e027fb20f57d4f5b3ecdedfe'
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
      const countFilesRecursive = async (dir: string): Promise<number> => {
        const files = await fs.readdir(dir, { withFileTypes: true })
        let count = files.length

        for (const file of files) {
          if (file.isDirectory()) {
            count += await countFilesRecursive(`${dir}/${file.name}`)
          }
        }
        return count
      }

      const deleteWithProgress = async (dir: string) => {
        let processedFiles = 0
        const totalFiles = await countFilesRecursive(dir)

        const deleteRecursive = async (currentDir: string) => {
          const currentFiles = await fs.readdir(currentDir, { withFileTypes: true })
          for (const file of currentFiles) {
            const filePath = `${currentDir}/${file.name}`
            if (file.isDirectory()) {
              await deleteRecursive(filePath)
            }
            await fs.promises.rm(filePath, { force: true, recursive: true })
            processedFiles++
            mainWindow?.webContents.send('onUpdateFirmwareInstallProgress', {
              state: 'cleaning', 
              progress: (processedFiles / totalFiles) * 100
            })
          }
        }

        await deleteRecursive(dir)
      }
      
      await deleteWithProgress(`${currentKeyboard.path}/kmk`)
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

export async function flashFirmware(firmwarePath: string): Promise<void> {
  try {
    console.log('flashing firmware initial', firmwarePath)
    // Create detection firmware file
    const detectionPath = join(firmwarePath, 'code.py')
    await writeFile(detectionPath, detectionFirmware)

    const bootPath = join(firmwarePath, 'boot.py')
    await writeFile(bootPath, bootpy)
    
    // Wait for the board to restart
    await new Promise(resolve => setTimeout(resolve, 2000))
    mainWindow?.webContents.send('onUpdateFirmwareInstallProgress', {
      state: 'done',
      progress: 1,
      message: 'Initiated detection firmware flashed'
    })
  } catch (error) {
    console.error('Failed to flash firmware:', error)
    throw error
  }
}
