import * as fs from 'fs-extra'
import { currentKeyboard } from './store'
import { dialog } from 'electron'
import { connectedKeyboardPort, connectSerialKeyboard, serialBoards } from './index'
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
  if (!fs.existsSync(`${path}`)) {
    return { error: 'pathNotFound' }
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
export const selectKeyboard = async ({ path, id }: { path: string; id: string }) => {
  console.log(path,id)
  if (path) {
    console.log('checking keyboard files for', path)
    return await loadKeyboard(path)
  } else if (id) {
    console.log('connecting serial keyboard')
    const port = serialBoards.value.find((a) => a.id === id)
    console.log(serialBoards, id)
    await connectSerialKeyboard(port)
    connectedKeyboardPort.write('info\n')
    return { success: true }
  }
  return { error: 'not all args provided' }
}
