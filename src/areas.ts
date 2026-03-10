import { Package, Gauge, Sparkles, Brain, Settings } from "lucide-react";
import type { RailItemConfig } from "./types";

/**
 * Canonical rail items in display order.
 * Both apps import this to guarantee identical icon/label/order.
 */
export const RAIL_ITEMS: readonly RailItemConfig[] = [
  {
    area: "engine",
    icon: Package,
    label: "The Engine",
    shortLabel: "Engine",
  },
  {
    area: "operations",
    icon: Gauge,
    label: "Operations",
    shortLabel: "Ops",
  },
  {
    area: "enginegpt",
    icon: Sparkles,
    label: "EngineGPT",
    shortLabel: "GPT",
  },
  {
    area: "meetingbrain",
    icon: Brain,
    label: "MeetingBrain",
    shortLabel: "MB",
  },
  {
    area: "admin",
    icon: Settings,
    label: "Administration",
    shortLabel: "Admin",
  },
] as const;
