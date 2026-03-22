function Button({ className = "", children, ...props }) {
  const base = "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-all disabled:opacity-50 disabled:pointer-events-none";
  return (
    <button className={`${base} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}

export { Button };
