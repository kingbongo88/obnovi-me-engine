// Slug helpers for model URLs. Keep the mapping deterministic and reversible
// enough that a slug uniquely identifies one model_name in the devices table.

export function modelToSlug(model: string): string {
  return model
    .toLowerCase()
    .replace(/\+/g, " plus ")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}
