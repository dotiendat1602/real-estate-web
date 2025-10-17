export type TabId = "categories-property" | "amenities" | "nearby-facilities";

export interface TabDef {
  id: TabId;
  label: string;
}