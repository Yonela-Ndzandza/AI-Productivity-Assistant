import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ShoppingBasket, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/grocery")({
  head: () => ({
    meta: [
      { title: "Grocery List — GlowFlow AI" },
      {
        name: "description",
        content: "Your smart grocery list, auto-generated from your meal plan.",
      },
      { property: "og:title", content: "Grocery List — GlowFlow AI" },
      { property: "og:description", content: "Organized categories, one-tap check off." },
    ],
  }),
  component: GroceryPage,
});

type Item = { id: number; name: string; done: boolean };
type Category = { name: string; emoji: string; items: Item[] };

const initial: Category[] = [
  {
    name: "Vegetables",
    emoji: "🥬",
    items: [
      { id: 1, name: "Baby spinach", done: false },
      { id: 2, name: "Broccoli", done: false },
      { id: 3, name: "Sweet potato", done: true },
      { id: 4, name: "Avocado", done: false },
    ],
  },
  {
    name: "Protein",
    emoji: "🍣",
    items: [
      { id: 5, name: "Wild salmon", done: false },
      { id: 6, name: "Organic tofu", done: false },
      { id: 7, name: "Pasture eggs", done: true },
    ],
  },
  {
    name: "Fermented Foods",
    emoji: "🫙",
    items: [
      { id: 8, name: "Kefir", done: false },
      { id: 9, name: "Sauerkraut", done: false },
      { id: 10, name: "Miso paste", done: false },
    ],
  },
  {
    name: "Fruit",
    emoji: "🫐",
    items: [
      { id: 11, name: "Blueberries", done: false },
      { id: 12, name: "Green apples", done: false },
    ],
  },
  {
    name: "Pantry",
    emoji: "🌾",
    items: [
      { id: 13, name: "Steel-cut oats", done: true },
      { id: 14, name: "Quinoa", done: false },
      { id: 15, name: "Extra virgin olive oil", done: false },
      { id: 16, name: "Chia seeds", done: false },
    ],
  },
];

function GroceryPage() {
  const [cats, setCats] = useState<Category[]>(initial);
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const toggle = (cat: string, id: number) =>
    setCats((prev) =>
      prev.map((c) =>
        c.name === cat
          ? { ...c, items: c.items.map((i) => (i.id === id ? { ...i, done: !i.done } : i)) }
          : c,
      ),
    );

  const addItem = (cat: string) => {
    const val = drafts[cat]?.trim();
    if (!val) return;
    setCats((prev) =>
      prev.map((c) =>
        c.name === cat
          ? { ...c, items: [...c.items, { id: Date.now(), name: val, done: false }] }
          : c,
      ),
    );
    setDrafts((d) => ({ ...d, [cat]: "" }));
  };

  const remove = (cat: string, id: number) =>
    setCats((prev) =>
      prev.map((c) =>
        c.name === cat ? { ...c, items: c.items.filter((i) => i.id !== id) } : c,
      ),
    );

  const total = cats.reduce((n, c) => n + c.items.length, 0);
  const done = cats.reduce((n, c) => n + c.items.filter((i) => i.done).length, 0);

  return (
    <AppShell>
      <PageHeader
        icon={<ShoppingBasket className="h-5 w-5" />}
        title="Grocery List"
        description="Auto-generated from your meal plan. Check items as you shop."
        actions={
          <Badge variant="secondary" className="text-sm">
            {done}/{total} collected
          </Badge>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cats.map((c) => (
          <Card key={c.name} className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-base">
                <span className="flex items-center gap-2">
                  <span className="text-xl">{c.emoji}</span> {c.name}
                </span>
                <Badge variant="secondary">{c.items.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {c.items.map((i) => (
                <div
                  key={i.id}
                  className="group flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50"
                >
                  <Checkbox
                    checked={i.done}
                    onCheckedChange={() => toggle(c.name, i.id)}
                  />
                  <span
                    className={`flex-1 text-sm ${
                      i.done ? "text-muted-foreground line-through" : ""
                    }`}
                  >
                    {i.name}
                  </span>
                  <button
                    onClick={() => remove(c.name, i.id)}
                    className="opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                  </button>
                </div>
              ))}
              <div className="flex gap-2 pt-2">
                <Input
                  value={drafts[c.name] ?? ""}
                  onChange={(e) => setDrafts((d) => ({ ...d, [c.name]: e.target.value }))}
                  onKeyDown={(e) => e.key === "Enter" && addItem(c.name)}
                  placeholder="Add item"
                  className="h-9"
                />
                <Button size="icon" variant="secondary" onClick={() => addItem(c.name)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
