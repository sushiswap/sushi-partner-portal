import { Block } from "@ethersproject/abstract-provider";
import { ChainId } from "@sushiswap/core-sdk";
import useDebounce from "app/hooks/useDebounce";
import useIsWindowVisible from "app/hooks/useIsWindowVisible";
import { useActiveWeb3React } from "app/services/web3";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import {
  updateBlockNumber,
  updateBlockTimestamp,
  updateChainId,
} from "./shared/actions";

export default function Updater(): null {
  const { library, chainId, account } = useActiveWeb3React();
  const dispatch = useDispatch();

  const windowVisible = useIsWindowVisible();

  const [state, setState] = useState<{
    chainId: number | undefined;
    blockNumber: number | null;
    blockTimestamp: number | null;
  }>({
    chainId,
    blockNumber: null,
    blockTimestamp: null,
  });

  const blockCallback = useCallback(
    (block: Block) => {
      setState((state) => {
        if (chainId === state.chainId) {
          if (
            typeof state.blockNumber !== "number" &&
            typeof state.blockTimestamp !== "number"
          )
            return {
              chainId,
              blockNumber: block.number,
              blockTimestamp: block.timestamp,
            };
          return {
            chainId,
            blockNumber: Math.max(block.number, state.blockNumber!),
            blockTimestamp: Math.max(block.timestamp, state.blockTimestamp!),
          };
        }
        return state;
      });
    },
    [chainId, setState]
  );

  const onBlock = useCallback(
    (number) => library?.getBlock(number).then(blockCallback),
    [blockCallback, library]
  );

  // attach/detach listeners
  useEffect(() => {
    if (!library || !chainId || !windowVisible) return undefined;

    setState({ chainId, blockNumber: null, blockTimestamp: null });

    library
      .getBlock("latest")
      .then(blockCallback)
      .catch((error) =>
        console.error(`Failed to get block for chainId: ${chainId}`, error)
      );

    library.on("block", onBlock);
    return () => {
      library.removeListener("block", onBlock);
    };
  }, [dispatch, chainId, library, windowVisible, blockCallback, onBlock]);

  const debouncedState = useDebounce(state, 100);

  useEffect(() => {
    if (
      !debouncedState.chainId ||
      !debouncedState.blockNumber ||
      !windowVisible
    )
      return;
    dispatch(
      updateBlockNumber({
        chainId: debouncedState.chainId,
        blockNumber: debouncedState.blockNumber,
      })
    );
  }, [
    windowVisible,
    dispatch,
    debouncedState.blockNumber,
    debouncedState.chainId,
  ]);

  useEffect(() => {
    if (
      !debouncedState.chainId ||
      !debouncedState.blockTimestamp ||
      !windowVisible
    )
      return;
    dispatch(
      updateBlockTimestamp({
        chainId: debouncedState.chainId,
        blockTimestamp: debouncedState.blockTimestamp,
      })
    );
  }, [
    windowVisible,
    dispatch,
    debouncedState.blockTimestamp,
    debouncedState.chainId,
  ]);

  useEffect(() => {
    dispatch(
      updateChainId({
        chainId:
          debouncedState.chainId in ChainId
            ? debouncedState.chainId ?? null
            : null,
      })
    );
  }, [dispatch, debouncedState.chainId]);

  // useEffect(() => {
  //   if (!account || !library?.provider?.request || !library?.provider?.isMetaMask) {
  //     return;
  //   }
  //   switchToNetwork({ library })
  //     .then((x) => x ?? dispatch(setImplements3085({ implements3085: true })))
  //     .catch(() => dispatch(setImplements3085({ implements3085: false })));
  // }, [account, chainId, dispatch, library]);

  return null;
}
