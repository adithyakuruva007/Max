"""Stub: nous_account removed in rebrand.

This module was part of the Nous Research portal infrastructure.
"""

from __future__ import annotations

from typing import Any, Optional


class NousPortalAccountInfo:
    logged_in: bool = False
    paid_service_access: bool = False
    inference_credential_present: bool = False
    inference_base_url: str = ""
    tool_gateway_entitled: bool = False


class NousPaidServiceAccessInfo:
    pass


class NousToolAccessInfo:
    pass


class NousAccountInfo:
    logged_in: bool = False
    paid_service_access: bool = False
    inference_credential_present: bool = False
    inference_base_url: str = ""


def get_nous_portal_account_info(*args, **kwargs):
    return None


def format_nous_portal_entitlement_message(*args, **kwargs):
    return ""


TOOL_COVERAGE_CATEGORIES = {}