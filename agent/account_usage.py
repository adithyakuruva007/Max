"""Stub: account_usage removed in rebrand.

This module was part of the Nous Research portal infrastructure.
Stub exports so callers compile.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Optional


class AccountUsageWindow:
    pass


@dataclass
class AccountUsageSnapshot:
    provider: str = ""
    total_requests: int = 0
    remaining_requests: int = 0
    limit_requests: int = 0


@dataclass
class CreditsView:
    """Stub credits view."""
    logged_in: bool = False
    total: str = "$0"
    used: str = "$0"
    remaining: str = "$0"
    topup_url: str = ""
    balance_lines: list = None
    identity_line: str = ""
    depleted: bool = False


def render_account_usage_lines(snapshot, *, markdown=False):
    return ["Account usage information unavailable (billing removed)."]


def fetch_account_usage(provider=None, base_url=None, api_key=None):
    return None


def nous_credits_lines(*, markdown=False):
    return []


def build_credits_view(*args, **kwargs):
    return CreditsView()


def build_nous_credits_snapshot(*args, **kwargs):
    return None


def _snapshot_from_credits_state(*args, **kwargs):
    return None