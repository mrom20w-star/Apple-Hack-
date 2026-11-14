import { type ReactNode, useEffect, useState } from 'react';
import { AlertTriangle, ArrowLeft, Check, Copy, X } from 'lucide-react';
import { PROMO_CODE } from '../utils/simulation';
import { playSound } from '../utils/sound';

interface FadePresenceProps {
  show: boolean;
  children: ReactNode;
  className?: string;
}

export function FadePresence({ show, children, className = '' }: FadePresenceProps) {
  const [mounted, setMounted] = useState(show);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setMounted(true);
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    }

    setVisible(false);
    const timer = setTimeout(() => setMounted(false), 260);
    return () => clearTimeout(timer);
  }, [show]);

  if (!mounted) return null;

  return <div className={`fade-presence ${visible ? 'is-visible' : ''} ${className}`}>{children}</div>;
}

export function StatusInline({ children }: { children: ReactNode }) {
  return (
    <span className="status-inline">
      <span className="status-dot" />
      {children}
    </span>
  );
}

export function ProgressBar({ pct }: { pct: number }) {
  const clamped = Math.max(0, Math.min(100, Math.floor(pct)));

  return (
    <div className="progress-block">
      <div
        className="progress-track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={clamped}
      >
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="progress-meta">
        <span>APPLE HACK SERVER</span>
        <span>{clamped.toString().padStart(2, '0')}%</span>
      </div>
    </div>
  );
}

interface ModalDialogProps {
  children: ReactNode;
  label: string;
  onClose?: () => void;
}

export function ModalDialog({ children, label, onClose }: ModalDialogProps) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div className="dialog-backdrop">
      <section className="premium-dialog" role="dialog" aria-modal="true" aria-label={label}>
        {onClose && (
          <button
            type="button"
            className="dialog-close"
            aria-label="إغلاق"
            title="إغلاق"
            onClick={onClose}
          >
            <X size={16} />
          </button>
        )}
        {children}
      </section>
    </div>
  );
}

interface TermsDialogProps {
  onContinue: () => void;
  continueLabel?: string;
}

export function TermsDialog({ onContinue, continueLabel = 'فهمت، متابعة' }: TermsDialogProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(PROMO_CODE);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = PROMO_CODE;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
      } catch {
        // Ignore fallback copy failure
      }
      document.body.removeChild(textarea);
    }

    playSound('copy');
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  return (
    <ModalDialog label="شروط التفعيل" onClose={onContinue}>
      <div className="dialog-eyebrow">
        <span className="micro-label">APPLE HACK · BEFORE YOU BEGIN</span>
        <span className="edition">V17</span>
      </div>

      <div className="terms-heading">
        <div className="warning-symbol">
          <AlertTriangle size={20} />
        </div>
        <div>
          <h2>شروط التفعيل</h2>
          <p>المعلومات الخاصة بحسابك</p>
        </div>
      </div>

      <ol className="instruction-list">
        <li>
          <span className="step-number">01</span>
          <span>
            حساب جديد على <b dir="ltr">1xBet</b> أو <b dir="ltr">MELBET</b> أو{' '}
            <b dir="ltr">SpinBetter</b>
          </span>
          <Check className="step-check" />
        </li>
        <li>
          <span className="step-number">02</span>
          <span>أدخل البروموكود عند التسجيل (وهو نفسه رمز الوصول)</span>
          <Check className="step-check" />
        </li>
        <li>
          <span className="step-number">03</span>
          <span>
            إيداع <b dir="ltr">$10</b> أو <b>500 جنيه</b>
          </span>
          <Check className="step-check" />
        </li>
      </ol>

      <div className="promo-ticket">
        <div>
          <span className="micro-label">PROMO CODE &amp; ACCESS PASSWORD</span>
          <button
            type="button"
            className="promo-value"
            onClick={handleCopy}
            aria-label="نسخ البروموكود"
          >
            {PROMO_CODE}
          </button>
        </div>
        <button
          type="button"
          className="copy-button"
          title="نسخ البروموكود"
          aria-label="نسخ"
          onClick={handleCopy}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>

      <p className="copy-feedback" aria-live="polite">
        {copied ? `تم نسخ البروموكود ${PROMO_CODE}` : `كلمة المرور للدخول هي نفس البروموكود (${PROMO_CODE})`}
      </p>

      <button
        type="button"
        className="gradient-button dialog-action"
        onClick={() => {
          playSound('tap');
          onContinue();
        }}
      >
        <span>{continueLabel}</span>
        <ArrowLeft size={16} />
      </button>
    </ModalDialog>
  );
}
