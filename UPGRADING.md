# Upgrading Max Agent from Upstream

Max is a fork of [Stardust Research's Max Agent](https://github.com/stardustresearch/max-agent).
This document describes how to port upstream changes into Max.

## Principles

1. **We port deliberately, not automatically.** Every upstream change is
   evaluated for fit — Max has its own brand, identity, and design decisions.
2. **Backward compat is load-bearing.** Dual-read patterns (`MAX_*` /
   `MAX_*` env vars, event names, config paths, localStorage keys, API
   routes) let upstream features port with minimal friction.
3. **The narrow-waist rule still applies.** Before adding a new core model
   tool from upstream, check whether it should be a skill, plugin, or MCP
   server instead (see "Footprint Ladder" in AGENTS.md).

## Porting Checklist by Area

### Core Tools (`tools/*.py`) — Low effort

- Tool names and schemas are identical between Max and Max
- Usually drop-in — just copy the file and re-run tests
- Check: does the tool reference `max` in any string or env var? If so,
  add a dual-read pattern

### Model Providers (`plugins/model-providers/`) — Low effort

- File-based discovery; new providers drop into the directory
- Check: `plugin.yaml` author field says "Stardust Research" — update to
  "Stardust Research"

### Skills (`skills/`, `optional-skills/`) — Low effort

- Text-based; review SKILL.md for Max-branded strings or `max` CLI refs
- Update SKILL.md frontmatter `author` if needed
- Verify `description` ≤ 60 chars per skill standards

### Platform Adapters (`gateway/platforms/`) — Low–Medium effort

- Usually drop-in
- Check for: `max` binary/CLI references in Python code
- Check: `.env.example` additions for `MAX_*` keys — add `MAX_*` dual-read
- Check: adapter name string references ("Max" in user-facing messages)

### Plugin System — Medium effort

- ABC-based; review ctx API compatibility
- Check: plugin hooks reference `max` event names — add `max.*` dual-emit
- Ensure plugin doesn't modify core files (`run_agent.py`, `cli.py`, etc.)

### Config / Env changes — Medium effort

- New config keys need to go into `DEFAULT_CONFIG` in `max_cli/config.py`
- New env vars need to go into `OPTIONAL_ENV_VARS` in `max_cli/config.py`
- **Always add a `MAX_*` variant alongside `MAX_*`** for backward compat
- Non-secret settings go in `config.yaml`, not `.env`

### `@hermes/ink` → `@max/ink` — High effort (manual)

- Max ships a local fork of `ink` at `ui-tui/packages/max-ink/`
- Upstream changes to `@hermes/ink` must be manually applied to this fork
- Key files to update:
  - `src/ink/` — reconciler, render loop, terminal I/O
  - `src/ink/components/` — Box, Text, ScrollBox, etc.
  - `src/ink/hooks/` — useInput, useStdin, etc.
  - `src/ink/termio/` — low-level terminal I/O
- After updating, run `cd ui-tui && npm run build && npm run typecheck`

### Install Scripts (`scripts/`, `Dockerfile`, `nix/`) — Medium effort

- Binary name changes: `max` → `max` (or keep both in dual-check patterns)
- Container paths: `/root/.max` → `$MAX_HOME` (profile-aware)
- User/group names: `_hermes` → `_maxagent`
- `nix/` package name, binary, and env vars

### Website / Docs — Medium effort

- CLI command refs: `max` → `max`
- Paths: `~/.max/` → `~/.max/`
- Config examples, screenshots, ASCII art may need updating
- SVG images in `website/static/img/docs/` may show old art

### `@stardust-research/ui` — Zero effort

- External npm package — updates automatically via `npm update`
- No changes needed (we don't own this package)

## Post-Port Verification

After porting an upstream change, verify:

```bash
# Check for stale "Max" / "Stardust Research" strings
rg -n 'Max|Stardust Research' --type ts --type py --type rs \
  -g '!node_modules' -g '!.git' -g '!.venv' -g '!venv'

# Check ASCII art still says MAX AGENT
rg 'AGENT' cli.py max_cli/banner.py ui-tui/src/banner.ts

# Run tests
scripts/run_tests.sh

# Build and typecheck the TUI
cd ui-tui && npm run build && npm run typecheck
```

## When NOT to Port

- Changes that mutate past context mid-conversation (breaks prompt caching)
- New core model tools that should be skills/plugins/MCP servers instead
- Speculative infrastructure with no concrete consumer
- Outbound telemetry without opt-in gating
- Changes that hardcode paths (use `get_max_home()` instead)
- Third-party product integrations (should be standalone plugin repos)
