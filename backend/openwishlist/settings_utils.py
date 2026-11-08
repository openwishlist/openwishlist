"""Parsers for environment variables that need more than a flag or a list (used by settings.py).

Nothing here may import Django models: settings.py loads this module before the apps are ready.
"""

import json
import os
import uuid

from django.core.exceptions import ImproperlyConfigured


def group_wishlists_env(name):
    """Parse the explicit group mapping, a JSON object {"<group>": "<wishlist uuid>"}.

    JSON because group names may contain commas, "=" or ":". Any invalid entry stops the start:
    dropping it would release the wishlist it protects, and a typo must never bind an
    unexpected wishlist.
    """
    raw_value = os.getenv(name, "").strip()
    if not raw_value:
        return {}
    try:
        value = json.loads(raw_value, object_pairs_hook=lambda pairs: _reject_repeated_keys(name, pairs))
    except json.JSONDecodeError as exc:
        raise ImproperlyConfigured(f"{name} is not valid JSON: {exc}") from exc
    if not isinstance(value, dict):
        raise ImproperlyConfigured(f"{name} must be a JSON object of group names to wishlist UUIDs.")
    mapping, wishlists = {}, set()
    for group, wishlist in value.items():
        try:
            wishlist = str(uuid.UUID(str(wishlist)))
        except ValueError as exc:
            raise ImproperlyConfigured(f"{name}: {wishlist!r} for group {group!r} is not an wishlist UUID.") from exc
        # Two groups for one wishlist would rebind it on every login.
        if wishlist in wishlists:
            raise ImproperlyConfigured(f"{name} maps wishlist {wishlist} to more than one group ({group!r}).")
        wishlists.add(wishlist)
        mapping[group] = wishlist
    return mapping


def _reject_repeated_keys(name, pairs):
    # json.loads keeps only the last value of a repeated key, which would drop an entry silently.
    keys = [key for key, _ in pairs]
    repeated = sorted({key for key in keys if keys.count(key) > 1})
    if repeated:
        raise ImproperlyConfigured(f"{name} lists group {repeated[0]!r} more than once.")
    return dict(pairs)
