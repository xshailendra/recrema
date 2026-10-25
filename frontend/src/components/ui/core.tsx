import * as React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
        const variants = {
            primary: 'bg-brand-yellow text-brand-green hover:bg-opacity-90',
            outline: 'border border-brand-green text-brand-green hover:bg-brand-green hover:text-white',
            ghost: 'text-brand-green hover:bg-brand-peach',
        };

        const sizes = {
            sm: 'px-4 py-1.5 text-sm',
            md: 'px-6 py-2.5 text-base',
            lg: 'px-8 py-3 text-lg',
        };

        return (
            <button
                ref={ref}
                className={cn(
                    'inline-flex items-center justify-center rounded-full font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            />
        );
    }
);
Button.displayName = 'Button';

export function Container({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={cn('mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', className)}>
            {children}
        </div>
    );
}

export function SectionTitle({
    title,
    subtitle,
    className,
}: {
    title: string;
    subtitle?: string;
    className?: string;
}) {
    return (
        <div className={cn('flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12', className)}>
            <h2 className="text-4xl ss:text-5xl xs:text-6xl md:text-8xl font-display uppercase leading-[0.8] text-brand-green">
                {title}
            </h2>
            {subtitle && (
                <p className="max-w-xs text-brand-green text-sm md:text-base opacity-90 leading-relaxed">
                    {subtitle}
                </p>
            )}
        </div>
    );
}
