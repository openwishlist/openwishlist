from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Wishlist, WishlistItem, WishlistMembership
from .serializers import WishlistItemSerializer, WishlistSerializer


def accessible_wishlists(user):
    return Wishlist.objects.filter(users=user)


def membership_for(user, wishlist):
    return WishlistMembership.objects.filter(user=user, wishlist=wishlist).first()


class WishlistListView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        return Response(WishlistSerializer(accessible_wishlists(request.user), many=True).data)

    def post(self, request):
        serializer = WishlistSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        wishlist = serializer.save()
        wishlist.users.add(request.user)
        return Response(WishlistSerializer(wishlist).data, status=status.HTTP_201_CREATED)


class WishlistDetailView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self, request, wishlist_uuid):
        return get_object_or_404(accessible_wishlists(request.user), uuid=wishlist_uuid)

    def get(self, request, wishlist_uuid):
        wishlist = self.get_object(request, wishlist_uuid)
        return Response({**WishlistSerializer(wishlist).data, "items": WishlistItemSerializer(wishlist.items.all(), many=True).data})

    def patch(self, request, wishlist_uuid):
        wishlist = self.get_object(request, wishlist_uuid)
        membership = membership_for(request.user, wishlist)
        if not membership or not membership.can_manage():
            return Response({"detail": "Only wishlist owners can change wishlist settings."}, status=status.HTTP_403_FORBIDDEN)
        serializer = WishlistSerializer(wishlist, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data)

    def delete(self, request, wishlist_uuid):
        wishlist = self.get_object(request, wishlist_uuid)
        membership = membership_for(request.user, wishlist)
        if not membership or not membership.can_manage():
            return Response({"detail": "Only wishlist owners can delete wishlists."}, status=status.HTTP_403_FORBIDDEN)
        wishlist.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class WishlistItemListView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get_wishlist(self, request, wishlist_uuid):
        return get_object_or_404(accessible_wishlists(request.user), uuid=wishlist_uuid)

    def get(self, request, wishlist_uuid):
        wishlist = self.get_wishlist(request, wishlist_uuid)
        query = request.query_params.get("q", "").strip()
        items = wishlist.items.all()
        if query:
            items = items.filter(Q(title__icontains=query) | Q(notes__icontains=query))
        return Response(WishlistItemSerializer(items, many=True).data)

    def post(self, request, wishlist_uuid):
        wishlist = self.get_wishlist(request, wishlist_uuid)
        membership = membership_for(request.user, wishlist)
        if not membership or not membership.can_write():
            return Response({"detail": "You only have read access to this wishlist."}, status=status.HTTP_403_FORBIDDEN)
        serializer = WishlistItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(wishlist=wishlist)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class WishlistItemDetailView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self, request, wishlist_uuid, item_uuid):
        return get_object_or_404(
            WishlistItem,
            wishlist__uuid=wishlist_uuid,
            wishlist__users=request.user,
            uuid=item_uuid,
        )

    def patch(self, request, wishlist_uuid, item_uuid):
        item = self.get_object(request, wishlist_uuid, item_uuid)
        membership = membership_for(request.user, item.wishlist)
        if not membership or not membership.can_write():
            return Response({"detail": "You only have read access to this wishlist."}, status=status.HTTP_403_FORBIDDEN)
        serializer = WishlistItemSerializer(item, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def delete(self, request, wishlist_uuid, item_uuid):
        item = self.get_object(request, wishlist_uuid, item_uuid)
        membership = membership_for(request.user, item.wishlist)
        if not membership or not membership.can_write():
            return Response({"detail": "You only have read access to this wishlist."}, status=status.HTTP_403_FORBIDDEN)
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
