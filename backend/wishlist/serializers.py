from rest_framework import serializers

from .models import Wishlist, WishlistItem


class WishlistItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = WishlistItem
        fields = (
            "uuid", "title", "url", "notes", "image_url", "price", "priority",
            "status", "created_at", "updated_at",
        )
        read_only_fields = ("uuid", "created_at", "updated_at")


class WishlistSerializer(serializers.ModelSerializer):
    item_count = serializers.IntegerField(source="items.count", read_only=True)

    class Meta:
        model = Wishlist
        fields = ("uuid", "name", "description", "item_count", "created_at", "updated_at")
        read_only_fields = ("uuid", "item_count", "created_at", "updated_at")
