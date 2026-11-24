export const MIN_VIDEO_COUNT = 1;
export const MAX_VIDEO_COUNT = 50;
export const VIDEO_COUNT_OPTIONS = Object.freeze(
  Array.from({ length: MAX_VIDEO_COUNT }, (_, index) => index + MIN_VIDEO_COUNT)
);

export function isValidVideoCount(value) {
  const count = Number(value);
  return Number.isInteger(count) && count >= MIN_VIDEO_COUNT && count <= MAX_VIDEO_COUNT;
}