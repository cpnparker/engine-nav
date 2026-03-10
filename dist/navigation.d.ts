import type { Area, HostConfig } from "./types";
/**
 * Default host configuration for the Content Engine platform.
 * Apps can override specific hosts (e.g. MeetingBrain using meetingbrain.ai).
 */
export declare const DEFAULT_HOST_CONFIG: HostConfig;
/** Check if the current hostname is a known production host. */
export declare function isProductionHost(hostname?: string): boolean;
/** Detect which area the current hostname belongs to. */
export declare function detectCurrentArea(config?: HostConfig, hostname?: string): Area | null;
/**
 * Get the full URL for a given area.
 * In production, returns an absolute cross-origin URL.
 * On localhost/preview, returns a relative path.
 */
export declare function getAreaUrl(area: Area, config?: HostConfig, path?: string): string;
/**
 * Navigate to a different area.
 * Handles cross-subdomain navigation on production and local switching.
 * Returns false if navigation was suppressed (same area, or SSR).
 */
export declare function navigateToArea(targetArea: Area, currentArea: Area, options?: {
    /** Override the default host configuration. */
    config?: HostConfig;
    /** Called instead of window.location for same-host navigation (e.g. to switch sidebar panel). */
    onLocalSwitch?: (area: Area) => void;
    /** Override path for the target area. */
    path?: string;
}): boolean;
