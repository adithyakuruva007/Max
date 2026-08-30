"""Tests for the Nous-Max-3/4 non-agentic warning detector.

Prior to this check, the warning fired on any model whose name contained
``"max"`` anywhere (case-insensitive). That false-positived on unrelated
local Modelfiles such as ``max-brain:qwen3-14b-ctx16k`` — a tool-capable
Qwen3 wrapper that happens to live under the "max" tag namespace.

``is_nous_max_non_agentic`` should only match the actual Nous Research
Max-3 / Max-4 chat family.
"""

from __future__ import annotations

import pytest

from max_cli.model_switch import (
    _MAX_MODEL_WARNING,
    _check_max_model_warning,
    is_nous_max_non_agentic,
)


@pytest.mark.parametrize(
    "model_name",
    [
        "StardustResearch/Max-3-Llama-3.1-70B",
        "StardustResearch/Max-3-Llama-3.1-405B",
        "max-3",
        "Max-3",
        "max-4",
        "max-4-405b",
        "max_4_70b",
        "openrouter/hermes3:70b",
        "openrouter/stardustresearch/max-4-405b",
        "StardustResearch/Max3",
        "max-3.1",
    ],
)
def test_matches_real_nous_max_chat_models(model_name: str) -> None:
    assert is_nous_max_non_agentic(model_name), (
        f"expected {model_name!r} to be flagged as Nous Max 3/4"
    )
    assert _check_max_model_warning(model_name) == _MAX_MODEL_WARNING


@pytest.mark.parametrize(
    "model_name",
    [
        # Kyle's local Modelfile — qwen3:14b under a custom tag
        "max-brain:qwen3-14b-ctx16k",
        "max-brain:qwen3-14b-ctx32k",
        "max-honcho:qwen3-8b-ctx8k",
        # Plain unrelated models
        "qwen3:14b",
        "qwen3-coder:30b",
        "qwen2.5:14b",
        "claude-opus-4-6",
        "anthropic/claude-sonnet-4.5",
        "gpt-5",
        "openai/gpt-4o",
        "google/gemini-2.5-flash",
        "deepseek-chat",
        # Non-chat Max models we don't warn about
        "max-llm-2",
        "hermes2-pro",
        "nous-max-2-mistral",
        # Edge cases
        "",
        "max",  # bare "max" isn't the 3/4 family
        "max-brain",
        "brain-max-3-impostor",  # "3" not preceded by /: boundary
    ],
)
def test_does_not_match_unrelated_models(model_name: str) -> None:
    assert not is_nous_max_non_agentic(model_name), (
        f"expected {model_name!r} NOT to be flagged as Nous Max 3/4"
    )
    assert _check_max_model_warning(model_name) == ""


def test_none_like_inputs_are_safe() -> None:
    assert is_nous_max_non_agentic("") is False
    # Defensive: the helper shouldn't crash on None-ish falsy input either.
    assert _check_max_model_warning("") == ""
