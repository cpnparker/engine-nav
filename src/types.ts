import type { LucideIcon } from "lucide-react";

/** The five navigation areas across the Content Engine platform. */
export type Area =
  | "engine"
  | "operations"
  | "enginegpt"
  | "meetingbrain"
  | "admin";

/** Canonical definition for a single rail item. */
export interface RailItemConfig {
  area: Area;
  icon: LucideIcon;
  /** Full label, e.g. "The Engine" */
  label: string;
  /** Abbreviated label for mobile, e.g. "Engine" */
  shortLabel: string;
}

/** Host configuration for production URL generation. */
export interface HostConfig {
  /** Map of area to its production hostname (admin shares engine's host). */
  hosts: Record<Exclude<Area, "admin">, string>;
  /** Default landing path when navigating to each area. */
  defaultPaths: Record<Area, string>;
}
