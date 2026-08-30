"""Stub: usage_pricing removed in fork.

This module was part of the Nous Research billing infrastructure and has been
removed.  The symbols below are stubs so importers continue to compile.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from types import SimpleNamespace
from typing import Any, Optional


@dataclass
class CanonicalUsage:
    input_tokens: int = 0
    output_tokens: int = 0
    prompt_tokens: int = 0
    total_tokens: int = 0
    cache_read_tokens: int = 0
    cache_write_tokens: int = 0
    cache_creation_tokens: int = 0
    reasoning_tokens: int = 0


@dataclass
class PricingEntry:
    input_cost_per_million: float = 0.0
    output_cost_per_million: float = 0.0
    amount_usd: Optional[float] = None
    status: str = ""
    source: str = ""


def estimate_usage_cost(*args, **kwargs) -> PricingEntry:
    return PricingEntry()


def normalize_usage(usage: Any, **kwargs) -> CanonicalUsage:
    if isinstance(usage, CanonicalUsage):
        return usage
    if usage is None:
        return CanonicalUsage()
    return CanonicalUsage(
        input_tokens=getattr(usage, "input_tokens", 0) or 0,
        output_tokens=getattr(usage, "completion_tokens", 0) or 0,
        prompt_tokens=getattr(usage, "prompt_tokens", 0) or 0,
        total_tokens=getattr(usage, "total_tokens", 0) or 0,
        cache_read_tokens=getattr(
            getattr(usage, "prompt_tokens_details", None) or SimpleNamespace(), "cached_tokens", 0
        ) or 0,
        cache_write_tokens=getattr(
            getattr(usage, "prompt_tokens_details", None) or SimpleNamespace(), "cache_creation_input_tokens", 0
        ) or 0,
        reasoning_tokens=getattr(
            getattr(usage, "completion_tokens_details", None) or SimpleNamespace(), "reasoning_tokens", 0
        ) or 0,
    )


def get_pricing_entry(*args, **kwargs) -> Optional[PricingEntry]:
    return None


def format_duration_compact(seconds: float) -> str:
    if seconds < 60:
        return f"{seconds:.0f}s"
    if seconds < 3600:
        return f"{seconds / 60:.0f}m"
    return f"{seconds / 3600:.1f}h"


def has_known_pricing(*args, **kwargs) -> bool:
    return False


_OFFICIAL_DOCS_PRICING: dict = {}
PricingEntry_db: list = []