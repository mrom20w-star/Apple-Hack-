import { useEffect, useState } from 'react';
import {
  Apple,
  ArrowLeft,
  ChevronLeft,
  Info,
  LogOut,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  UserRound,
  Volume2,
  VolumeX,
  Zap,
} from 'lucide-react';
import { appleBittenImg, appleWholeImg, woodTileImg } from '../assets/assets';
import { generateSimulationMatrix, MULTIPLIERS, type Platform } from '../utils/simulation';
import { isMuted, playSound, setMuted } from '../utils/sound';
import { LogoOrbit } from './LogoOrbit';
import { FadePresence, ModalDialog, ProgressBar, StatusInline, TermsDialog } from './SharedUI';

function SimulationOverlay({ label }: { label: string }) {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPct((prev) => Math.min(100, prev + Math.random() * 14 + 6));
    }, 190);
    return () => clearInterval(interval);
  }, []);

  return (
    <ModalDialog label={label}>
      <div className="connection-icon">
        <Sparkles className="breathing" />
      </div>
      <span className="micro-label">APPLE HACK ENGINE</span>
      <h2 className="connection-title">{label}</h2>
      <p className="dialog-description">نتائج محاكاة، وليست نتائج مضمونة</p>
      <ProgressBar pct={pct} />
    </ModalDialog>
  );
}

interface TileImageProps {
  src: string;
  alt: string;
  delayMs: number;
  state: 'wood' | 'whole' | 'bitten';
}

function TileImage({ src, alt, delayMs, state }: TileImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`w-full h-full rounded-[7px] flex items-center justify-center ${
          state === 'whole'
            ? 'bg-emerald-950/80 text-emerald-400'
            : state === 'bitten'
              ? 'bg-rose-950/70 text-rose-400'
              : 'bg-slate-800/80 text-slate-400'
        }`}
        aria-label={alt}
      >
        <Apple size={18} />
      </div>
    );
  }

  return (
    <img
      className="board-image"
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      style={{ animationDelay: `${delayMs}ms` }}
      onError={() => setFailed(true)}
    />
  );
}

interface DashboardScreenProps {
  playerId: string;
  platform: Platform;
  onLogout: () => void;
}

