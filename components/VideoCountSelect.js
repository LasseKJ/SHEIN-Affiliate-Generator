"use client";

const VIDEO_COUNTS = Array.from({ length: 50 }, (_, index) => index + 1);

export default function VideoCountSelect({ value, onChange, disabled = false }) {
  return (
    <select
      className="video-count-select"
      aria-label="Number of videos"
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
      disabled={disabled}
    >
      {VIDEO_COUNTS.map((count) => (
        <option key={count} value={count}>{count}</option>
      ))}
    </select>
  );
}