import { describe, expect, it } from 'vitest'

import { formatDesktopLogLine } from './desktop-log-line'

describe('formatDesktopLogLine', () => {
  it('prefixes each line with an ISO-8601 timestamp and the max tag', () => {
    const line = formatDesktopLogLine('[boot] Resolving Max backend')

    // Shape contract (not a snapshot): every desktop log line starts with
    // an ISO timestamp so multi-surface logs are chronologically readable.
    // See #84405.
    expect(line).toMatch(
      /^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[hermes\] \[boot\] Resolving Max backend$/
    )
  })

  it('keeps the message verbatim after the prefix', () => {
    const line = formatDesktopLogLine('Max backend exited (0)')

    expect(line).toMatch(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[hermes\] Max backend exited \(0\)$/)
  })
})
