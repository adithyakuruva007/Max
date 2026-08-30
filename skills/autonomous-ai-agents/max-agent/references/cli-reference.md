# Max CLI Reference

Live sources when anything looks stale: `max --help`, `max <command> --help`,
https://max-agent.stardustresearch.com/docs/reference/cli-commands

### Global Flags

```
hermes [flags] [command]        (no subcommand = interactive chat)

  --version, -V             Show version
  -z, --oneshot PROMPT      One-shot: print ONLY the final response (for scripts/pipes)
  -m MODEL  --provider P    Model/provider override for this invocation
  -t, --toolsets LIST       Comma-separated toolsets for this invocation
  --resume, -r SESSION      Resume session by ID or title
  --continue, -c [NAME]     Resume by name, or most recent session
  --worktree, -w            Isolated git worktree mode (parallel agents)
  --skills, -s SKILL        Preload skills (comma-separate or repeat)
  --profile, -p NAME        Use a named profile
  --yolo                    Skip dangerous command approval
  --tui / --cli             Force the Ink TUI / classic REPL
  --ignore-rules            Skip AGENTS.md/SOUL.md/memory/skill injection
  --safe-mode               Disable ALL customizations (troubleshooting)
  --pass-session-id         Include session ID in system prompt
```

### Chat

```
max chat [flags]
  -q, --query TEXT          Single query, non-interactive
  --image PATH              Attach a local image to a single query
  -Q, --quiet               Suppress banner, spinner, tool previews
  --checkpoints             Enable filesystem checkpoints (/rollback)
  --max-turns N             Cap tool-calling iterations
  --source TAG              Session source tag (default: cli)
```
(plus the global flags above)

### Configuration

```
max setup [section]      Wizard (model|tts|terminal|gateway|tools|agent)
max model                Interactive model/provider picker
hermes fallback [add|remove|list]  Fallback provider chain
max config [show|edit|get|set|unset|path|env-path|check|migrate]
hermes login / logout       OAuth sign-in / clear stored auth
max doctor [--fix]       Check dependencies and config
max status [--all]       Component status
```

### Tools & Skills

```
max tools [list|enable NAME|disable NAME]   Per-platform toolsets (curses UI with no args)

max skills list|browse|search QUERY|inspect ID
max skills install ID    Hub identifier OR a direct https://…/SKILL.md URL
max skills config        Enable/disable skills per platform
max skills check|update|uninstall|publish PATH
max skills tap add REPO  Add a GitHub repo as a skill source
hermes bundles              Skill bundles (one /<name> alias loads several skills)
```

### MCP Servers

```
max mcp add NAME (--url or --command) | remove | list | test NAME
max mcp catalog | install NAME     Curated catalog install
max mcp configure NAME             Toggle tool selection
max mcp serve                      Run Max as an MCP server
```
Details (transport, tool discovery, catalog): `references/native-mcp.md`.

### Gateway (Messaging Platforms)

```
max gateway run|install|start|stop|restart|status|setup
```

20+ platforms: Telegram, Discord, Slack, WhatsApp (Baileys + Business Cloud API), iMessage (Photon — `max photon setup`), Signal, Email, SMS, Matrix, Mattermost, Teams, LINE, SimpleX, ntfy, Google Chat, Home Assistant, DingTalk, Feishu, WeCom, Weixin, API Server, Webhooks. Open WebUI connects via the API Server adapter. Most adapters ship under `plugins/platforms/`.
Docs: https://max-agent.stardustresearch.com/docs/user-guide/messaging/

### Sessions

```
hermes sessions list|browse|rename ID TITLE|delete ID|export OUT|prune|stats
```

### Cron / Webhooks

```
max cron list|create SCHED|edit ID|pause|resume|run ID|remove|status
    Schedules: '30m', 'every 2h', '0 9 * * *', ISO timestamp
hermes webhook subscribe NAME|list|remove NAME|test NAME
```
Webhook payloads/routes: `references/webhooks.md`.

### Profiles

```
max profile list|create NAME (--clone|--clone-all|--clone-from)|use|show|delete
max profile rename A B | alias NAME | export NAME | import FILE
```

### Credentials & Pools

```
hermes auth                 Interactive credential manager
hermes auth add [PROVIDER]  Add OAuth or API-key credential (nous, openai-codex, qwen-oauth, …)
hermes auth list|remove P IDX|reset PROVIDER|status
```
Multiple credentials per provider form a pool that rotates automatically and skips exhausted keys.

### Other

```
max desktop / gui        Native desktop app
max dashboard            Web admin panel + embedded chat (--stop / --status)
hermes proxy                OpenAI-compatible local proxy backed by an OAuth provider
hermes portal               Quick setup / sign in via Nous Portal
hermes kanban <verb>        Multi-agent work-queue board
hermes project              Named multi-folder workspaces
hermes skin list|use|set    Switch/tweak skins (see references/themes.md)
hermes pets <verb>          Pet mascots (see references/petdex.md)
max memory setup|status|off|reset   Memory provider
hermes secrets bitwarden|onepassword   External secret stores
hermes moa                  Mixture-of-Agents slots
hermes hooks / security / backup / import / checkpoints / console
hermes logs [-f] [errors]   View agent/error logs
hermes send                 One-off message through a gateway platform
hermes pairing / plugins / insights / journey / computer-use
hermes acp                  ACP server (IDE integration)
hermes completion bash|zsh|fish
max update / uninstall / claw migrate
```

Plugin- and provider-supplied subcommands (e.g. `max photon setup`) only appear once their plugin is installed/active.

### Where to Find Things

| Looking for... | Location |
|---|---|
| Config options | `max config edit` · [Configuration docs](https://max-agent.stardustresearch.com/docs/user-guide/configuration) |
| Tools / toolsets | `max tools list` · [Tools reference](https://max-agent.stardustresearch.com/docs/reference/tools-reference) |
| Skills catalog | `max skills browse` · [Skills catalog](https://max-agent.stardustresearch.com/docs/reference/skills-catalog) |
| Provider setup | `max model` · [Providers guide](https://max-agent.stardustresearch.com/docs/integrations/providers) |
| Env variables | `max config env-path` · [Env vars reference](https://max-agent.stardustresearch.com/docs/reference/environment-variables) |
| Gateway logs | `~/.max/logs/gateway.log` (or `max logs`) |
| Sessions | `max sessions browse` (reads state.db) |
