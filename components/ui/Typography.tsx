import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Helper to merge classes without conflicts
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Variant = 
  | 'display' | 'h1' | 'h2' | 'h3' | 'h4' 
  | 'lead' | 'body' | 'bodySmall' 
  | 'label' | 'caption' | 'code' | 'blockquote';

interface TypographyProps {
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

const variantStyles: Record<Variant, string> = {
  // Hero / Landing Page Headers
  display: "text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900",
  
  // Standard Headers
  h1: "text-4xl font-bold tracking-tight text-slate-900",
  h2: "text-3xl font-semibold tracking-tight text-slate-800 border-b pb-2",
  h3: "text-2xl font-semibold tracking-tight text-slate-800",
  h4: "text-xl font-medium text-slate-800",

  // Body & Paragraphs
  lead: "text-xl text-slate-600 leading-relaxed font-light",
  body: "text-base leading-7 text-slate-700",
  bodySmall: "text-sm leading-6 text-slate-600",

  // UI Elements
  label: "text-sm font-semibold uppercase tracking-wider text-slate-500",
  caption: "text-xs text-slate-400 italic",
  
  // Specialty Styles
  code: "relative rounded bg-slate-100 px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-slate-900",
  blockquote: "mt-6 border-l-4 border-slate-300 pl-6 italic text-slate-700",
};

const defaultTags: Record<Variant, React.ElementType> = {
  display: 'h1',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  lead: 'p',
  body: 'p',
  bodySmall: 'p',
  label: 'span',
  caption: 'span',
  code: 'code',
  blockquote: 'blockquote',
};

const Typography = ({ variant = 'body', children, className, as }: TypographyProps) => {
  const Component = as || defaultTags[variant];

  return (
    <Component className={cn(variantStyles[variant], className)}>
      {children}
    </Component>
  );
};

export default Typography;