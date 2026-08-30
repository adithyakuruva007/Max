"""Stub: nous_subscription removed in rebrand.

This module was part of the Nous Research portal infrastructure.
"""

from __future__ import annotations

from types import SimpleNamespace
from typing import Any, Optional


class NousFeatureState:
    available: bool = False
    active: bool = False
    managed_by_nous: bool = False
    included_by_default: bool = False
    label: str = ""
    key: str = ""
    current_provider: str = ""


class FeatureItem:
    available: bool = False
    active: bool = False
    managed_by_nous: bool = False
    included_by_default: bool = False
    label: str = ""
    key: str = ""
    current_provider: str = ""


class NousSubscriptionFeatures:
    nous_auth_present: bool = False
    features: dict = {}

    def items(self):
        return []


class SubscriptionFeatures:
    nous_auth_present: bool = False
    features: dict = {}
    account_info = SimpleNamespace(
        logged_in=False,
        paid_service_access=False,
        tool_gateway_entitled=False,
    )

    def items(self):
        return []

    def __getattr__(self, name):
        return SimpleNamespace(
            managed_by_nous=False,
            available=False,
            current_provider="",
        )


def get_nous_subscription_features(*args, **kwargs):
    return SubscriptionFeatures()


def apply_nous_managed_defaults(*args, **kwargs):
    return set()


def ensure_nous_portal_access(*args, **kwargs):
    return ()


MANAGED_FEATURE_COVERAGE_CATEGORY = {}