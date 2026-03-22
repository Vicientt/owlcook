export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex flex-row items-center justify-center gap-4 text-sm text-gray-600">
          <span>© {currentYear} OwlCook. All rights reserved.</span>
          <span className="text-gray-300">·</span>
          <span className="bg-gradient-to-r from-[#432C91] via-[#0D9488] to-[#D97706] bg-clip-text text-transparent font-semibold">
            Created by Hoan
          </span>
        </div>
      </div>
    </footer>
  );
}
