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

  const folderContents = await fs.promises.readdir(`${filePaths[0]}`)
  // check for kmk, code.py and boot.py
  currentKeyboard.path = filePaths[0]
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
  return {
    path: filePaths[0],
    folderContents,
    codeContents,
    configContents
  }
}
