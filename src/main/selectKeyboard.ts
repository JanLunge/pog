import * as fs from 'fs-extra'
import { currentKeyboard } from './store'
import { dialog } from 'electron'
// select a keyboard
export const handleSelectDrive = async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openDirectory']
  })
  if (canceled) {
    return
  }
  return await loadKeyboard(filePaths[0])
}
const loadKeyboard = async (path) => {
  if(!fs.existsSync(`${path}`)){
    return {error: 'pathNotFound'}
  }
  const folderContents = await fs.promises.readdir(`${path}`)
  // check for kmk, code.py and boot.py
  currentKeyboard.path = path
  let codeContents: string | undefined = undefined
  if (folderContents.includes('code.py')) {
    codeContents = await fs.promises.readFile(`${currentKeyboard.path}/code.py`, {
      encoding: 'utf8',
      flag: 'r'
    })
  }
  let configContents = undefined
  if (folderContents.includes('pog.json')) {
    configContents = JSON.parse(
      await fs.promises.readFile(`${currentKeyboard.path}/pog.json`, {
        encoding: 'utf8',
        flag: 'r'
      })
    )
  }
  console.log('found something', folderContents)
  return {
    path,
    folderContents,
    codeContents,
    configContents
  }
}
export const selectKeyboard = async (keyboardPath) => {
  console.log('checking keyboard files for', keyboardPath)
  return await loadKeyboard(keyboardPath)
}
