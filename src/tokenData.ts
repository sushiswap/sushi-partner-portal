import { isAddress } from "@ethersproject/address";
import { ethers } from "ethers";
import type { NextApiRequest, NextApiResponse } from "next";

import ERC20_ABI from "app/constants/abis/ERC20.json";
import { ChainId } from "@sushiswap/core-sdk";
import { SUPPORTED_NETWORKS } from "app/modals/NetworkModal";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const address = req.query.address as string;
  const chainId = req.query.chainId as unknown as ChainId;

  if (!address || !chainId || !isAddress(address)) {
    res.status(400).json({ isValid: false });
    return;
  }

  const provider = new ethers.providers.JsonRpcProvider(
    SUPPORTED_NETWORKS[chainId]?.rpcUrls[0]
  );
  const token = new ethers.Contract(address, ERC20_ABI, provider);

  try {
    const queries: Promise<any>[] = [
      token.functions.symbol().then((data) => ({ symbol: data?.[0] })),
      token.functions.name().then((data) => ({ name: data?.[0] })),
      token.functions.decimals().then((data) => ({ decimals: data?.[0] })),
    ];

    const data = (await Promise.all(queries)).reduce(
      (acc, e) => ({ ...acc, ...e }),
      {}
    );

    res.status(200).json({ isValid: true, address, ...data });
    return;
  } catch {
    res.status(500).json({ isValid: false });
  }
};

export default handler;
