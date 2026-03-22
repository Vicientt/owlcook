function Slider({ className = "", value = 50, onChange, min = 0, max = 100, step = 1, ...props }) {
  const percent = ((value - min) / (max - min)) * 100;
  const trackBg = `linear-gradient(to right, #432C91 0%, #432C91 ${percent}%, #E5E7EB ${percent}%, #E5E7EB 100%)`;

  return (
    <div className={`relative flex w-full items-center ${className}`.trim()}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange?.(Number(e.target.value))}
        style={{ background: trackBg }}
        className="h-4 w-full cursor-pointer appearance-none rounded-full accent-[#432C91] [&::-webkit-slider-runnable-track]:h-4 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#432C91] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:-webkit-appearance-none [&::-webkit-slider-thumb]:mt-0 [&::-moz-range-track]:h-4 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-gray-200 [&::-moz-range-progress]:bg-[#432C91] [&::-moz-range-progress]:rounded-full [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#432C91] [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
        {...props}
      />
    </div>
  );
}

export { Slider };