export function DashboardScreen({ playerId, platform, onLogout }: DashboardScreenProps) {
  const [safeCells, setSafeCells] = useState<Set<number>>(new Set());
  const [revealed, setRevealed] = useState(false);
  const [busyLabel, setBusyLabel] = useState<string | null>(null);
  const [muted, setMutedState] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  useEffect(() => {
    setMutedState(isMuted());
  }, []);

  const runWithOverlay = (label: string, callback: () => void) => {
    setBusyLabel(label);
    setTimeout(() => {
      setBusyLabel(null);
      callback();
    }, 2000);
  };

  const handlePredict = () => {
    playSound('scan');
    runWithOverlay('جاري تحليل البيانات...', () => {
      const nextMatrix = generateSimulationMatrix(10, 5);
      setSafeCells(nextMatrix);
      setRevealed(true);
      playSound('reveal');
    });
  };

  const handleReset = () => {
    playSound('tap');
    runWithOverlay('إعادة التهيئة...', () => {
      setSafeCells(new Set());
      setRevealed(false);
    });
  };

  const handleToggleSound = () => {
    const nextMuted = !muted;
    setMuted(nextMuted);
    setMutedState(nextMuted);
    if (!nextMuted) {
      playSound('tap');
    }
  };

  return (
    <section className="dashboard-screen page-enter">
      <header className="dashboard-header">
        <div className="dashboard-brand">
          <LogoOrbit compact />
          <div dir="ltr">
            <strong>
              APPLE<span>HACK</span>
            </strong>
            <span className="micro-label">SERVER EDITION · V17</span>
          </div>
        </div>

        <div className="header-actions">
          <button
            type="button"
            className="icon-button"
            aria-label="الصوت"
            title="الصوت"
            onClick={handleToggleSound}
          >
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <button
            type="button"
            className="icon-button"
            aria-label="تسجيل الخروج"
            title="تسجيل الخروج"
            onClick={() => {
              playSound('tap');
              onLogout();
            }}
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <div className="dashboard-heading">
        <div>
          <span className="section-kicker">
            <span />
            APPLE OF FORTUNE
          </span>
          <h1>محرك المحاكاة</h1>
        </div>
        <button
          type="button"
          className="icon-button border border-[var(--border)]"
          title="شروط التفعيل"
          aria-label="شروط التفعيل"
          onClick={() => {
            playSound('tap');
            setShowTerms(true);
          }}
        >
          <Info size={18} />
        </button>
      </div>

      <div className="player-strip">
        <div className="player-avatar">
          <UserRound />
        </div>
        <div className="player-identity">
          <span>معرف اللاعب</span>
          <strong dir="ltr">{playerId || '—'}</strong>
        </div>
        <div className="platform-identity">
          <span>PLATFORM</span>
          <strong dir="ltr">
            {platform.toUpperCase()} <ChevronLeft size={12} />
          </strong>
        </div>
      </div>

      <div className="engine-status">
        <StatusInline>{revealed ? 'SIMULATION COMPLETE' : 'APPLE HACK READY'}</StatusInline>
        <span className="micro-label">5 × 6 MATRIX</span>
      </div>

      <div className="board-wrap">
        <div className="board-topline">
          <span>APPLE HACK MATRIX</span>
          <span>V17 / {revealed ? 'RESULT' : 'STANDBY'}</span>
        </div>

        <div className="prediction-panel">
          {Array.from({ length: 6 }, (_, visualIdx) => {
            const rowIndex = visualIdx + 4;
            return (
              <div key={rowIndex} className="board-row">
                <div className="multiplier">{MULTIPLIERS[rowIndex]}</div>
                <div className="apple-grid">
                  {Array.from({ length: 5 }, (_, colIdx) => {
                    const cellId = rowIndex * 5 + colIdx;
                    const isWhole = revealed && safeCells.has(cellId);
                    const isBitten = revealed && !safeCells.has(cellId);
                    const tileState = isWhole ? 'whole' : isBitten ? 'bitten' : 'wood';

                    return (
                      <div key={cellId} className={`apple-cell ${isWhole ? 'is-active' : ''}`}>
                        <TileImage
                          key={revealed ? `result-${cellId}` : `wood-${cellId}`}
                          src={isWhole ? appleWholeImg : isBitten ? appleBittenImg : woodTileImg}
                          alt={
                            isWhole
                              ? 'تفاحة كاملة — محاكاة'
                              : isBitten
                                ? 'تفاحة مأكولة — محاكاة'
                                : 'خانة غير مكشوفة'
                          }
                          delayMs={visualIdx * 35 + colIdx * 15}
                          state={tileState}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="board-bottomline">
          <span className="status-dot" />
          <span>{revealed ? 'تم عرض نتائج المحاكاة' : 'بانتظار بدء المحاكاة'}</span>
          <span className="matrix-index">APPLE HACK</span>
        </div>
      </div>

      <div className="result-legend">
        <span>
          <span className="legend-mark active" />
          تفاحة كاملة
        </span>
        <span>
          <span className="legend-mark" />
          تفاحة مأكولة
        </span>
        <span className="simulation-tag">محاكاة عشوائية</span>
      </div>

      <div className="prediction-actions">
        <button
          type="button"
          className="gradient-button predict-button"
          onClick={handlePredict}
          disabled={!!busyLabel}
        >
          <Zap size={16} />
          <span>تشغيل خوارزمية التوقع</span>
          <ArrowLeft size={16} />
        </button>
        <button
          type="button"
          className="refresh-button"
          title="إعادة التهيئة"
          aria-label="إعادة التهيئة"
          onClick={handleReset}
          disabled={!!busyLabel}
        >
          <RefreshCw size={18} />
        </button>
      </div>

      <p className="simulation-disclaimer">
        <ShieldCheck size={12} />
        <span>Apple Hack · نتائج محاكاة معلوماتية، وليست مضمونة · V17</span>
      </p>

      <FadePresence show={!!busyLabel}>
        {busyLabel && <SimulationOverlay label={busyLabel} />}
      </FadePresence>

      <FadePresence show={showTerms}>
        <TermsDialog onContinue={() => setShowTerms(false)} continueLabel="إغلاق" />
      </FadePresence>
    </section>
  );
}
