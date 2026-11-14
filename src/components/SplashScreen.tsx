import { useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { LogoOrbit } from './LogoOrbit';
import { ProgressBar, StatusInline } from './SharedUI';

interface SplashScreenProps {
  onDone: () => void;
}

export function SplashScreen({ onDone }: SplashScreenProps) {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPct((prev) => Math.min(100, prev + 8));
    }, 140);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (pct < 100) return;
    const timeout = setTimeout(onDone, 360);
    return () => clearTimeout(timeout);
  }, [pct, onDone]);

  return (
    <section className={`splash-screen page-enter ${pct === 100 ? 'splash-complete' : ''}`}>
      <header className="splash-top">
        <span className="micro-label">APPLE HACK / SERVER</span>
        <span className="edition">V17</span>
      </header>

      <div className="splash-center">
        <div className="splash-emblem">
          <LogoOrbit />
        </div>
        <StatusInline>SERVER ONLINE</StatusInline>
        <h1 className="brand-title">
          APPLE
          <span>
            HACK <b>V17</b>
          </span>
        </h1>
        <p className="splash-subtitle">جاري تجهيز سيرفر Apple Hack</p>
        <ProgressBar pct={pct} />
      </div>

      <footer className="splash-footer">
        <ShieldCheck size={14} />
        <span>APPLE HACK · CONNECTED &amp; SECURED</span>
      </footer>
    </section>
  );
}
