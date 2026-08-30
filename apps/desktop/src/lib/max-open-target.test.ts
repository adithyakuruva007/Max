import { describe, expect, it } from 'vitest'

import {
  normalizeMaxOpenString,
  pathFromMaxDeepLink,
  pathFromOpenDeepLink,
  resolveMaxOpenPath
} from './hermes-open-target'

describe('normalizeMaxOpenString', () => {
  it('accepts hash-router paths and strips a leading hash', () => {
    expect(normalizeMaxOpenString('/index-network/intent/1')).toBe('/index-network/intent/1')
    expect(normalizeMaxOpenString('#/index-network/intent/1')).toBe('/index-network/intent/1')
  })

  it('maps plugin-scoped hermes:// deep links to the same path', () => {
    expect(normalizeMaxOpenString('hermes://index-network/intent/1')).toBe('/index-network/intent/1')
    expect(normalizeMaxOpenString('hermes://index-network/intent/1?focus=true')).toBe(
      '/index-network/intent/1?focus=true'
    )
  })

  it('maps hermes://open/… deep links by stripping the open host', () => {
    expect(normalizeMaxOpenString('hermes://open/index-network/intent/1')).toBe('/index-network/intent/1')
    expect(normalizeMaxOpenString('hermes://open/settings/plugins')).toBe('/settings/plugins')
  })

  it('rejects reserved max kinds and unsafe paths', () => {
    expect(normalizeMaxOpenString('hermes://blueprint/morning-brief')).toBeNull()
    expect(normalizeMaxOpenString('hermes://plugin/install')).toBeNull()
    expect(normalizeMaxOpenString('https://example.com/x')).toBeNull()
    expect(normalizeMaxOpenString('/../etc/passwd')).toBeNull()
    expect(normalizeMaxOpenString('index-network')).toBeNull()
  })
})

describe('resolveMaxOpenPath', () => {
  it('merges structured path + params', () => {
    expect(resolveMaxOpenPath({ path: '/index-network/intent/1', params: { focus: 'true' } })).toBe(
      '/index-network/intent/1?focus=true'
    )
  })

  it('resolves href the same as a bare string', () => {
    expect(resolveMaxOpenPath({ href: 'hermes://index-network/intent/1' })).toBe('/index-network/intent/1')
  })
})

describe('pathFromMaxDeepLink', () => {
  it('builds the navigate path from a plugin-scoped deep-link payload', () => {
    expect(pathFromMaxDeepLink('index-network', 'intent/1')).toBe('/index-network/intent/1')
  })

  it('builds the navigate path from hermes://open/… payloads', () => {
    expect(pathFromOpenDeepLink('index-network/intent/1')).toBe('/index-network/intent/1')
    expect(pathFromMaxDeepLink('open', 'agent/42')).toBe('/agent/42')
  })

  it('ignores reserved kinds', () => {
    expect(pathFromMaxDeepLink('blueprint', 'morning-brief')).toBeNull()
    expect(pathFromMaxDeepLink('plugin', 'install')).toBeNull()
  })
})
