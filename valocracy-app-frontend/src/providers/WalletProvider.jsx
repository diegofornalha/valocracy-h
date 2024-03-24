import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

//context
import WalletContext from "../contexts/WalletContext";
import metamaskApi from "../api/metamask";
import { useAuth } from "../hooks/useAuth";

export const WalletProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [walletAccount, setWalletAccount] = useState("");
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const __validateAndSetWallet = async (accounts) => {
    const walletInfo = await metamaskApi.walletRegistryInfo(accounts[0]);

    if (
      (!walletInfo.is_owner && !walletInfo.wallet_exist) ||
      walletInfo.is_owner
    ) {
      const connectedAcc = _setAccounts(accounts);
      const userWalletExist = Boolean(user?.id) && Boolean(user?.metamask);

      if (!userWalletExist && connectedAcc.length > 0)
        await metamaskApi.create(connectedAcc);
    } else {
      _setAccounts([]);
      throw "Wallet already cadastred in another account";
    }
  };

  useEffect(() => {
    if (isAuthenticated) connect();

    if (window.ethereum) {
      setIsMetaMaskInstalled(true);

      // Handle account changes
      window.ethereum.on("accountsChanged", async (accounts) => {
        console.log("trocou de carteira");
        __validateAndSetWallet(accounts);
      });
    }
  }, [isAuthenticated]);

  const _setAccounts = (accounts) => {
    if (accounts.length > 0) {
      setAccounts(accounts);
      setWalletAccount(accounts[0]);
      setIsConnected(true);

      return accounts[0];
    } else {
      setAccounts([]);
      setWalletAccount("");
      setIsConnected(false);

      return "";
    }
  };

  const addSpoliaNetwork = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0x8274f", // Substitua '0x...' pelo chainId da rede Spolia em formato hexadecimal
            chainName: "Scroll Sepolia", // Nome da rede
            nativeCurrency: {
              name: "Ethereum", // Nome da moeda nativa da rede Spolia
              symbol: "ETH", // Símbolo da moeda nativa, geralmente 2-5 caracteres
              decimals: 18, // Número de casas decimais da moeda nativa, geralmente 18
            },
            rpcUrls: ["https://sepolia-rpc.scroll.io/"], // Substitua pela URL RPC da rede Spolia
            blockExplorerUrls: ["https://sepolia.scrollscan.com/"], // Substitua pela URL do explorador de blocos da Spolia (se disponível)
          },
        ],
      });
    } catch (error) {
      console.error("Erro ao adicionar a rede Spolia:", error);
    }
  };

  /**
   * CHECA A REDE CONECTADA DA METAMASK
   */
  const checkNetwork = async () => {
    const currentChainId = await window.ethereum.request({
      method: "eth_chainId",
    });
    console.log("NETWORK ==>", { currentChainId });

    if (currentChainId !== "0x8274f") {
      addSpoliaNetwork();
      throw "Conectar na rede de teste Sepolia na Scroll!";
    }
  };

  // Function to connect to MetaMask
  const connect = async () => {
    if (window.ethereum) {
      try {
        await checkNetwork();
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        console.log({ accounts });
        await __validateAndSetWallet(accounts);
      } catch (err) {
        toast.error(err);
        console.error("Error connecting to MetaMask:", err);
        return "";
      }
    }
    return "";
  };

  return (
    <WalletContext.Provider
      value={{
        accounts,
        connect,
        isMetaMaskInstalled,
        isConnected,
        walletAccount,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
