import Link from 'next/link';
import { BookOpen, CheckCircle, Lock, PlayCircle } from 'lucide-react';

export function Sidebar() {
  return (
    <aside className="w-72 border-r border-border bg-surface-sidebar h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto hidden lg:block">
      <div className="p-6">
        <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4">Modules</h2>
        <nav className="space-y-6">
          {/* Example Module 1 */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-2 flex items-center justify-between">
              <span>F1: AI Demystified</span>
              <span className="text-xs font-normal text-success flex items-center gap-1"><CheckCircle size={12} /> 100%</span>
            </h3>
            <ul className="space-y-1">
              <li>
                <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-text-secondary hover:bg-surface-elevated hover:text-text-primary transition-colors">
                  <CheckCircle size={14} className="text-success" />
                  <span>The Executive Mental Model</span>
                </Link>
              </li>
              <li>
                <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-text-secondary hover:bg-surface-elevated hover:text-text-primary transition-colors">
                  <CheckCircle size={14} className="text-success" />
                  <span>Four Types of AI</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Example Module 2 */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-2 flex items-center justify-between">
              <span>F2: AI Risk & Governance</span>
              <span className="text-xs font-normal text-brand flex items-center gap-1"><PlayCircle size={12} /> In Progress</span>
            </h3>
            <ul className="space-y-1">
              <li>
                <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm bg-brand-50 text-brand font-medium border-l-2 border-brand">
                  <PlayCircle size={14} />
                  <span>Risk Register Template</span>
                </Link>
              </li>
              <li>
                <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-text-muted hover:bg-surface-elevated hover:text-text-primary transition-colors">
                  <div className="w-3.5 h-3.5 rounded-full border border-border" />
                  <span>Acceptable Use Policy</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Example Module 3 */}
          <div>
            <h3 className="text-sm font-semibold text-text-muted mb-2 flex items-center justify-between">
              <span>F3: The AI-Ready Org</span>
              <span className="text-xs font-normal text-text-muted flex items-center gap-1"><Lock size={12} /> Locked</span>
            </h3>
            <ul className="space-y-1">
              <li>
                <div className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-text-muted cursor-not-allowed">
                  <Lock size={14} />
                  <span>Readiness Assessment</span>
                </div>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
}
