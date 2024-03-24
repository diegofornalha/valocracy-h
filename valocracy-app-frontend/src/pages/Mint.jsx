import { useContext, useEffect, useState } from "react";
import {
  Divider,
  Select,
  Heading,
  Stack,
  Input,
  Button,
} from "@chakra-ui/react";
import { toast } from "react-hot-toast";
import effortApi from "../api/effort";
import effortNatureApi from "../api/effort_nature";
import effortRarityApi from "../api/effort_rarity";
import userApi from "../api/user";
import ipfsApi from "../api/ipfs";
import NFTCardPartEnum from "../enum/NFTCardPartEnum";
import ImageIconSvg from "../assets/image-icon.svg";
import ValocracyContext from "../contexts/ValocracyContext";
import { useLoading } from "../hooks/useLoading";
import { useWallet } from "../hooks/useWallet";

const Mint = () => {
  const [natures, setNatures] = useState([]);
  const [rarities, setRarities] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedNFTParts, setSelectedNFTParts] = useState({
    [NFTCardPartEnum.NATURE]: null,
    [NFTCardPartEnum.RARITY]: null,
  });
  const [nftStaticData, setNftStaticData] = useState({
    [NFTCardPartEnum.BACKGROUND]: null,
    [NFTCardPartEnum.TEXT]: "",
    [NFTCardPartEnum.TITLE]: "",
    [NFTCardPartEnum.USER_ACCOUNT_ID]: 0,
  });
  const [nftImageResult, setNftImageResult] = useState(ImageIconSvg);
  const { showBackdrop, hideBackdrop } = useLoading();
  const { contractValocracyNFT } = useContext(ValocracyContext);
  const { walletAccount } = useWallet();
  // const [canMint, setCanMint] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const natures = await effortNatureApi.fetchAll();
        setNatures(natures);

        const rarities = await effortRarityApi.fetchAll();
        setRarities(rarities);

        const users = await userApi.fetchAll();
        setUsers(users);
      } catch (err) {
        toast.error(err);
      }
    })();
  }, []);

  const getSelectedOptions = (selectedNFTPartId, part) => {
    switch (part) {
      case NFTCardPartEnum.NATURE:
        return natures.find((n) => n.id === Number(selectedNFTPartId));
      case NFTCardPartEnum.RARITY:
        return rarities.find((r) => r.id === Number(selectedNFTPartId));
      default:
        return null;
    }
  };

  const onChangeCardPart = (e, part) => {
    const selectedValue = e.target.value;
    const selectedPart = getSelectedOptions(selectedValue, part);

    setSelectedNFTParts({
      ...selectedNFTParts,
      [part]: selectedPart,
    });
  };

  const onChangStaticData = (e, part) => {
    const selectedValue = e.target.value;

    setNftStaticData({
      ...nftStaticData,
      [part]: selectedValue,
    });
  };

  const onChangBackground = async (e) => {
    const selectedFiles = e.target.files;
    const base64 = await new Promise((resolve, reject) => {
      const getBase64 = async (file) => {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
          resolve(reader.result);
          console.log(reader.result);
        };
        reader.onerror = function (error) {
          reject(error);
        };
      };

      if (selectedFiles.length === 0) return "";
      getBase64(selectedFiles[0]);
    });
    console.log("base64", base64);

    setNftStaticData({
      ...nftStaticData,
      [NFTCardPartEnum.BACKGROUND]: base64.replace(
        /^data:image\/\w+;base64,/,
        ""
      ),
    });
  };

  const _mint = async (mintData) => {
    if (!mintData?.image_url) throw "Missing mint ipfs url";
    if (!mintData?.rarity) throw "Missing nft rarity";
    if (!mintData?.address_to_mint) throw "Missing address to mint";
    if (!mintData?.effort_id) throw "Missing effort id";

    const contract = contractValocracyNFT();

    try {
      const txn = await contract.mintNFT(
        mintData.image_url,
        mintData.rarity,
        mintData.address_to_mint
      );

      const HASH = txn.hash;

      /**
       * CONFERIR A TRANSAÇÃO NA REDE
       *
       * https://sepolia.etherscan.io/tx/${HASH}
       */
      console.log("HASH ===>", HASH);
      console.log(`https://sepolia.etherscan.io/tx/${HASH}`);

      await effortApi.update(
        { mint_transaction_hash: HASH },
        mintData.effort_id
      );
    } catch (err) {
      toast.error(err);
    }
  };

  const createEffort = async () => {
    console.log(walletAccount);
    showBackdrop();
    // if (
    //   !walletAccount ||
    //   walletAccount !== import.meta.env.VITE_VALOCRACY_WALLET
    // ) {
    // } else {
    try {
      // if (!selectedNFTParts[NFTCardPartEnum.NATURE]) throw "Select one nature";
      if (!selectedNFTParts[NFTCardPartEnum.RARITY]) throw "Select one Rarity";

      const effortData = {
        ...selectedNFTParts,
        ...nftStaticData,
        effort_nature_id: 1,
        effort_rarity_id: selectedNFTParts[NFTCardPartEnum.RARITY].id,
      };
      console.log("effortData", effortData);
      const result = await effortApi.create(effortData);
      console.log("Create effort result", result);
      await _mint(result);

      const nftData = await ipfsApi.fetchImages([result.image_url]);
      console.log(nftData);
      setNftImageResult(nftData[0].image);
    } catch (err) {
      setNftImageResult(ImageIconSvg);
      toast.error(err);
    } finally {
      hideBackdrop();
    }
    // }
  };

  return (
    <>
      <Stack
        width="full"
        px={{
          base: 10,
          md: 40,
        }}
        py={10}
        alignItems={{
          base: "center",
          md: "start",
        }}
        justifyContent={"center"}
      >
        <Heading fontSize={"4xl"} color={"#34D07C"}>
          Mint
        </Heading>
      </Stack>
      <Divider width="full" height={"2px"} bg={"#34D07C"} />
      <Stack
        sx={{
          margin: "24px 0",
        }}
        alignItems="center"
      >
        <Stack width="440px" spacing={4}>
          {/* <Stack alignItems="center">
            <Select
              placeholder="Select nature"
              onChange={(e) => onChangeCardPart(e, NFTCardPartEnum.NATURE)}
            >
              $
              {natures.map((nature, index) => (
                <option key={index} value={nature.id}>
                  {nature.name}
                </option>
              ))}
            </Select>
            <img
              width="110"
              height="154"
              src={
                selectedNFTParts[NFTCardPartEnum.NATURE]
                  ? selectedNFTParts[NFTCardPartEnum.NATURE].image_url
                  : ImageIconSvg
              }
            ></img>
          </Stack> */}
          <Stack alignItems="center">
            <Select
              width="440px"
              placeholder="Select rarity"
              onChange={(e) => onChangeCardPart(e, NFTCardPartEnum.RARITY)}
            >
              $
              {rarities.map((raritie, index) => (
                <option key={index} value={raritie.id}>
                  {raritie.name}
                </option>
              ))}
            </Select>
            <img
              width="110"
              height="154"
              src={
                selectedNFTParts[NFTCardPartEnum.RARITY]
                  ? selectedNFTParts[NFTCardPartEnum.RARITY].image_url
                  : ImageIconSvg
              }
            ></img>
          </Stack>
          <Input
            placeholder="Background"
            type="file"
            onChange={onChangBackground}
          />
          <Input
            placeholder="Texto"
            onChange={(e) => onChangStaticData(e, NFTCardPartEnum.TEXT)}
            value={nftStaticData[NFTCardPartEnum.TEXT]}
          />
          <Input
            placeholder="Titulo"
            onChange={(e) => onChangStaticData(e, NFTCardPartEnum.TITLE)}
            value={nftStaticData[NFTCardPartEnum.TITLE]}
          />
          <Select
            placeholder="Select user"
            onChange={(e) =>
              onChangStaticData(e, NFTCardPartEnum.USER_ACCOUNT_ID)
            }
          >
            $
            {users.map((user, index) => (
              <option key={index} value={user.id}>
                {user.username}
              </option>
            ))}
          </Select>
          <Button
            colorScheme="teal"
            size="lg"
            type="button"
            onClick={createEffort}
          >
            MINT
          </Button>
          <img src={nftImageResult} />
        </Stack>
      </Stack>
    </>
  );
};

export default Mint;
