import { useWallet, Wallet } from "@manahippo/aptos-wallet-adapter";
import { useStore } from '../context'

export function WalletModal() {
  const { wallets, connect, account, disconnect } = useWallet();
  const newWallets = wallets.filter((item: any) => item.readyState === 'Installed')
  const [store, dispatch] = useStore();

  async function connectWallet(wallet: Wallet) {
    connect(wallet.adapter.name);
    dispatch({ type: 'SET_MODALSTATE', modalState: false })
  }

  function disconnectWallet() {
    disconnect();
    dispatch({ type: 'SET_MODALSTATE', modalState: false })
  }

  function modalBox(content: JSX.Element) {
    return (
      <>
        <label
          htmlFor="wallet-modal"
          className={
            store.modalState
              ? "modal modal-open cursor-point"
              : "modal cursor-pointer"
          }
        >
          <div className="modal-box">
            <label
              className="btn btn-sm btn-circle absolute right-2 top-2"
              onClick={() =>
                dispatch({ type: 'SET_MODALSTATE', modalState: false })
              }
            >
              ✕
            </label>
            <div className="mt-6  flex flex-col">{content}</div>
          </div>
        </label>
      </>
    );
  }

  return account?.address
    ? modalBox(
        <>
          <p
            style={{
              textOverflow: "ellipsis",
              overflow: "hidden",
              display: "inline",
            }}
          >
            Account: {account!.address!.toString()}
          </p>
          <button className="btn mt-5" onClick={disconnectWallet}>
            Disconnect
          </button>
        </>
      )
    : modalBox(
        <>
          {newWallets.map((wallet: Wallet, i) => {
            return (
              <button
                key={i}
                className={
                  i == newWallets.length - 1 ? "btn gap-2" : "btn gap-2 mb-5"
                }
                onClick={() => connectWallet(wallet)}
              >
                <img width={25} height={25} src={wallet.adapter.icon} />
                {wallet.adapter.name}
              </button>
            );
          })}
        </>
      );
}
