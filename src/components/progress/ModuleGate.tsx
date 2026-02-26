import { Lock } from 'lucide-react';

interface ModuleGateProps {
  isLocked: boolean;
  previousModuleTitle?: string;
  children: React.ReactNode;
}

export function ModuleGate({ isLocked, previousModuleTitle, children }: ModuleGateProps) {
  if (!isLocked) {
    return <>{children}</>;
  }

  return (
    <div className="relative rounded-2xl overflow-hidden border border-border bg-surface-card">
      <div className="absolute inset-0 bg-surface-elevated/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-surface-card border border-border flex items-center justify-center text-text-muted mb-4 shadow-sm">
          <Lock size={32} />
        </div>
        <h3 className="text-xl font-bold text-text-primary mb-2">Module Locked</h3>
        <p className="text-text-secondary max-w-md">
          This course must be completed in order. 
          {previousModuleTitle ? (
            <> Please complete <strong>{previousModuleTitle}</strong> to unlock this module.</>
          ) : (
            ' Please complete the previous module to unlock.'
          )}
        </p>
      </div>
      <div className="opacity-30 pointer-events-none filter blur-[2px]">
        {children}
      </div>
    </div>
  );
}
