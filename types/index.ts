import { Doc } from "@/convex/_generated/dataModel";

export type ImageWithUrlType = Doc<"gigMedia"> & {
    url: string
};