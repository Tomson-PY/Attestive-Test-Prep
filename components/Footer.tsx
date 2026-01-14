import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-white/50 border-t border-black/5 py-12 mt-auto">
      <div className="max-w-screen-xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <div className="font-display font-bold text-lg text-[var(--text-main)]">Attestiva</div>
          <div className="text-xs text-[var(--text-main)]/60 mt-1 italic">If it matters, verify it.</div>
        </div>
        <div className="text-sm text-[var(--text-main)]/60">
          © {new Date().getFullYear()} Attestiva. All rights reserved.
        </div>
        <div className="flex gap-6 text-sm font-medium text-[var(--text-main)]/80">
          <Link href="#" className="hover:text-[var(--color-accent)] transition-colors">Privacy</Link>
          <Link href="#" className="hover:text-[var(--color-accent)] transition-colors">Terms</Link>
          <Link href="#" className="hover:text-[var(--color-accent)] transition-colors">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
