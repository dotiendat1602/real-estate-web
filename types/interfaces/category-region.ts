import z from "zod";

export type TabId = "categories-property" | "amenities" | "nearby-facilities";

export interface TabDef {
  id: TabId;
  label: string;
}

export const categorySchema = z.object({
  category_name: z.string().trim().min(1, "Vui lòng nhập tên danh mục"),
  category_description: z.string().trim().optional(),
});
export type CategoryValues = z.infer<typeof categorySchema>;