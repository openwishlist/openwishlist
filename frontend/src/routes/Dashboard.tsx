import { useEffect, useState, type FormEvent } from "react"
import { Plus, Trash2, ExternalLink, Check } from "lucide-react"
import BaseScreen from "@/layouts/BaseScreen"
import { Button } from "@/components/ui/button"
import { wishlistsApi, type Wishlist, type WishlistItem } from "@/utils/api/wishlists"

export default function Dashboard() {
  const [wishlists, setWishlists] = useState<Wishlist[]>([])
  const [selected, setSelected] = useState<(Wishlist & { items: WishlistItem[] }) | null>(null)
  const [newTitle, setNewTitle] = useState("")
  const [newListName, setNewListName] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  async function loadLists() {
    const lists = await wishlistsApi.list()
    setWishlists(lists)
    const current = selected ? lists.find((list) => list.uuid === selected.uuid) : lists[0]
    if (current) setSelected(await wishlistsApi.get(current.uuid))
  }

  useEffect(() => {
    void loadLists().catch((reason) => setError(reason instanceof Error ? reason.message : "Unable to load wishlists.")).finally(() => setLoading(false))
  }, [])

  async function addItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selected || !newTitle.trim()) return
    await wishlistsApi.addItem(selected.uuid, { title: newTitle.trim(), priority: 2, status: "wanted" })
    setNewTitle("")
    setSelected(await wishlistsApi.get(selected.uuid))
    await loadLists()
  }

  async function createList(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!newListName.trim()) return
    const list = await wishlistsApi.create({ name: newListName.trim(), description: "" })
    setNewListName("")
    setWishlists((current) => [...current, list])
    setSelected(await wishlistsApi.get(list.uuid))
  }

  async function toggleItem(item: WishlistItem) {
    if (!selected) return
    await wishlistsApi.updateItem(selected.uuid, item.uuid, { status: item.status === "acquired" ? "wanted" : "acquired" })
    setSelected(await wishlistsApi.get(selected.uuid))
    await loadLists()
  }

  async function removeItem(item: WishlistItem) {
    if (!selected) return
    await wishlistsApi.removeItem(selected.uuid, item.uuid)
    setSelected(await wishlistsApi.get(selected.uuid))
    await loadLists()
  }

  return (
    <BaseScreen title="My wishlists" description="Keep every future purchase in one calm, shareable place.">
      {error && <p className="mb-5 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
      <div className="grid gap-8 lg:grid-cols-[15rem_1fr]">
        <aside className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Lists</h2>
            <span className="text-xs text-muted-foreground">{wishlists.length}</span>
          </div>
          <div className="space-y-1">
            {wishlists.map((list) => (
              <button key={list.uuid} type="button" onClick={() => void wishlistsApi.get(list.uuid).then(setSelected)} className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm ${selected?.uuid === list.uuid ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>
                <span className="truncate">{list.name}</span>
                <span className="ml-2 text-xs opacity-70">{list.item_count}</span>
              </button>
            ))}
          </div>
          <form onSubmit={createList} className="flex gap-2 pt-2">
            <input value={newListName} onChange={(event) => setNewListName(event.target.value)} placeholder="New list" className="min-w-0 flex-1 rounded-md border bg-background px-2 py-1.5 text-sm" />
            <Button type="submit" size="icon" aria-label="Create wishlist"><Plus /></Button>
          </form>
        </aside>

        <section>
          {loading && <p className="text-sm text-muted-foreground">Loading your wishlists...</p>}
          {!loading && !selected && <div className="rounded-xl border border-dashed p-12 text-center"><h2 className="font-semibold">Create your first wishlist</h2><p className="mt-2 text-sm text-muted-foreground">Use the field on the left to start collecting ideas.</p></div>}
          {selected && <>
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div><p className="text-sm text-muted-foreground">Wishlist</p><h2 className="text-2xl font-semibold">{selected.name}</h2></div>
              <span className="text-sm text-muted-foreground">{selected.items.length} items</span>
            </div>
            <form onSubmit={addItem} className="mb-6 flex gap-2 rounded-lg border bg-background p-2">
              <input autoFocus value={newTitle} onChange={(event) => setNewTitle(event.target.value)} placeholder="What do you wish for?" className="min-w-0 flex-1 bg-transparent px-2 text-sm outline-none" />
              <Button type="submit"><Plus /> Add item</Button>
            </form>
            <div className="divide-y rounded-xl border">
              {selected.items.map((item) => <article key={item.uuid} className="flex items-center gap-3 p-4">
                <button type="button" onClick={() => void toggleItem(item)} aria-label={item.status === "acquired" ? "Mark as wanted" : "Mark as acquired"} className={`flex size-7 shrink-0 items-center justify-center rounded-full border ${item.status === "acquired" ? "border-emerald-600 bg-emerald-600 text-white" : "hover:bg-muted"}`}><Check className="size-4" /></button>
                <div className="min-w-0 flex-1"><h3 className={`font-medium ${item.status === "acquired" ? "text-muted-foreground line-through" : ""}`}>{item.title}</h3>{item.notes && <p className="truncate text-sm text-muted-foreground">{item.notes}</p>}</div>
                {item.url && <a href={item.url} target="_blank" rel="noreferrer" aria-label={`Open ${item.title}`} className="text-muted-foreground hover:text-foreground"><ExternalLink className="size-4" /></a>}
                <button type="button" onClick={() => void removeItem(item)} aria-label={`Delete ${item.title}`} className="text-muted-foreground hover:text-destructive"><Trash2 className="size-4" /></button>
              </article>)}
              {selected.items.length === 0 && <p className="p-10 text-center text-sm text-muted-foreground">Your list is waiting for its first idea.</p>}
            </div>
          </>}
        </section>
      </div>
    </BaseScreen>
  )
}
