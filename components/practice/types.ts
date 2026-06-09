import type { Solfege } from "@/lib/music";

export type Feedback =
  | { state: "idle"; message: string; chosen?: undefined }
  | { state: "retry"; message: string; chosen: Solfege }
  | { state: "correct"; message: string; chosen: Solfege }
  | { state: "shown"; message: string; chosen: Solfege };
