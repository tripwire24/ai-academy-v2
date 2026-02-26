import React from 'react';
import Image from 'next/image';
import { AlertCircle, Info, CheckCircle, FileText } from 'lucide-react';
import { VideoEmbed } from '@/components/content/VideoEmbed';

export const mdxComponents = {
  h1: (props: any) => <h1 className="text-4xl font-extrabold mt-12 mb-6 tracking-tight text-text-primary" {...props} />,
  h2: (props: any) => <h2 className="text-3xl font-bold mt-10 mb-5 tracking-tight text-text-primary border-b border-border pb-2" {...props} />,
  h3: (props: any) => <h3 className="text-2xl font-semibold mt-8 mb-4 tracking-tight text-text-primary" {...props} />,
  h4: (props: any) => <h4 className="text-xl font-medium mt-6 mb-3 tracking-tight text-text-primary" {...props} />,
  p: (props: any) => <p className="text-lg leading-relaxed text-text-secondary mb-6" {...props} />,
  ul: (props: any) => <ul className="list-disc list-inside text-lg leading-relaxed text-text-secondary mb-6 space-y-2" {...props} />,
  ol: (props: any) => <ol className="list-decimal list-inside text-lg leading-relaxed text-text-secondary mb-6 space-y-2" {...props} />,
  li: (props: any) => <li className="ml-4" {...props} />,
  a: (props: any) => <a className="text-brand hover:text-brand-secondary underline underline-offset-4 transition-colors" target="_blank" rel="noopener noreferrer" {...props} />,
  blockquote: (props: any) => (
    <blockquote className="border-l-4 border-brand pl-6 py-2 my-8 italic text-xl text-text-muted bg-surface-elevated rounded-r-xl" {...props} />
  ),
  code: (props: any) => {
    const isInline = !props.className;
    return isInline ? (
      <code className="bg-surface-elevated text-brand px-1.5 py-0.5 rounded-md font-mono text-sm border border-border" {...props} />
    ) : (
      <code className="block bg-surface-card text-text-primary p-4 rounded-xl font-mono text-sm overflow-x-auto border border-border shadow-sm my-6" {...props} />
    );
  },
  pre: (props: any) => <pre className="my-6" {...props} />,
  img: (props: any) => (
    <div className="my-8 relative rounded-2xl overflow-hidden border border-border shadow-sm">
      <Image
        src={props.src}
        alt={props.alt || 'Image'}
        width={800}
        height={450}
        className="w-full h-auto object-cover"
        referrerPolicy="no-referrer"
      />
      {props.alt && <p className="text-center text-sm text-text-muted mt-2 p-2 bg-surface-elevated">{props.alt}</p>}
    </div>
  ),
  hr: (props: any) => <hr className="my-12 border-border" {...props} />,

  // Custom Components
  Callout: ({ type = 'info', title, children }: { type?: 'info' | 'warning' | 'success', title?: string, children: React.ReactNode }) => {
    const types = {
      info: { bg: 'bg-info-light', border: 'border-info/20', text: 'text-info', icon: Info },
      warning: { bg: 'bg-warning-light', border: 'border-warning/20', text: 'text-warning', icon: AlertCircle },
      success: { bg: 'bg-success-light', border: 'border-success/20', text: 'text-success', icon: CheckCircle },
    };
    const style = types[type] || types.info;
    const Icon = style.icon;

    return (
      <div className={`my-8 p-6 rounded-2xl border ${style.bg} ${style.border} flex gap-4 shadow-sm`}>
        <div className={`flex-shrink-0 mt-1 ${style.text}`}>
          <Icon size={24} />
        </div>
        <div>
          {title && <h4 className={`font-bold mb-2 ${style.text}`}>{title}</h4>}
          <div className="text-text-secondary prose-p:mb-0">{children}</div>
        </div>
      </div>
    );
  },

  SlideCard: ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="my-10 border border-border rounded-2xl bg-surface-card shadow-card overflow-hidden">
      <div className="bg-surface-elevated px-6 py-4 border-b border-border flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-brand-50 text-brand flex items-center justify-center">
          <FileText size={16} />
        </div>
        <h4 className="font-bold text-text-primary m-0">{title}</h4>
      </div>
      <div className="p-8 text-lg text-text-secondary">
        {children}
      </div>
    </div>
  ),

  SpeakerNotes: ({ children }: { children: React.ReactNode }) => (
    <div className="my-8 p-6 rounded-2xl border border-dashed border-border bg-surface-elevated">
      <div className="flex items-center gap-2 mb-4 text-text-muted font-semibold uppercase tracking-wider text-xs">
        <Info size={16} />
        Speaker Notes (Trainer Only)
      </div>
      <div className="text-text-secondary italic">
        {children}
      </div>
    </div>
  ),

  Checklist: ({ items }: { items: string[] }) => (
    <div className="my-8 bg-surface-card border border-border rounded-2xl p-6 shadow-sm">
      <h4 className="font-bold text-text-primary mb-4 flex items-center gap-2">
        <CheckCircle size={20} className="text-success" />
        Action Items
      </h4>
      <ul className="space-y-3 m-0 list-none p-0">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-text-secondary">
            <div className="w-5 h-5 rounded border border-border mt-0.5 flex-shrink-0 bg-surface-elevated" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  ),

  VideoEmbed: ({ url, title }: { url: string, title?: string }) => (
    <VideoEmbed url={url} title={title} />
  ),
};
