"""Stub: billing_view removed in rebrand.

This module was part of the Nous Portal billing infrastructure.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Optional


@dataclass
class BillingState:
    pass


@dataclass
class CardInfo:
    pass


@dataclass
class MonthlyCap:
    pass


def build_billing_state(*args, **kwargs):
    return BillingState()


def format_money(cents: int, currency: str = "USD") -> str:
    return "$0.00"


def validate_charge_amount(amount: int) -> int:
    return amount


def parse_money(s: str) -> int:
    return 0


def new_idempotency_key() -> str:
    return ""