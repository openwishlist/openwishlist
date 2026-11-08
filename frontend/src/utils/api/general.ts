
import { fetchData } from "./base"
export type WishlistSummary = {
	uuid: string
	name: string
	description: string
	item_count: number
	created_at: string
	updated_at: string
}

export type SidebarData = {
	user: { name: string }
	wishlists: WishlistSummary[]
	version: string
}

export function getSidebarData() {
	return fetchData<SidebarData>("/api/sidebar/")
}
