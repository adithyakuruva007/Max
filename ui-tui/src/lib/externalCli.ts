import { spawn } from 'node:child_process'
import { dualEnv } from '../config/env.js'

export interface LaunchResult {
  code: null | number
  error?: string
}

const resolveMaxBin = () => dualEnv('BIN')?.trim() || 'max'

export const launchMaxCommand = (args: string[]): Promise<LaunchResult> =>
  new Promise(resolve => {
    const child = spawn(resolveMaxBin(), args, { stdio: 'inherit' })

    child.on('error', err => resolve({ code: null, error: err.message }))
    child.on('exit', code => resolve({ code }))
  })
