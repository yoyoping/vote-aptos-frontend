import { useWallet } from "@manahippo/aptos-wallet-adapter";
import { WalletModal } from "./WalletModal";
import { useStore } from '../context'

export default function AptosConnect() {
  const { account } = useWallet();
  const [store, dispatch] = useStore();

  return (
    <>
      {account?.address ? (
        <button
          className="btn btn-primary w-48"
          onClick={() => dispatch({ type: 'SET_MODALSTATE', modalState: true })}
          style={{
            textOverflow: "ellipsis",
            overflow: "hidden",
            display: "inline",
          }}
        >
          {account!.address!.toString()!}
        </button>
      ) : (
        <button
          className="btn"
          onClick={() => dispatch({ type: 'SET_MODALSTATE', modalState: true })}
        >
          Connect wallet
        </button>
      )}
      <WalletModal />
    </>
  );
}
