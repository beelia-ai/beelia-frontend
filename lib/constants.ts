// Feature flag: Set to true to show all videos, false to hide them (blackhole video in Footer remains visible)
// To show videos again, change this to: export const SHOW_HERO_VIDEOS = true;
export const SHOW_HERO_VIDEOS = true;

// Globe sizes for future-transition and future-main videos
export const FUTURE_GLOBE_SIZE_MOBILE = 260; // px
export const FUTURE_GLOBE_SIZE_DESKTOP = 372; // px

// Past video (past.webm) sizes
export const PAST_VIDEO_SIZE_MOBILE = 292; // px
export const PAST_VIDEO_SIZE_DESKTOP = 452; // px

// Globe top position from top of viewport
export const GLOBE_TOP_MOBILE = 100; // px
export const GLOBE_TOP_DESKTOP = 84; // px

// Video transition scroll positions
// Past to Present transition: cross-fade from past.webm to present.webm
export const PAST_TO_PRESENT_TRANSITION_START = 200; // px - start fading out past.webm and fading in present.webm
export const PAST_TO_PRESENT_TRANSITION_END = 600; // px - transition complete (400px duration)

// Present to Future-transition: scroll-triggered, time-based cross-fade from present.webm to future-transition.webm
export const PRESENT_TO_FUTURE_TRANSITION_START = 2700; // px - scroll position where transition is triggered
export const PRESENT_TO_FUTURE_TRANSITION_DURATION = 5; // seconds - time-based fade duration (not scroll-based)

// Reset threshold: when scrolling back, reset future videos when below this position
export const FUTURE_TRANSITION_RESET_THRESHOLD = 2600; // px - reset future videos when scrolling back up past this point

// Video loading scroll positions - videos only load when scroll reaches these positions
export const ABOUT_PRODUCT_VIDEOS_LOAD_START = 400; // px - start loading AboutProduct videos when scroll reaches this position
export const FOOTER_VIDEO_LOAD_START = 2000; // px - start loading Footer video when scroll reaches this position

// Particle background settings
export const PARTICLE_COUNT_MOBILE = 75;
export const PARTICLE_COUNT_DESKTOP = 100;
