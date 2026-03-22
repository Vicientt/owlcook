function Input({ className = "", type = "text", ...props }) {
  const base = "flex h-9 w-full rounded-md border-2 border-gray-200 bg-white px-3 py-1 text-base outline-none transition-colors focus:border-[#432C91] focus:ring-2 focus:ring-[#432C91]/20 disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-gray-400";
  return <input type={type} className={`${base} ${className}`.trim()} {...props} />;
}

export { Input };
