export function dualEnv(suffix: string): string | undefined {
  return process.env[`MAX_${suffix}`] ?? process.env[`MAX_${suffix}`]
}
