/**
 * Feature switches for the POC.
 * SHOW_STAGE_SELECTION: the Newbie / Intermediate / Advanced choice and the
 * placement check. Off while we focus on Newbies; everyone starts as Newbie.
 */
export const SHOW_STAGE_SELECTION = false

/**
 * Real film lines (Rajinikanth, Vijay, Kamal Haasan), credited, text only.
 * Turn off to show only the original lines. Get an IP solicitor's view before public launch.
 */
export const SHOW_FILM_LINES = true

/** Dialects the app can teach right now. Indian Tamil is shown as coming soon. */
export const AVAILABLE_DIALECTS = ['lk'] as const
