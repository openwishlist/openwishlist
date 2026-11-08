from wishlist.models import Wishlist, WishlistMembership

from .models import Notification


def create_user_wishlist(user):
    wishlist = Wishlist.objects.create(name=f"{user.username}'s Wishlist")
    WishlistMembership.objects.create(
        wishlist=wishlist,
        user=user,
        role=WishlistMembership.Role.OWNER,
    )
    return wishlist


def create_notification(user, *, kind, title, message="", link="", metadata=None, source_key=""):
    """Create a user notification, optionally idempotently by source key."""
    defaults = {
        "kind": kind,
        "title": title,
        "message": message,
        "link": link,
        "metadata": metadata or {},
    }
    if source_key:
        notification, _ = Notification.objects.update_or_create(
            user=user,
            source_key=source_key,
            defaults=defaults,
        )
        return notification
    return Notification.objects.create(user=user, source_key="", **defaults)
