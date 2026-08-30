"""``max import`` subcommand parser.

Extracted verbatim from ``max_cli/main.py:main()`` (god-file Phase 2).
Handler injected to avoid importing ``main``.
"""

from __future__ import annotations

from typing import Callable


def build_import_cmd_parser(subparsers, *, cmd_import: Callable) -> None:
    """Attach the ``import`` subcommand to ``subparsers``."""
    # =========================================================================
    # import command
    # =========================================================================
    import_parser = subparsers.add_parser(
        "import",
        help="Restore a Max backup from a zip file",
        description="Extract a previously created Max backup into your "
        "Max home directory, restoring configuration, skills, "
        "sessions, and data",
    )
    import_parser.add_argument("zipfile", help="Path to the backup zip file")
    import_parser.add_argument(
        "--force",
        "-f",
        action="store_true",
        help="Overwrite existing files without confirmation",
    )
    import_parser.set_defaults(func=cmd_import)
