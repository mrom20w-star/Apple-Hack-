import { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { emblemImg } from '../assets/assets';

interface LogoOrbitProps {
  compact?: boolean;
}

export function LogoOrbit({ compact = false }: LogoOrbitProps) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div className={`logo-orbit ${compact ? 'logo-compact' : ''}`}>
      <span className="orbit-ring orbit-one" />
      <span className="orbit-ring orbit-two" />
      <div className="logo-core">
        {imgFailed ? (
          <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-[var(--primary)]">
            <ShieldCheck size={compact ? 18 : 42} />
          </div>
        ) : (
          <img
            src={emblemImg}
            alt="Apple Hack"
            referrerPolicy="no-referrer"
            onError={() => setImgFailed(true)}
          />
        )}
      </div>
      <span className="orbit-point" />
    </div>
  );
}
