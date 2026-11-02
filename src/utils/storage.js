import { validateSettings } from "./settings"

const STORAGE_KEY = "life-simulator:settings:v1"
const SCHEMA_VERSION = 1

export function loadSettings(defaults) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return defaults
    }
    const parsed = JSON.parse(raw)
    if (
      !parsed ||
      parsed.version !== SCHEMA_VERSION ||
      typeof parsed.settings !== "object"
    ) {
      return defaults
    }
    const merged = { ...defaults, ...parsed.settings }
    return validateSettings(merged) === "" ? merged : defaults
  } catch {
    return defaults
  }
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: SCHEMA_VERSION, settings })
    )
  } catch {
    // storage unavailable or full: settings simply are not persisted
  }
}
