import { ChainId } from "@sushiswap/core-sdk";
import { NETWORK_ICON, NETWORK_LABEL } from "app/config/networks";
import { SUPPORTED_NETWORKS } from "app/modals/NetworkModal";
import { useNetworkModalToggle } from "app/state/application/hooks";
import Image from "next/image";
import React from "react";

function Web3Network({ chainId }): JSX.Element | null {
  const toggleNetworkModal = useNetworkModalToggle();

  return (
    <div
      className="flex items-center pr-2 text-sm font-bold border-2 rounded cursor-pointer pointer-events-auto select-none border-dark-800 hover:border-dark-700 bg-dark-1000 hover:bg-dark-900 whitespace-nowrap"
      onClick={() => toggleNetworkModal()}
    >
      <div className="grid items-center grid-flow-col justify-center bg-dark-1000 h-[36px] w-[36px] text-sm rounded pointer-events-auto auto-cols-max text-secondary">
        {/*@ts-ignore TYPE NEEDS FIXING*/}
        <Image
          src={NETWORK_ICON[chainId]}
          alt="Switch Network"
          className="rounded-md"
          width="22px"
          height="22px"
        />
      </div>
      <div>{NETWORK_LABEL[chainId]}</div>
    </div>
  );
}

export default Web3Network;
