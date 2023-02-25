import { RecruiterInputSchema } from "@gql/generated";
import { z } from "zod";

export const FormAlterRecruitersOrgSchema = z.object({
  OrganizationId: z.string().min(1, "Organization identifier must be filled"),
  RecruiterInput: z
    .array(z.lazy(() => RecruiterInputSchema().nullable()))
    .nullish(),
});
