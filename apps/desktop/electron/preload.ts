import { contextBridge, ipcRenderer, webUtils } from 'electron'

contextBridge.exposeInMainWorld('maxDesktop', {
  getConnection: profile => ipcRenderer.invoke('max:connection', profile),
  revalidateConnection: () => ipcRenderer.invoke('max:connection:revalidate'),
  touchBackend: profile => ipcRenderer.invoke('max:backend:touch', profile),
  getGatewayWsUrl: profile => ipcRenderer.invoke('max:gateway:ws-url', profile),
  openSessionWindow: (sessionId, opts) => ipcRenderer.invoke('max:window:openSession', sessionId, opts),
  openNewSessionWindow: () => ipcRenderer.invoke('max:window:openNewSession'),
  petOverlay: {
    // Main renderer → main process: window lifecycle + drag. `request` is
    // `{ bounds, screen }`; resolves with the screen bounds it actually used.
    open: request => ipcRenderer.invoke('max:pet-overlay:open', request),
    close: () => ipcRenderer.invoke('max:pet-overlay:close'),
    setBounds: bounds => ipcRenderer.send('max:pet-overlay:set-bounds', bounds),
    setIgnoreMouse: ignore => ipcRenderer.send('max:pet-overlay:ignore-mouse', ignore),
    // Flip the overlay focusable (and focus it) while the composer needs keys.
    setFocusable: focusable => ipcRenderer.send('max:pet-overlay:set-focusable', focusable),
    // Main renderer → overlay (forwarded by main): push the latest pet state.
    pushState: payload => ipcRenderer.send('max:pet-overlay:state', payload),
    // Overlay → main renderer (forwarded by main): pop back in / composer submit.
    control: payload => ipcRenderer.send('max:pet-overlay:control', payload),
    // Overlay subscribes to state pushes.
    onState: callback => {
      const listener = (_event, payload) => callback(payload)
      ipcRenderer.on('max:pet-overlay:state', listener)

      return () => ipcRenderer.removeListener('max:pet-overlay:state', listener)
    },
    // Main renderer subscribes to overlay control messages.
    onControl: callback => {
      const listener = (_event, payload) => callback(payload)
      ipcRenderer.on('max:pet-overlay:control', listener)

      return () => ipcRenderer.removeListener('max:pet-overlay:control', listener)
    }
  },
  getBootProgress: () => ipcRenderer.invoke('max:boot-progress:get'),
  getConnectionConfig: profile => ipcRenderer.invoke('max:connection-config:get', profile),
  saveConnectionConfig: payload => ipcRenderer.invoke('max:connection-config:save', payload),
  applyConnectionConfig: payload => ipcRenderer.invoke('max:connection-config:apply', payload),
  testConnectionConfig: payload => ipcRenderer.invoke('max:connection-config:test', payload),
  probeConnectionConfig: remoteUrl => ipcRenderer.invoke('max:connection-config:probe', remoteUrl),
  oauthLoginConnectionConfig: remoteUrl => ipcRenderer.invoke('max:connection-config:oauth-login', remoteUrl),
  oauthLogoutConnectionConfig: remoteUrl => ipcRenderer.invoke('max:connection-config:oauth-logout', remoteUrl),
  profile: {
    get: () => ipcRenderer.invoke('max:profile:get'),
    set: name => ipcRenderer.invoke('max:profile:set', name)
  },
  api: request => ipcRenderer.invoke('max:api', request),
  notify: payload => ipcRenderer.invoke('max:notify', payload),
  requestMicrophoneAccess: () => ipcRenderer.invoke('max:requestMicrophoneAccess'),
  readFileDataUrl: filePath => ipcRenderer.invoke('max:readFileDataUrl', filePath),
  readFileText: filePath => ipcRenderer.invoke('max:readFileText', filePath),
  selectPaths: options => ipcRenderer.invoke('max:selectPaths', options),
  writeClipboard: text => ipcRenderer.invoke('max:writeClipboard', text),
  saveImageFromUrl: url => ipcRenderer.invoke('max:saveImageFromUrl', url),
  saveImageBuffer: (data, ext) => ipcRenderer.invoke('max:saveImageBuffer', { data, ext }),
  saveClipboardImage: () => ipcRenderer.invoke('max:saveClipboardImage'),
  getPathForFile: file => {
    try {
      return webUtils.getPathForFile(file) || ''
    } catch {
      return ''
    }
  },
  normalizePreviewTarget: (target, baseDir) => ipcRenderer.invoke('max:normalizePreviewTarget', target, baseDir),
  watchPreviewFile: url => ipcRenderer.invoke('max:watchPreviewFile', url),
  stopPreviewFileWatch: id => ipcRenderer.invoke('max:stopPreviewFileWatch', id),
  setTitleBarTheme: payload => ipcRenderer.send('max:titlebar-theme', payload),
  setNativeTheme: mode => ipcRenderer.send('max:native-theme', mode),
  setTranslucency: payload => ipcRenderer.send('max:translucency', payload),
  setPreviewShortcutActive: active => ipcRenderer.send('max:previewShortcutActive', Boolean(active)),
  openExternal: url => ipcRenderer.invoke('max:openExternal', url),
  openPreviewInBrowser: url => ipcRenderer.invoke('max:openPreviewInBrowser', url),
  fetchLinkTitle: url => ipcRenderer.invoke('max:fetchLinkTitle', url),
  sanitizeWorkspaceCwd: cwd => ipcRenderer.invoke('max:workspace:sanitize', cwd),
  settings: {
    getDefaultProjectDir: () => ipcRenderer.invoke('max:setting:defaultProjectDir:get'),
    setDefaultProjectDir: dir => ipcRenderer.invoke('max:setting:defaultProjectDir:set', dir),
    pickDefaultProjectDir: () => ipcRenderer.invoke('max:setting:defaultProjectDir:pick')
  },
  zoom: {
    // Current zoom of this window, as { level, percent }.
    get: () => ipcRenderer.invoke('max:zoom:get'),
    setPercent: percent => ipcRenderer.send('max:zoom:set-percent', percent),
    // Fires on every zoom change, including the Ctrl/Cmd +/-/0 shortcuts,
    // so the settings UI can stay in sync with the keyboard.
    onChanged: callback => {
      const listener = (_event, payload) => callback(payload)
      ipcRenderer.on('max:zoom:changed', listener)

      return () => ipcRenderer.removeListener('max:zoom:changed', listener)
    }
  },
  revealLogs: () => ipcRenderer.invoke('max:logs:reveal'),
  getRecentLogs: () => ipcRenderer.invoke('max:logs:recent'),
  readDir: dirPath => ipcRenderer.invoke('max:fs:readDir', dirPath),
  gitRoot: startPath => ipcRenderer.invoke('max:fs:gitRoot', startPath),
  revealPath: targetPath => ipcRenderer.invoke('max:fs:reveal', targetPath),
  renamePath: (targetPath, newName) => ipcRenderer.invoke('max:fs:rename', targetPath, newName),
  writeTextFile: (filePath, content) => ipcRenderer.invoke('max:fs:writeText', filePath, content),
  trashPath: targetPath => ipcRenderer.invoke('max:fs:trash', targetPath),
  git: {
    worktreeList: repoPath => ipcRenderer.invoke('max:git:worktreeList', repoPath),
    worktreeAdd: (repoPath, options) => ipcRenderer.invoke('max:git:worktreeAdd', repoPath, options),
    worktreeRemove: (repoPath, worktreePath, options) =>
      ipcRenderer.invoke('max:git:worktreeRemove', repoPath, worktreePath, options),
    branchSwitch: (repoPath, branch) => ipcRenderer.invoke('max:git:branchSwitch', repoPath, branch),
    branchList: repoPath => ipcRenderer.invoke('max:git:branchList', repoPath),
    repoStatus: repoPath => ipcRenderer.invoke('max:git:repoStatus', repoPath),
    fileDiff: (repoPath, filePath) => ipcRenderer.invoke('max:git:fileDiff', repoPath, filePath),
    scanRepos: (roots, options) => ipcRenderer.invoke('max:git:scanRepos', roots, options),
    review: {
      list: (repoPath, scope, baseRef) => ipcRenderer.invoke('max:git:review:list', repoPath, scope, baseRef),
      diff: (repoPath, filePath, scope, baseRef, staged) =>
        ipcRenderer.invoke('max:git:review:diff', repoPath, filePath, scope, baseRef, staged),
      stage: (repoPath, filePath) => ipcRenderer.invoke('max:git:review:stage', repoPath, filePath),
      unstage: (repoPath, filePath) => ipcRenderer.invoke('max:git:review:unstage', repoPath, filePath),
      revert: (repoPath, filePath) => ipcRenderer.invoke('max:git:review:revert', repoPath, filePath),
      revParse: (repoPath, ref) => ipcRenderer.invoke('max:git:review:revParse', repoPath, ref),
      commit: (repoPath, message, push) => ipcRenderer.invoke('max:git:review:commit', repoPath, message, push),
      commitContext: repoPath => ipcRenderer.invoke('max:git:review:commitContext', repoPath),
      push: repoPath => ipcRenderer.invoke('max:git:review:push', repoPath),
      shipInfo: repoPath => ipcRenderer.invoke('max:git:review:shipInfo', repoPath),
      createPr: repoPath => ipcRenderer.invoke('max:git:review:createPr', repoPath)
    }
  },
  terminal: {
    dispose: id => ipcRenderer.invoke('max:terminal:dispose', id),
    resize: (id, size) => ipcRenderer.invoke('max:terminal:resize', id, size),
    start: options => ipcRenderer.invoke('max:terminal:start', options),
    write: (id, data) => ipcRenderer.invoke('max:terminal:write', id, data),
    onData: (id, callback) => {
      const channel = `max:terminal:${id}:data`
      const listener = (_event, payload) => callback(payload)
      ipcRenderer.on(channel, listener)

      return () => ipcRenderer.removeListener(channel, listener)
    },
    onExit: (id, callback) => {
      const channel = `max:terminal:${id}:exit`
      const listener = (_event, payload) => callback(payload)
      ipcRenderer.on(channel, listener)

      return () => ipcRenderer.removeListener(channel, listener)
    }
  },
  onClosePreviewRequested: callback => {
    const listener = () => callback()
    ipcRenderer.on('max:close-preview-requested', listener)

    return () => ipcRenderer.removeListener('max:close-preview-requested', listener)
  },
  onOpenUpdatesRequested: callback => {
    const listener = () => callback()
    ipcRenderer.on('max:open-updates', listener)

    return () => ipcRenderer.removeListener('max:open-updates', listener)
  },
  onDeepLink: callback => {
    const listener = (_event, payload) => callback(payload)
    ipcRenderer.on('max:deep-link', listener)

    return () => ipcRenderer.removeListener('max:deep-link', listener)
  },
  signalDeepLinkReady: () => ipcRenderer.invoke('max:deep-link-ready'),
  onWindowStateChanged: callback => {
    const listener = (_event, payload) => callback(payload)
    ipcRenderer.on('max:window-state-changed', listener)

    return () => ipcRenderer.removeListener('max:window-state-changed', listener)
  },
  onFocusSession: callback => {
    const listener = (_event, sessionId) => callback(sessionId)
    ipcRenderer.on('max:focus-session', listener)

    return () => ipcRenderer.removeListener('max:focus-session', listener)
  },
  onNotificationAction: callback => {
    const listener = (_event, payload) => callback(payload)
    ipcRenderer.on('max:notification-action', listener)

    return () => ipcRenderer.removeListener('max:notification-action', listener)
  },
  onPreviewFileChanged: callback => {
    const listener = (_event, payload) => callback(payload)
    ipcRenderer.on('max:preview-file-changed', listener)

    return () => ipcRenderer.removeListener('max:preview-file-changed', listener)
  },
  onBackendExit: callback => {
    const listener = (_event, payload) => callback(payload)
    ipcRenderer.on('max:backend-exit', listener)

    return () => ipcRenderer.removeListener('max:backend-exit', listener)
  },
  onPowerResume: callback => {
    const listener = () => callback()
    ipcRenderer.on('max:power-resume', listener)

    return () => ipcRenderer.removeListener('max:power-resume', listener)
  },
  onBootProgress: callback => {
    const listener = (_event, payload) => callback(payload)
    ipcRenderer.on('max:boot-progress', listener)

    return () => ipcRenderer.removeListener('max:boot-progress', listener)
  },
  // First-launch bootstrap progress -- emitted by the install.ps1 stage
  // runner in main.ts (apps/desktop/electron/bootstrap-runner.ts).
  // Renderer's install overlay subscribes to live events and queries the
  // current snapshot via getBootstrapState() to recover after a devtools
  // reload mid-bootstrap.
  getBootstrapState: () => ipcRenderer.invoke('max:bootstrap:get'),
  resetBootstrap: () => ipcRenderer.invoke('max:bootstrap:reset'),
  repairBootstrap: () => ipcRenderer.invoke('max:bootstrap:repair'),
  cancelBootstrap: () => ipcRenderer.invoke('max:bootstrap:cancel'),
  onBootstrapEvent: callback => {
    const listener = (_event, payload) => callback(payload)
    ipcRenderer.on('max:bootstrap:event', listener)

    return () => ipcRenderer.removeListener('max:bootstrap:event', listener)
  },
  getVersion: () => ipcRenderer.invoke('max:version'),
  getRemoteDisplayReason: () => ipcRenderer.invoke('max:get-remote-display-reason'),
  uninstall: {
    summary: () => ipcRenderer.invoke('max:uninstall:summary'),
    run: mode => ipcRenderer.invoke('max:uninstall:run', { mode })
  },
  updates: {
    check: () => ipcRenderer.invoke('max:updates:check'),
    apply: opts => ipcRenderer.invoke('max:updates:apply', opts),
    getBranch: () => ipcRenderer.invoke('max:updates:branch:get'),
    setBranch: name => ipcRenderer.invoke('max:updates:branch:set', name),
    onProgress: callback => {
      const listener = (_event, payload) => callback(payload)
      ipcRenderer.on('max:updates:progress', listener)

      return () => ipcRenderer.removeListener('max:updates:progress', listener)
    }
  },
  themes: {
    fetchMarketplace: id => ipcRenderer.invoke('max:vscode-theme:fetch', id),
    searchMarketplace: query => ipcRenderer.invoke('max:vscode-theme:search', query)
  }
})
