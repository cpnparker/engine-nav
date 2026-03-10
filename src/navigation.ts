import type { Area, HostConfig } from "./types";

/**
 * Default host configuration for the Content Engine platform.
 * Apps can override specific hosts (e.g. MeetingBrain using meetingbrain.ai).
 */
export const DEFAULT_HOST_CONFIG: HostConfig = {
  hosts: {
    engine: "engine.thecontentengine.com",
    operations: "operations.thecontentengine.com",
    enginegpt: "ai.thecontentengine.com",
    meetingbrain: "meetingbrain.thecontentengine.com",
  },
  defaultPaths: {
    engine: "/dashboard",
    operations: "/operations/commissioned-cus",
    enginegpt: "/",
    meetingbrain: "/",
    admin: "/settings/workspace",
  },
};

/** Check if the current hostname is a known production host. */
export function isProductionHost(hostname?: string): boolean {
  const host =
    hostname ??
    (typeof window !== "undefined" ? window.location.hostname : "");
  return (
    host.endsWith("thecontentengine.com") || host === "meetingbrain.ai"
  );
}

/** Detect which area the current hostname belongs to. */
export function detectCurrentArea(
  config: HostConfig = DEFAULT_HOST_CONFIG,
  hostname?: string,
): Area | null {
  const host =
    hostname ??
    (typeof window !== "undefined" ? window.location.hostname : "");

  for (const [area, areaHost] of Object.entries(config.hosts)) {
    if (host === areaHost) return area as Area;
  }

  // meetingbrain.ai is an alias for the meetingbrain area
  if (host === "meetingbrain.ai") return "meetingbrain";

  return null;
}

/**
 * Get the full URL for a given area.
 * In production, returns an absolute cross-origin URL.
 * On localhost/preview, returns a relative path.
 */
export function getAreaUrl(
  area: Area,
  config: HostConfig = DEFAULT_HOST_CONFIG,
  path?: string,
): string {
  const targetPath = path ?? config.defaultPaths[area];

  if (!isProductionHost()) {
    return targetPath;
  }

  // Admin shares the engine host
  if (area === "admin") {
    return `https://${config.hosts.engine}${targetPath}`;
  }

  return `https://${config.hosts[area]}${targetPath}`;
}

/**
 * Navigate to a different area.
 * Handles cross-subdomain navigation on production and local switching.
 * Returns false if navigation was suppressed (same area, or SSR).
 */
export function navigateToArea(
  targetArea: Area,
  currentArea: Area,
  options?: {
    /** Override the default host configuration. */
    config?: HostConfig;
    /** Called instead of window.location for same-host navigation (e.g. to switch sidebar panel). */
    onLocalSwitch?: (area: Area) => void;
    /** Override path for the target area. */
    path?: string;
  },
): boolean {
  if (targetArea === currentArea) return false;
  if (typeof window === "undefined") return false;

  const config = options?.config ?? DEFAULT_HOST_CONFIG;
  const url = getAreaUrl(targetArea, config, options?.path);

  // Check if target is on a different host
  const currentHost = window.location.hostname;

  if (isProductionHost(currentHost)) {
    // Determine the target host
    const targetHost =
      targetArea === "admin"
        ? config.hosts.engine
        : config.hosts[targetArea];

    if (currentHost !== targetHost) {
      // Cross-origin: full page navigation
      window.location.href = url;
      return true;
    }

    // Same host (e.g. engine <-> admin on engine.thecontentengine.com)
    if (options?.onLocalSwitch) {
      options.onLocalSwitch(targetArea);
    } else {
      window.location.href = url;
    }
    return true;
  }

  // Localhost / preview: EngineGPT and MeetingBrain have their own layouts,
  // so always use full navigation for those.
  if (targetArea === "enginegpt" || targetArea === "meetingbrain") {
    window.location.href = url;
    return true;
  }

  // Engine / Operations / Admin — switch panel or navigate
  if (options?.onLocalSwitch) {
    options.onLocalSwitch(targetArea);
  } else {
    window.location.href = url;
  }
  return true;
}
