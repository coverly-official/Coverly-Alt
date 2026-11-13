import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { cn } from '@/lib/utils';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  position?: 'right' | 'bottom';
  className?: string;
  width?: 'md' | 'lg' | 'xl';
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  position = 'right',
  className,
  width = 'lg',
}) => {
  const containerRef = useFocusTrap(isOpen, onClose);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const widthClasses = {
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
  }[width];

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'drawer-title' : undefined}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-canvas/80 backdrop-blur-md"
            aria-hidden="true"
          />

          {position === 'right' ? (
            <div className="fixed inset-y-0 right-0 flex pl-10 max-w-full">
              <motion.div
                ref={containerRef}
                tabIndex={-1}
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  'w-screen glass-strong border-l border-white/20 shadow-2xl flex flex-col',
                  widthClasses,
                  className
                )}
              >
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between shrink-0">
                  <div>
                    {title && (
                      <h3 id="drawer-title" className="text-lg font-bold text-white tracking-tight">
                        {title}
                      </h3>
                    )}
                    {description && (
                      <p className="text-xs text-ink-secondary mt-0.5">{description}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="p-2 rounded-xl text-ink-secondary hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                    aria-label="Close drawer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6">{children}</div>
              </motion.div>
            </div>
          ) : (
            // Bottom Sheet Drawer for mobile
            <div className="fixed inset-x-0 bottom-0 flex justify-center max-h-[85vh]">
              <motion.div
                ref={containerRef}
                tabIndex={-1}
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  'w-full glass-strong border-t border-white/20 rounded-t-card shadow-2xl flex flex-col overflow-hidden max-h-[85vh]',
                  className
                )}
              >
                <div className="w-12 h-1.5 bg-muted/60 rounded-full mx-auto mt-3 shrink-0" />
                <div className="p-4 border-b border-white/10 flex items-center justify-between shrink-0">
                  {title && (
                    <h3 id="drawer-title" className="text-base font-bold text-white">
                      {title}
                    </h3>
                  )}
                  <button
                    type="button"
                    onClick={onClose}
                    className="p-1.5 rounded-xl text-ink-secondary hover:text-white hover:bg-white/10"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-5">{children}</div>
              </motion.div>
            </div>
          )}
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
