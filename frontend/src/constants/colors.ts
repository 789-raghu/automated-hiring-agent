// Base palette
export const WHITE = '#fff';
export const BLACK = '#000';

// Brand / accent
export const ACCENT = '#aa3bff';
export const ACCENT_DARK = '#c084fc';
export const ACCENT_BG = 'rgba(170, 59, 255, 0.1)';
export const ACCENT_BG_DARK = 'rgba(192, 132, 252, 0.15)';
export const ACCENT_BORDER = 'rgba(170, 59, 255, 0.5)';
export const ACCENT_BORDER_DARK = 'rgba(192, 132, 252, 0.5)';

// Text
export const TEXT_MUTED = '#6b6375';
export const TEXT_MUTED_DARK = '#9ca3af';
export const TEXT_HEADING = '#08060d';
export const TEXT_HEADING_DARK = '#f3f4f6';

// Backgrounds
export const BG_PAGE = '#fff';
export const BG_PAGE_DARK = '#16171d';
export const BG_CODE = '#f4f3ec';
export const BG_CODE_DARK = '#1f2028';
export const BG_SURFACE = '#f3f4f6';
export const BG_SOCIAL = 'rgba(244, 243, 236, 0.5)';
export const BG_SOCIAL_DARK = 'rgba(47, 48, 58, 0.5)';

// Borders
export const BORDER = '#e5e4e7';
export const BORDER_DARK = '#2e303a';

// Semantic: success
export const SUCCESS = '#16a34a';
export const SUCCESS_ALT = '#22c55e';
export const SUCCESS_BG = '#dcfce7';
export const SUCCESS_BG_ALPHA = 'rgba(22, 163, 74, 0.2)';
export const SUCCESS_ALPHA_12 = 'rgba(34, 197, 94, 0.12)';

// Semantic: warning
export const WARNING = '#ca8a04';
export const WARNING_ALT = '#d97706';
export const WARNING_DARK = '#b45309';
export const WARNING_AMBER = '#eab308';
export const WARNING_BG = '#fef9c3';
export const WARNING_BG_ALPHA = 'rgba(202, 138, 4, 0.2)';
export const WARNING_ALPHA_12 = 'rgba(234, 179, 8, 0.12)';

// Semantic: error / danger
export const ERROR = '#ef4444';
export const ERROR_ALT = '#dc2626';
export const ERROR_BG = '#fee2e2';
export const ERROR_BG_ALPHA = 'rgba(239, 68, 68, 0.08)';
export const ERROR_ALPHA_12 = 'rgba(239, 68, 68, 0.12)';
export const ERROR_ALPHA_15 = 'rgba(239, 68, 68, 0.15)';
export const ERROR_ALPHA_30 = 'rgba(239, 68, 68, 0.3)';
export const ERROR_BG_ALT_ALPHA = 'rgba(220, 38, 38, 0.2)';

// Semantic: info
export const INFO = '#2563eb';
export const INFO_ALPHA_12 = 'rgba(59, 130, 246, 0.12)';

// Overlays / shadows
export const OVERLAY_10 = 'rgba(0, 0, 0, 0.1)';
export const OVERLAY_25 = 'rgba(0, 0, 0, 0.25)';
export const OVERLAY_40 = 'rgba(0, 0, 0, 0.4)';
export const OVERLAY_50 = 'rgba(0, 0, 0, 0.5)';
export const OVERLAY_6 = 'rgba(0, 0, 0, 0.06)';
export const OVERLAY_5 = 'rgba(0, 0, 0, 0.05)';

// Avatar palette
export const AVATAR_COLORS: readonly string[] = [
  '#7c3aed', '#2563eb', '#0891b2', '#059669',
  '#d97706', '#dc2626', '#be185d', '#4f46e5',
];

// Score ring thresholds
export const SCORE_HIGH_COLOR = SUCCESS_ALT;    // score >= 80
export const SCORE_MED_COLOR  = WARNING_AMBER;  // score >= 60
export const SCORE_LOW_COLOR  = ERROR;          // score < 60
