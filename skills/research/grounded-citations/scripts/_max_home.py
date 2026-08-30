"""Resolve MAX_HOME for standalone skill scripts.

Skill scripts may run outside the Max process (system Python, nix env,
CI) where ``max_constants`` is not importable.  This module provides the
same ``get_max_home()`` contract without requiring it on ``sys.path``.

When ``max_constants`` IS available it is used directly so profile
resolution and any future enhancements are picked up automatically.
"""

from __future__ import annotations

import os
from pathlib import Path

try:
    from max_constants import get_max_home as get_max_home
except (ModuleNotFoundError, ImportError):

    def get_max_home() -> Path:
        """Return the Max home directory (default: ``~/.max``)."""
        val = os.environ.get("MAX_HOME", "").strip()
        return Path(val) if val else Path.home() / ".max"
