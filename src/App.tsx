/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { AmbientParticles } from './components/AmbientParticles';
import { ConnectingDialog } from './components/ConnectingDialog';
import { DashboardScreen } from './components/DashboardScreen';
import { LoginScreen } from './components/LoginScreen';
import { SplashScreen } from './components/SplashScreen';
import { type Platform } from './utils/simulation';

type AppStage = 'splash' | 'login' | 'platform' | 'dashboard';

export default function App() {
  const [stage, setStage] = useState<AppStage>('splash');
  const [playerId, setPlayerId] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('1xBet');

  return (
    <main className="app-universe">
      <AmbientParticles />

      {stage === 'splash' && <SplashScreen onDone={() => setStage('login')} />}

      {(stage === 'login' || stage === 'platform') && (
        <LoginScreen
          selectedPlatform={selectedPlatform}
          onSelectPlatform={setSelectedPlatform}
          onSubmit={(id, platform) => {
            setPlayerId(id);
            setSelectedPlatform(platform);
            setStage('platform');
          }}
        />
      )}

      {stage === 'platform' && <ConnectingDialog onDone={() => setStage('dashboard')} />}

      {stage === 'dashboard' && (
        <DashboardScreen
          playerId={playerId}
          platform={selectedPlatform}
          onLogout={() => {
            setPlayerId('');
            setStage('login');
          }}
        />
      )}
    </main>
  );
}
