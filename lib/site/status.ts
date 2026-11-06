/**
 * Site-wide "under construction" switch.
 *
 * While true, every page request is redirected to the locale home (/en or /es),
 * which renders the UnderConstruction page, and every /api route returns 503.
 * All other app code stays intact — set this to false to restore the full portal.
 */
export const UNDER_CONSTRUCTION = true;
