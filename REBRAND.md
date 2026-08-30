# Max Agent — Rebrand from Max Agent

**Date:** 2026-07-09
**Original:** Max Agent by Stardust Research
**Rebranded:** Max Agent by Stardust Research

---

## What Was Changed

### 1. Python Module Names (Files Renamed on Disk)

| Old Name | New Name | Files Importing |
|---|---|---|
| `max_cli/` | `max_cli/` | 927 files |
| `max_constants.py` | `max_constants.py` | 245 files |
| `max_state.py` | `max_state.py` | 112 files |
| `max_logging.py` | `max_logging.py` | 12 files |
| `max_time.py` | `max_time.py` | 9 files |
| `max_bootstrap.py` | `max_bootstrap.py` | 11 files |
| `ui-tui/packages/hermes-ink/` | `ui-tui/packages/max-ink/` | 54 TS files |

### 2. Python Identifiers (Bulk Search-and-Replace)

| Pattern | Replacement | Approx Occurrences |
|---|---|---|
| `get_max_home()` | `get_max_home()` | 1,031 |
| `display_max_home()` | `display_max_home()` | 116 |
| `set_max_home_override()` | `set_max_home_override()` | 120 |
| `reset_max_home_override()` | `reset_max_home_override()` | 66 |
| `_get_default_hermes_home()` | `_get_default_max_home()` | 28 |
| `_detect_concurrent_hermes_instances()` | `_detect_concurrent_max_instances()` | 21 |
| `is_nous_hermes_non_agentic()` | `is_nous_max_non_agentic()` | 9 |
| `_MAX_CORE_TOOLS` | `_MAX_CORE_TOOLS` | 53 |
| `MAX_AGENT_HELP_GUIDANCE` | `MAX_AGENT_HELP_GUIDANCE` | 3 |
| `MaxCLI` (class) | `MaxCLI` | 422 |
| `max-tui` (npm package) | `max-tui` | 1 |

### 3. Environment Variables

| Old | New | Notes |
|---|---|---|
| `MAX_HOME` | `MAX_HOME` | Backward-compat fallback kept (see below) |
| `MAX_UID` | `MAX_UID` | Docker env var |
| `MAX_GID` | `MAX_GID` | Docker env var |
| All other `MAX_*` | `MAX_*` | ~200 total env vars |

**Backward-compatibility fallback in `max_constants.py`:**
```python
val = os.environ.get("MAX_HOME", "").strip()
if not val:
    val = os.environ.get("MAX_HOME", "").strip()  # fallback for migrating users
```
This allows users with `MAX_HOME` set in their `.env` or shell profile to continue working without changes. `MAX_HOME` can be removed in a future release.

### 4. Binary/CLI Entry Points

| Old | New |
|---|---|
| `max` (entry point) | `max` |
| `max-agent` (entry point) | `max-agent` |
| `max-acp` (entry point) | `max-acp` |
| `max` (wrapper script) | `max` (file kept, content updated to reference `max_cli`) |
| `prog="hermes"` (argparse) | `prog="max"` |
| `shutil.which("hermes")` | `shutil.which("max")` |

**Wrapper script** at repo root `max` still exists but now references `max_cli.main`. It acts as a backwards-compatible bootstrap.

### 5. System Prompt (Agent Identity)

In `agent/prompt_builder.py`:

**Before:**
```python
"You are Max Agent, an intelligent AI assistant created by Stardust Research. "
```

**After:**
```python
"You are Max Agent, an intelligent AI assistant created by Stardust Research. "
```

Also updated: `agent/system_prompt.py`, `max_cli/default_soul.py` (the `DEFAULT_SOUL_MD` template seeded on first run).

### 6. Python Package Metadata

**pyproject.toml:**
- `name = "max-agent"` → `name = "max-agent"`
- `authors = [{ name = "Stardust Research" }]` → `authors = [{ name = "Stardust Research" }]`
- Entry points: `max`, `max-agent`, `max-acp`

