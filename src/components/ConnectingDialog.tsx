import { useEffect, useState } from 'react';
import { LoaderCircle } from 'lucide-react';
import { ModalDialog, ProgressBar } from './SharedUI';

interface ConnectingDialogProps {
  onDone: () => void;
}

export function ConnectingDialog({ onDone }: ConnectingDialogProps) {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPct((prev) => Math.min(100, prev + 11));
    }, 150);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (pct < 100) return;
    const timeout = setTimeout(onDone, 360);
    return () => clearTimeout(timeout);
  }, [pct, onDone]);

  return (
    <ModalDialog label="Connecting to Apple Hack">
      <div className="connection-icon">
        <LoaderCircle className="spinner" />
      </div>
      <span className="micro-label">APPLE HACK SERVER</span>
      <h2 className="connection-title" dir="ltr">
        Connecting to Apple Hack...
      </h2>
      <p className="dialog-description">جاري الاتصال بسيرفر Apple Hack، الرجاء الانتظار</p>
      <ProgressBar pct={pct} />
    </ModalDialog>
  );
}
