import { OrganizationInputSchema } from "@gql/generated";
import { z } from "zod";

export const FormAlterOrganizationSchema = OrganizationInputSchema().extend({
  activitySectorId: z.coerce.number().min(1),
  headQuartersId: z.coerce.number().min(1),
  locations: z.array(z.coerce.number().nullable()).nullish(),
});
