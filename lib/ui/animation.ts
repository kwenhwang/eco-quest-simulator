export const ecoEase = {
  softBounce: "cubic-bezier(0.22, 1, 0.36, 1)",
  pop: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  glide: "cubic-bezier(0.16, 1, 0.3, 1)",
  gentle: "cubic-bezier(0.4, 0, 0.2, 1)",
} as const;

export const ecoDuration = {
  xShort: 110,
  short: 180,
  medium: 260,
  long: 420,
} as const;

export const ecoAnimationTokens = {
  hudEnter: {
    duration: ecoDuration.medium,
    easing: ecoEase.glide,
  },
  quickDockBounce: {
    duration: ecoDuration.short,
    easing: ecoEase.softBounce,
  },
  notificationPop: {
    duration: ecoDuration.short,
    easing: ecoEase.pop,
  },
} as const;

export type AnimationTokenKey = keyof typeof ecoAnimationTokens;