### 7. NPM Packages

| Old | New | Files Affected |
|---|---|---|
| `@hermes/shared` | `@max/shared` | 6 TS files + 2 package.json |
| `@hermes/ink` | `@max/ink` | 54 TS files + `ui-tui/packages/` |
| `max-tui` | `max-tui` | 1 package.json |

**Not changed:** `@stardust-research/ui` (274 occurrences in 53 frontend files) — kept as-is because:
- It's an external npm dependency (published on `registry.npmjs.org`, licensed MIT)
- It's a pure UI component library (`Button`, `Card`, `Dialog`, etc.) — no branding
- Keeping it means free upgrades from Stardust Research's maintainers
- If the package becomes unavailable, fork it as `@stardust-research/ui`

### 8. Desktop App & Bootstrap Installer

| Field | Old | New |
|---|---|---|
| App name | `max` | `max-agent` |
| Product name | `Max` | `Max` |
| Author | `Stardust Research` | `Stardust Research` |
| Bundle ID | `com.stardustresearch.max` | `com.stardustresearch.max` |
| Tauri identifier | `com.stardustresearch.max.setup` | `com.stardustresearch.max.setup` |
| Rust crate | `hermes-bootstrap` | `max-bootstrap` |
| Installer title | `Max` | `Max` |

### 9. Docker Infrastructure

| Item | Old | New |
|---|---|---|
| System user | `max` | `max` |
| Data path | `/opt/max` | `/opt/max` (alias compat) |
| Home path | `/opt/data` | `/opt/data` |
| Image name | `stardustresearch/max-agent` | `stardustresearch/max-agent` |
| Container name | `max` | `max` |
| Env vars | `MAX_UID`, `MAX_GID` | `MAX_UID`, `MAX_GID` |

### 10. Nix Infrastructure

| Old | New |
|---|---|
| `hermesVenv` | `maxVenv` |
| `hermesAgent` | `maxAgent` |
| `hermesDesktop` | `maxDesktop` |
| `hermesTui`, `hermesWeb` | `maxTui`, `maxWeb` |
| `services.max-agent` | `services.max-agent` |
| `max-agent` (flake attr) | `max-agent` |
| `mkMaxVenv` | `mkMaxVenv` |
| `hermes-config-keys` | `max-config-keys` |
| `hermesConfig` | `maxConfig` |

### 11. Data Directory

| Platform | Old | New |
|---|---|---|
| Linux/macOS | `~/.max` | `~/.max` |
| Windows | `%LOCALAPPDATA%\hermes` | `%LOCALAPPDATA%\max` |
| Docker | `/opt/max` | `/opt/max` |

The change is in `_get_platform_default_max_home()` in `max_constants.py`. Users with existing `MAX_HOME` set (or `~/.max` with no env var) will continue working through the backward-compat fallback.

### 12. Nous Portal & Billing Infrastructure (Removed)

The following modules were **deleted entirely**:

| Module | Size | Purpose |
|---|---|---|
| `max_cli/nous_billing.py` | 16KB | Billing management |
| `max_cli/nous_account.py` | 30KB | Account management |
| `max_cli/portal_cli.py` | 9KB | Portal CLI commands |
| `max_cli/nous_subscription.py` | - | Subscription management |
| `max_cli/dashboard_register.py` | - | Portal registration |
| `max_cli/proxy/` | - | Portal proxy |
| `agent/credits_tracker.py` | 38KB | Credit tracking |
| `agent/usage_pricing.py` | 39KB | Usage/pricing |
| `agent/account_usage.py` | - | Usage reporting |
| `agent/billing_view.py` | - | TUI billing display |
| `plugins/dashboard_auth/nous/` | - | Nous auth provider |
| `plugins/model-providers/nous/` | - | Nous model provider |

