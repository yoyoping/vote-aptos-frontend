import React from 'react';
import {
  WalletProvider,
  // HippoWalletAdapter,
  AptosWalletAdapter,
  HippoExtensionWalletAdapter,
  MartianWalletAdapter,
  FewchaWalletAdapter,
  PontemWalletAdapter,
  SpikaWalletAdapter,
  RiseWalletAdapter,
  TokenPocketWalletAdapter,
  ONTOWalletAdapter,
  SafePalWalletAdapter,
  FoxWalletAdapter,
  CloverWalletAdapter,
  SpacecyWalletAdapter
} from '@manahippo/aptos-wallet-adapter';
import Home from './pages/Home'
import { Provider } from './context'
import NavBar from './components/NavBar'

const wallets = [
  // new HippoWalletAdapter(),
  new MartianWalletAdapter(),
  new AptosWalletAdapter(),
  new FewchaWalletAdapter(),
  new HippoExtensionWalletAdapter(),
  new PontemWalletAdapter(),
  new SpikaWalletAdapter(),
  new RiseWalletAdapter(),
  new TokenPocketWalletAdapter(),
  new ONTOWalletAdapter(),
  new SafePalWalletAdapter(),
  new FoxWalletAdapter(),
  new CloverWalletAdapter(),
  new SpacecyWalletAdapter()
];

const App: React.FC = () => {
  return (
    <WalletProvider
      wallets={wallets}
      autoConnect={true} /** allow auto wallet connection or not **/
      onError={(error: Error) => {
        console.log('Handle Error Message', error);
      }}>
        <Provider>
          <div className="px-8">
            <NavBar />
            <Home />
          </div>
        </Provider>
    </WalletProvider>
  );
};

export default App;
