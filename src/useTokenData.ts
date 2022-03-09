import { isAddress } from "@ethersproject/address";
import { ChainId } from "@sushiswap/core-sdk";
import { useMemo } from "react";
import useSWR from "swr";

export interface TokenData {
  isValid?: boolean;
  symbol?: string;
  name?: string;
  decimals?: number;
}

export default function useTokenData(address: string, chainId: ChainId) {
  const { data, isValidating } = useSWR(
    address && chainId && isAddress(address)
      ? ["tokenData", address, chainId]
      : null,
    () =>
      fetch(
        `/api/tokenData?&address=${address}&chainId=${chainId.toString()}`
      ).then((data) => data.json())
  );

  return useMemo(
    () => ({ data: data as TokenData, isValidating }),
    [data, isValidating]
  );
}
