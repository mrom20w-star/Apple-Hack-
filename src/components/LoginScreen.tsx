import { type FormEvent, useState } from 'react';
import {
  ArrowLeft,
  ArrowUpLeft,
  Fingerprint,
  Info,
  LoaderCircle,
  LockKeyhole,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import { type Platform, PLATFORMS, PROMO_CODE } from '../utils/simulation';
import { playSound } from '../utils/sound';
import { LogoOrbit } from './LogoOrbit';
import { FadePresence, ModalDialog, TermsDialog } from './SharedUI';

interface LoginScreenProps {
  selectedPlatform: Platform;
  onSelectPlatform: (platform: Platform) => void;
  onSubmit: (playerId: string, platform: Platform) => void;
}

export function LoginScreen({ selectedPlatform, onSelectPlatform, onSubmit }: LoginScreenProps) {
  const [showTerms, setShowTerms] = useState(true);
  const [playerId, setPlayerId] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [authenticating, setAuthenticating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showInvalidCode, setShowInvalidCode] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (authenticating || showInvalidCode) return;

    const isValidId = /^\d{10}$/.test(playerId);
    if (!isValidId) {
      playSound('error');
      setErrorMsg('معرف اللاعب يجب أن يكون مكوناً من 10 أرقام');
      return;
    }

    playSound('scan');
    setErrorMsg(null);
    setAuthenticating(true);

    const isValidPassword = accessCode.trim().toUpperCase() === PROMO_CODE;

    if (isValidPassword) {
      try {
        window.localStorage.setItem('guardiola_player_id', playerId);
        window.localStorage.setItem('apple_hack_platform', selectedPlatform);
      } catch {
        // Ignore storage errors
      }
      setTimeout(() => {
        setAuthenticating(false);
        playSound('success');
        onSubmit(playerId, selectedPlatform);
      }, 1800);
      return;
    }

    setTimeout(() => {
      setAuthenticating(false);
      playSound('error');
      setShowInvalidCode(true);
      setAccessCode('');
    }, 1400);
  };

  return (
    <section className="login-screen page-enter">
      <header className="access-top">
        <span className="micro-label">APPLE HACK / ACCESS</span>
        <button
          type="button"
          className="icon-button"
          title="شروط التفعيل"
          aria-label="شروط التفعيل"
          onClick={() => {
            playSound('tap');
            setShowTerms(true);
          }}
        >
          <Info size={18} />
        </button>
      </header>

      <div className="access-brand">
        <LogoOrbit />
        <div className="brand-inline" dir="ltr">
          APPLE HACK <span>V17</span>
        </div>
      </div>

      <div className="access-heading">
        <span className="section-kicker">
          <span />
          APPLE HACK SERVER
        </span>
        <h1>
          تجربتك تبدأ من هنا<span className="heading-dot">.</span>
        </h1>
        <p>اختر المنصة وأدخل معرف اللاعب ورمز الوصول ({PROMO_CODE})</p>
      </div>

      <form className="access-form" onSubmit={handleSubmit}>
        <div className="access-field">
          <label>
            <span>المنصة</span>
            <span dir="ltr">{selectedPlatform}</span>
          </label>
          <div className="platform-selector" role="group" aria-label="اختيار المنصة" dir="ltr">
            {PLATFORMS.map((platform) => {
              const active = selectedPlatform === platform;
              return (
                <button
                  key={platform}
                  type="button"
                  className={`platform-option ${active ? 'is-selected' : ''}`}
                  aria-pressed={active}
                  onClick={() => {
                    playSound('tap');
                    onSelectPlatform(platform);
                  }}
                >
                  {platform}
                </button>
              );
            })}
          </div>
        </div>

        <div className="access-field">
          <label htmlFor="id-input">
            <span>معرف اللاعب</span>
            <span dir="ltr">{playerId.length}/10</span>
          </label>
          <div className="field-shell">
            <input
              id="id-input"
              type="text"
              inputMode="numeric"
              pattern="[0-9]{10}"
              maxLength={10}
              autoComplete="off"
              value={playerId}
              onChange={(e) => {
                setPlayerId(e.target.value.replace(/\D/g, '').slice(0, 10));
                if (errorMsg) setErrorMsg(null);
              }}
              placeholder="أدخل الـ ID (10 أرقام)"
            />
            <UserRound size={18} />
            <span className="field-corner" />
          </div>
        </div>

        <div className="access-field">
          <label htmlFor="pw-input">
            <span>رمز الوصول (البروموكود)</span>
            <LockKeyhole size={12} />
          </label>
          <div className="field-shell">
            <input
              id="pw-input"
              type="password"
              autoComplete="off"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              placeholder="أدخل رمز الوصول"
            />
            <Fingerprint size={18} />
            <span className="field-corner" />
          </div>
        </div>

        <FadePresence show={!!errorMsg}>
          {errorMsg && (
            <p className="access-error" role="alert">
              {errorMsg}
            </p>
          )}
        </FadePresence>

        <button type="submit" className="gradient-button access-submit" disabled={authenticating}>
          {authenticating ? (
            <>
              <span>جاري المصادقة...</span>
              <LoaderCircle size={18} className="spinner" />
            </>
          ) : (
            <>
              <span>تفعيل الوصول</span>
              <ArrowUpLeft size={18} />
            </>
          )}
        </button>

        <div className="security-note">
          <ShieldCheck size={15} />
          <span>سيرفر Apple Hack · كلمة المرور هي البروموكود {PROMO_CODE}</span>
        </div>
      </form>

      <footer className="page-footer">
        <span>APPLE HACK SERVER</span>
        <span>ELECTRIC CYAN · V17</span>
      </footer>

      <FadePresence show={showTerms}>
        <TermsDialog onContinue={() => setShowTerms(false)} continueLabel="ابدأ التجربة" />
      </FadePresence>

      <FadePresence show={showInvalidCode}>
        <ModalDialog label="رمز الوصول غير صحيح" onClose={() => setShowInvalidCode(false)}>
          <div className="connection-icon">
            <LockKeyhole />
          </div>
          <h2 className="connection-title">رمز الوصول غير صحيح</h2>
          <p className="dialog-description">
            تأكد من إدخال رمز الوصول الصحيح ({PROMO_CODE}) الخاص بسيرفر Apple Hack.
          </p>
          <button
            type="button"
            className="gradient-button dialog-action"
            onClick={() => {
              playSound('tap');
              setShowInvalidCode(false);
            }}
          >
            <span>إعادة المحاولة</span>
            <ArrowLeft size={16} />
          </button>
        </ModalDialog>
      </FadePresence>
    </section>
  );
}
