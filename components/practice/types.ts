import type { Solfege } from "@/lib/music";

export type Feedback =
  | { state: "idle"; message: string; chosen?: undefined }
  | { state: "correct"; message: string; chosen: Solfege }
  | { state: "incorrect"; message: string; chosen: Solfege }
  | { state: "shown"; message: string; chosen: Solfege };