Stub files were created for each deleted module to satisfy remaining imports. The stubs export only dataclass/typedef names and no-op functions. All 96+ callers across `run_agent.py`, `cli.py`, `conversation_loop.py`, etc. were updated to remove billing/portal logic.

### 13. GitHub CI/CD & Templates

| File | Change |
|---|---|
| `docker.yml` | Image `stardustresearch/max-agent`, repo check updated |
| `upload_to_pypi.yml` | PyPI URL updated |
| `deploy-site.yml` | Repo check updated |
| `skills-index*.yml` | Repo checks updated |
| `ISSUE_TEMPLATE/*.yml` | All user-facing text branded |
| `PULL_REQUEST_TEMPLATE.md` | URLs updated |
| `nix-setup/action.yml` | Name updated |

### 14. Installer Scripts

| File | Changes |
|---|---|
| `scripts/install.sh` | All references from Max → Max, Nous → Stardust |
| `scripts/install.ps1` | Same |
| `scripts/release.py` | Release name, emails |
| `scripts/contributor_audit.py` | Emails |

### 15. READMEs & Documentation

| File | Changes |
|---|---|
| `README.md` | Full rebrand |
| `README.es.md` | Full rebrand |
| `README.ur-pk.md` | Full rebrand |
| `CONTRIBUTING.es.md` | Partial (command examples still show `max`) |
| `ui-tui/README.md` | Branding updated |
| `web/README.md` | Branding updated |

### 16. Security Patterns (Backward-Compatible)

Security tools were updated to match both `max` and `max` during a transition period:

```python
# In tools/approval.py, tools/skills_guard.py, tools/threat_patterns.py
r'\b(?:max|hermes)\s+...gateway...'
r'\b(pkill|killall)\b.*\b(max|hermes|gateway|cli\.py)\b'
r'\.(?:max|hermes)/config\.yaml'
```

These can be simplified to just `max` after the transition period.

---

## Where "hermes" References Still Remain

### Intentional (Kept on Purpose)

| Location | Reason | Count | Recommended Action |
|---|---|---|---|
| `max_constants.py:78` | `os.environ.get("MAX_HOME", "")` | 1 line | Keep until next major release, then remove with deprecation notice |
| `tools/approval.py:211,226,629-630,642,655` | Backward-compat regex `(?:max\|hermes)` | ~10 lines | Simplify to just `max` after transition (1-2 releases) |
| `tools/skills_guard.py:133,459` | Backward-compat path regex `(?:max\|hermes)` | 2 lines | Same as above |
| `tools/threat_patterns.py:129,131` | Backward-compat path regex | 2 lines | Same as above |
| `tools/skills_hub.py:2847` | SKILL.md frontmatter example: `metadata.max.blueprint` (already `max` in code) | - | Already resolved in code |
| `mcp_serve.py:44` | Logger name `"max.mcp_serve"` (already fixed from `max`) | - | Already resolved |

### In Tests (Low Priority — Only Affects Test Outputs)

| File(s) | Count | Nature | Recommendation |
|---|---|---|---|
| `tests/*.py` | ~200+ lines | Test assertions, temp paths like `tmp_path / ".max"`, docstrings referencing "hermes" | Fix gradually. Many use `.max` as arbitrary path strings; they still pass because the code under test has been updated. |

Examples:
- `tests/test_max_constants.py` — has `.max` in test path assertions
- `tests/test_bitwarden_secrets.py` — temp paths with `.max`
- `tests/tools/test_approval.py` — test commands like `"killall hermes"`, `"pkill -9 hermes"`
- `tests/tools/test_skills_tool.py` — tests SKILL.md frontmatter with `metadata:\n  hermes:`
- `tests/tools/test_blueprints.py` — same
- `tests/tools/test_stage2_hook_symlink_chown.py` — tests `hermes:hermes` chown patterns
- `tests/tools/test_browser_orphan_reaper.py` — docstring "max PID"
- `tests/tools/test_skills_sync.py` — variable named `max`

