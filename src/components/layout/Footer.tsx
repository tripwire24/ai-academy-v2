import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface-primary py-8 mt-auto">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-sm text-text-muted">
        <p>&copy; {new Date().getFullYear()} Tripwire Digital Ltd. All rights reserved.</p>
        <div className="flex items-center gap-6 mt-4 md:mt-0">
          <Link href="/terms" className="hover:text-text-primary transition-colors">Terms</Link>
          <Link href="/privacy" className="hover:text-text-primary transition-colors">Privacy</Link>
          <Link href="/support" className="hover:text-text-primary transition-colors">Support</Link>
        </div>
      </div>
    </footer>
  );
}
