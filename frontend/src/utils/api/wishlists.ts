import { deleteData, fetchData, patchData, postData } from "./base"

export type Wishlist = {
  uuid: string
  name: string
  description: string
  item_count: number
  created_at: string
  updated_at: string
}

export type WishlistItem = {
  uuid: string
  title: string
  url: string
  notes: string
  image_url: string
  price: string | null
  priority: 1 | 2 | 3
  status: "wanted" | "acquired" | "archived"
  created_at: string
  updated_at: string
}

export const wishlistsApi = {
  list: () => fetchData<Wishlist[]>("/api/wishlists/"),
  create: (payload: Pick<Wishlist, "name" | "description">) => postData<Wishlist>("/api/wishlists/", payload),
  get: (uuid: string) => fetchData<Wishlist & { items: WishlistItem[] }>(`/api/wishlists/${uuid}/`),
  update: (uuid: string, payload: Partial<Pick<Wishlist, "name" | "description">>) => patchData<Wishlist>(`/api/wishlists/${uuid}/`, payload),
  remove: (uuid: string) => deleteData(`/api/wishlists/${uuid}/`),
  addItem: (uuid: string, payload: Partial<WishlistItem> & Pick<WishlistItem, "title">) => postData<WishlistItem>(`/api/wishlists/${uuid}/items/`, payload),
  updateItem: (wishlistUuid: string, itemUuid: string, payload: Partial<WishlistItem>) => patchData<WishlistItem>(`/api/wishlists/${wishlistUuid}/items/${itemUuid}/`, payload),
  removeItem: (wishlistUuid: string, itemUuid: string) => deleteData(`/api/wishlists/${wishlistUuid}/items/${itemUuid}/`),
}
