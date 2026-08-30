export function logError(error: unknown): void {
  if (!(process.env.MAX_INK_DEBUG_ERRORS ?? process.env.HERMES_INK_DEBUG_ERRORS)) {
    return
  }

  console.error(error)
}
