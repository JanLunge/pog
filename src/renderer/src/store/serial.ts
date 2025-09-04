import { ref } from 'vue'

export const serialLogs = ref<string[]>([])

const MAX_LOGS = 500

export function addSerialLine(raw: string) {
  const line = String(raw || '').trim()
  if (!line) return
  // ignore consecutive duplicates
  if (serialLogs.value[0] === line) return
  serialLogs.value.unshift(line)
  if (serialLogs.value.length > MAX_LOGS) serialLogs.value.length = MAX_LOGS
}


