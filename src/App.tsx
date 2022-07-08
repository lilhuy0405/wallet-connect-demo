import WalletConnectProvider from "@walletconnect/web3-provider";
import {providers} from "ethers";
import {useState} from "react";

function App() {
  const [account, setAccount] = useState<string>("");
  const [library, setLibrary] = useState<providers.Web3Provider>();
  const [sig, setSignal] = useState<string>("");
//  Create WalletConnect Provider
  const provider = new WalletConnectProvider({
    infuraId: "14b979bc481c4c71bc2116ac116e2675",
    rpc: {
      97: "https://data-seed-prebsc-1-s1.binance.org:8545/"
    }
  });
  const handleConnect = async () => {
    //  Enable session (triggers QR Code modal)
    const accounts = await provider.enable();

    //  Wrap with Web3Provider from ethers.js
    const web3Provider = new providers.Web3Provider(provider);
    setLibrary(web3Provider);
    const signer = web3Provider.getSigner();
    const address = await signer.getAddress();
    setAccount(address);

    // Subscribe to accounts change
    provider.on("accountsChanged", (accounts: string[]) => {
      console.log("account changed", accounts);
    });

// Subscribe to chainId change
    provider.on("chainChanged", (chainId: number) => {
      console.log("chain changed", chainId);
    });

// Subscribe to session disconnection
    provider.on("disconnect", (code: number, reason: string) => {
      console.log(code, reason);
    });
  }

  const handleSignMessage = async () => {
    if (!library) {
      alert("Please connect first");
      return;
    }
    const signer = library.getSigner();
    const message = "Hello World";
    const signature = await signer.signMessage(message);
    setSignal(signature);
  }

  return (
    <div className="App">

      <button onClick={handleConnect}>
        connect wallet
      </button>
      <div>
        address: {account}
      </div>
      <button onClick={handleSignMessage}>
        sign message
      </button>
      <div>
        signature: {sig}
      </div>
    </div>
  )
}

export default App