### In Documentation (READMEs, CONTRIBUTING)

| File | What | Nature | Recommendation |
|---|---|---|---|
| `README.md` (and translations) | Command examples like `max model`, `max gateway` | User-facing docs showing CLI usage | **Fix** — these should show `max` instead. The bulk sed `s/Max/Max/g` missed the lowercase `max` command name in code blocks |
| `README.ur-pk.md` | Most command examples still show `max` | Same | **Fix** |
| `CONTRIBUTING.es.md` | Command examples, paths, URLs | Contributor docs | **Fix** |
| `website/` (Docusaurus) | Sidebars, config, page content | Docs site | **Fix** |

### In Backend CLI Help Text (User-Facing Strings)

The CLI help text still shows `max` in usage examples because these are string literals inside Python help text generators. For example:

```python
# In max_cli/_parser.py — all descriptions show:
hermes                        Start interactive chat
max chat -q "Hello"        Single query mode
max setup                  Run setup wizard
# ... etc every line is "max <subcommand>"
```

**Impact:** These ~1500 lines across `max_cli/main.py`, `max_cli/_parser.py`, `max_cli/subcommands/*.py`, `max_cli/logs.py`, `max_cli/webhook.py`, `max_cli/backup.py`, `max_cli/doctor.py`, `max_cli/plugins_cmd.py`, `max_cli/claw.py`, `max_cli/debug.py`, `max_cli/secrets_cli.py`, `max_cli/onepassword_secrets_cli.py`, `max_cli/tips.py`, `max_cli/commands.py`, `max_cli/web_server.py`, `max_cli/container_boot.py`, `max_cli/kanban_diagnostics.py` etc. are user-facing help text that still shows `max` as the command name.

**Fix:** Replace `max` with `max` in these display strings. This was intentionally deferred because:
- The CLI binary is now `max`, so the help text should show `max`
- The earlier `s/Max/Max/g` pass caught `"Max"` (capital H) but missed `"hermes"` (lowercase) in help strings
- This is purely cosmetic — all command functionality works under `max` now

### In `@stardust-research/ui` (External Dependency)

**274 files** import from `@stardust-research/ui`. This is a third-party npm package — its source is not in this repo. It's kept as-is (option 3 you chose) for easy upgrades. The package name contains "stardust-research" but it's a UI component library with no branding impact on end users.

---

## Future Options & Decisions

### Option A: Clean Up Remaining Help Text Display Strings

Replace `"hermes"` with `"max"` in all CLI help text. This is purely cosmetic.

**Effort:** ~1500 lines across ~40 files
**Risk:** Low — only affects display strings
**Command:** `cd /home/aditya/Desktop/Max-agent && grep -rlZ '"max ' --include='*.py' --exclude-dir=test --exclude-dir=node_modules --exclude-dir=.venv --exclude-dir=.git . 2>/dev/null | xargs -0 sed -i 's/"max /"max /g'`

**Note:** Care needed for the `` hermes`` pattern (backtick-hermes-space) in docstrings, and `'hermes'` single-quote patterns.

### Option B: Remove Backward-Compat Regex in Security Tools

After 1-2 releases, simplify regex patterns:

```python
# Current (compat):
r'\b(?:max|hermes)\s+(?:-{1,2}...)*gateway\s+(stop|restart)\b'
# Simplified (after transition):
r'\bmax\s+(?:-{1,2}...)*gateway\s+(stop|restart)\b'
```

**Files:** `tools/approval.py`, `tools/skills_guard.py`, `tools/threat_patterns.py`

**Effort:** ~15 lines across 3 files.

### Option C: Remove MAX_HOME Backward-Compat Fallback

Remove the fallback in `max_constants.py:78`:

```python
# Remove this line:
val = os.environ.get("MAX_HOME", "").strip()
```

**Risk:** Users migrating from Max Agent with `MAX_HOME` set in their shell profile will silently fall back to `~/.max` instead of their custom path. Only do this after a deprecation period (e.g., print a warning when `MAX_HOME` is detected but `MAX_HOME` is not set).

