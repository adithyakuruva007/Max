"""Resolve MAX_HOME for standalone skill scripts.

Skill scripts may run outside the Max process (e.g. system Python,
nix env, CI) where ``max_constants`` is not importable.  This module
provides the same ``get_max_home()`` and ``display_max_home()``
contracts as ``max_constants`` without requiring it on ``sys.path``.

When ``max_constants`` IS available it is used directly so that any
future enhancements (profile resolution, Docker detection, etc.) are
picked up automatically.  The fallback path replicates the core logic
from ``max_constants.py`` using only the stdlib.

All scripts under ``google-workspace/scripts/`` should import from here
instead of duplicating the ``MAX_HOME = Path(os.getenv(...))`` pattern.
"""

from __future__ import annotations

import os
from pathlib import Path

try:
    from max_constants import display_max_home as display_max_home
    from max_constants import get_max_home as get_max_home
except (ModuleNotFoundError, ImportError):

    def get_max_home() -> Path:
        """Return the Max home directory (default: ~/.max).

        Mirrors ``max_constants.get_max_home()``."""
        val = os.environ.get("MAX_HOME", "").strip()
        return Path(val) if val else Path.home() / ".max"

    def display_max_home() -> str:
        """Return a user-friendly ``~/``-shortened display string.

        Mirrors ``max_constants.display_max_home()``."""
        home = get_max_home()
        try:
            return "~/" + str(home.relative_to(Path.home()))
        except ValueError:
            return str(home)
