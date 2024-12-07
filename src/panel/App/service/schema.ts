import { z } from "zod";

export const StoreSchema = z.object({
  theme: z.enum(["dark", "light"]).optional(),
  active: z.boolean().optional(),
  settings: z.object({
    enabledScenarios: z.boolean().optional(),
  }),
  groups: z.array(
    z.object({
      type: z.literal("group"),
      name: z.string(),
      description: z.string(),
      id: z.string(),
      active: z.boolean(),
      createdOn: z.number(),
      expanded: z.boolean().optional(),
    })
  ),
  totalGroupsCreated: z.number().optional(),
  mocks: z.array(
    z.object({
      type: z.literal("mock"),
      method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
      createdOn: z.number(),
      url: z.string(),
      status: z.number(),
      response: z.string().optional(),
      headers: z
        .array(z.object({ name: z.string(), value: z.string() }))
        .optional(),
      delay: z.number().optional(),
      name: z.string().optional(),
      id: z.string(),
      groupId: z.string().optional(),
      dynamic: z.boolean().optional(),
      active: z.boolean(),
      selected: z.boolean().optional(),
      description: z.string(),
      action: z
        .function()
        .args(
          z.object({
            body: z.record(z.any()),
            params: z.record(z.any()),
            queryParams: z.record(z.any()),
          })
        )
        .returns(z.string())
        .optional(),
    })
  ),
  totalMocksCreated: z.number().optional(),
  collections: z.record(z.any()).optional(),
  activityInfo: z
    .object({
      promoted: z.boolean(),
    })
    .optional(),
});
