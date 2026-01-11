import type { Features } from "./Features";

export type Subscription = {
  id: string;
  name: string;
  max_pins: number;
  features: Features;
  created_at: string | null;
};
