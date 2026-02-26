import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-sm text-text-muted mb-6">
      <ol className="flex items-center space-x-2">
        <li>
          <Link href="/dashboard" className="hover:text-brand transition-colors flex items-center">
            <Home size={14} />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center space-x-2">
            <ChevronRight size={14} className="text-border" />
            {item.href ? (
              <Link href={item.href} className="hover:text-brand transition-colors font-medium">
                {item.label}
              </Link>
            ) : (
              <span className="text-text-primary font-semibold" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
