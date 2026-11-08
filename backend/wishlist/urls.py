from django.urls import path

from .views import (
    WishlistDetailView,
    WishlistItemDetailView,
    WishlistItemListView,
    WishlistListView,
)

urlpatterns = [
    path("wishlists/", WishlistListView.as_view(), name="wishlist-list"),
    path("wishlists/<uuid:wishlist_uuid>/", WishlistDetailView.as_view(), name="wishlist-detail"),
    path("wishlists/<uuid:wishlist_uuid>/items/", WishlistItemListView.as_view(), name="wishlist-item-list"),
    path("wishlists/<uuid:wishlist_uuid>/items/<uuid:item_uuid>/", WishlistItemDetailView.as_view(), name="wishlist-item-detail"),
]
