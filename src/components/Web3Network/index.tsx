import { NETWORK_ICON, NETWORK_LABEL } from "app/config/networks";
import { useNetworkModalToggle } from "app/state/application/hooks";
import Image from "next/image";
import React, { FC } from "react";
import Typography from "app/components/Typography";
import { ChainId } from "@sushiswap/core-sdk";

interface Web3Network {
  chainId: ChainId;
}

const Web3Network: FC<Web3Network> = ({ chainId }) => {
  const toggleNetworkModal = useNetworkModalToggle();

  return (
    <div
      className="inline-flex items-center gap-2 h-[42px] border border-transparent hover:border-dark-700 bg-dark-800 rounded px-3 cursor-pointer"
      onClick={() => toggleNetworkModal()}
    >
      <div className="grid items-center grid-flow-col justify-center bg-dark-1000 text-sm rounded pointer-events-auto auto-cols-max text-secondary">
        {/*@ts-ignore TYPE NEEDS FIXING*/}
        <Image
          src={NETWORK_ICON[chainId]}
          alt="Switch Network"
          className="rounded-md"
          width="22px"
          height="22px"
        />
      </div>
      <Typography variant="sm" weight={700}>
        {NETWORK_LABEL[chainId]}
      </Typography>
    </div>
  );
};

export default Web3Network;
