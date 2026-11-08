import uuid

from django.db import models


class Wishlist(models.Model):
    uuid = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    name = models.CharField(max_length=120)
    description = models.TextField(blank=True)
    oidc_managed = models.BooleanField(default=False)
    oidc_group = models.CharField(max_length=255, blank=True, null=True, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("name",)

    def __str__(self):
        return self.name


class WishlistMembership(models.Model):
    class Role(models.TextChoices):
        OWNER = "owner", "Owner"
        EDITOR = "editor", "Editor"
        VIEWER = "viewer", "Viewer"

    wishlist = models.ForeignKey(Wishlist, on_delete=models.CASCADE, related_name="memberships")
    user = models.ForeignKey("account_auth.CustomUser", on_delete=models.CASCADE, related_name="wishlist_memberships")
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.VIEWER)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = (
            models.UniqueConstraint(fields=("wishlist", "user"), name="unique_wishlist_membership"),
        )

    def can_read(self):
        return True

    def can_write(self):
        return self.role in {self.Role.OWNER, self.Role.EDITOR}

    def can_manage(self):
        return self.role == self.Role.OWNER


class WishlistItem(models.Model):
    class Status(models.TextChoices):
        WANTED = "wanted", "Wanted"
        ACQUIRED = "acquired", "Acquired"
        ARCHIVED = "archived", "Archived"

    class Priority(models.IntegerChoices):
        LOW = 1, "Low"
        MEDIUM = 2, "Medium"
        HIGH = 3, "High"

    uuid = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    wishlist = models.ForeignKey(Wishlist, on_delete=models.CASCADE, related_name="items")
    title = models.CharField(max_length=200)
    url = models.URLField(blank=True)
    notes = models.TextField(blank=True)
    image_url = models.URLField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    priority = models.PositiveSmallIntegerField(choices=Priority.choices, default=Priority.MEDIUM)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.WANTED)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("-priority", "-created_at")

    def __str__(self):
        return self.title