### Option D: Rename `max` Wrapper Script to `max`

The repo root `max` file is still named `max` for backward compat. Rename it:

```bash
mv max max
```

This makes `./max` the launcher. The old `max` file name would be gone. If anyone clones the repo, they'd use `./max` instead of `./hermes`.

**Impact:** Low — the installed entry point is `max` via pip. The wrapper script is only used for dev/checkout-based usage.

### Option E: Fork @stardust-research/ui as @stardust-research/ui

If the Stardust Research npm org ever goes down or removes the package:

1. Download the latest tarball: `npm pack @stardust-research/ui`
2. Extract to `packages/stardust-ui/`
3. Rename in all package.json files and all 53 importing files
4. Publish to npm as `@stardust-research/ui`

**Effort:** 53 files + the UI package source. This is a significant maintenance burden once forked.

### Option F: Move to a New GitHub Repository

The git remote still points to the original Stardust Research repo. Recommended:

1. Create a new GitHub repo: `github.com/StardustResearch/max-agent`
2. Update the remote:
   ```bash
   git remote set-url origin git@github.com:StardustResearch/max-agent.git
   ```
3. Push: `git push -u origin main`
4. Update CI references in `.github/workflows/*.yml` (already done by sed — verify repo checks match the new org)

### Option G: Clean Test Files

Fix all remaining `max` references in test files. Most are test path strings or assertion values that don't affect functionality.

**Effort:** ~200 occurrences across ~50 test files
**Risk:** Very low — test files only
**Approach:** Same sed patterns as the bulk rename, scoped to `tests/`

---

## Summary of Remaining Work

| Task | Priority | Effort | Impact |
|---|---|---|---|
| Fix CLI help text (`"max "` → `"max "`) | High | ~1500 lines / 40 files | User-facing polish |
| Fix README command examples | High | 4 files | New users see correct commands |
| Fix website/Docusaurus config | Medium | 5-10 files | Docs site branding |
| Fix CONTRIBUTING.es.md | Medium | 1 file | Contributor docs |
| Simplify security regexes (remove backward `max` compat) | Low (after transition) | 3 files / 15 lines | Code cleanliness |
| Remove `MAX_HOME` env var fallback | Low (after transition) | 1 line | Clean env var namespace |
| Fix test files | Low | ~50 files / 200 lines | Test clarity |
| Fork `@stardust-research/ui` | Low (contingency) | 53+ files | Dependency independence |

---

## Verification Checklist

- [x] Python modules rename: `max_cli/` → `max_cli/` (and 5 more files)
- [x] All `MAX_` env vars → `MAX_` (with backwards compat fallback)
- [x] All function identifiers renamed (hermes → max)
- [x] Entry points in pyproject.toml: `max`, `max-agent`, `max-acp`
- [x] Binary wrapper script updated
- [x] System prompt: "Max Agent by Stardust Research"
- [x] Author: "Stardust Research" throughout
- [x] NPM scopes: `@max/shared`, `@max/ink`
- [x] Desktop app: new bundle IDs, product name
- [x] Docker: system user, paths, images
- [x] Nix: attribute names, service names
- [x] Nous Portal removed (12 modules deleted)
- [x] Nous billing removed (5 modules gutted)
- [x] Nous model provider plugin removed
- [x] Backward-compat env var fallback in place
- [x] CI/CD workflows updated
- [x] Core module imports verified
- [x] Agent can still be imported without portal/billing errors

**Not yet done:**
- CLI help text command examples show `max` instead of `max` (~1500 lines, cosmetic)
- README command examples show `max` instead of `max` (4 files, cosmetic)
- Website/Docusaurus references (sidebars, config, page content)
- CONTRIBUTING.es.md (Spanish contributor docs)
- Test files with `max` in strings (~200 lines across ~50 files)