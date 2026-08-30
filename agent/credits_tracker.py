"""Stub: credits_tracker removed in rebrand.

This module tracked Nous Portal credits. Stub so importers compile.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Optional


class AgentNotice:
    pass


@dataclass
class CreditsState:
    remaining_micros: int = 0
    remaining_usd: Optional[str] = None
    paid_access: bool = False
    denominator_kind: str = ""
    age_seconds: float = float("inf")
    disabled_reason: str = ""


def seed_credits_at_session_start(agent) -> None:
    pass


def dev_fixture_credits_state() -> Optional[CreditsState]:
    return None


def parse_credits_headers(headers, provider=""):
    return None


def evaluate_credits_notices(state, latch, model_is_free, notice_callback, notice_clear_callback):
    pass


def is_free_tier_model(model="", base_url="") -> bool:
    return False