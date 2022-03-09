import { ChainId } from "@sushiswap/core-sdk";
import Web3Network from "app/components/Web3Network";
import NetworkModal from "app/modals/NetworkModal";
import { useState } from "react";
import useTokenData from "app/hooks/useTokenData";
import { CheckIcon } from "@heroicons/react/solid";
import { RefreshIcon, XIcon } from "@heroicons/react/outline";
import TokenDetails from "app/features/defaultTokenList/TokenDetails";
import IconSelector from "app/features/defaultTokenList/IconSelector";
import Button from "app/components/Button";
import QuestionHelper from "app/components/QuestionHelper";

export default function DefaultTokenList() {
  const [chainId, setChainId] = useState<ChainId>(ChainId.ETHEREUM);
  const [tokenAddress, setTokenAddress] = useState<string>("");
  const [tokenIcon, setTokenIcon] = useState<string>("");
  const [submitState, setSubmitState] = useState<{
    state: "nothing" | "loading" | "error" | "success";
    data?: { iconPr: string; listPr: string };
    error?: string;
  }>({ state: "nothing" });

  const { data: tokenData, isValidating: tokenDataLoading } = useTokenData(
    tokenAddress,
    chainId
  );

  const onSubmit = async () => {
    setSubmitState({ state: "loading" });

    const result = await fetch("/api/submitToken", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ tokenAddress, tokenData, tokenIcon, chainId }),
    });

    const data = await result.json();

    switch (result.status) {
      case 200:
        setSubmitState({ state: "success", data });
        break;
      case 500:
        setSubmitState({
          state: "error",
          error: data?.error ?? "Unknown error.",
        });
    }
  };

  return (
    <div className="flex items-center justify-center h-full">
      <div className="rounded-[14px] border border-dark-700 bg-dark-900 py-2 p-4 flex flex-col space-y-2 transition">
        <div className="flex flex-row items-center justify-between space-x-2">
          <div className="text-xl">1. Select network</div>
          <Web3Network chainId={chainId} />
        </div>

        <div className="flex flex-row items-center justify-between space-x-2">
          <div className="text-xl">2. Input token address</div>
          <div className="flex flex-row items-center space-x-2">
            <input
              onChange={(e) => setTokenAddress(e.target.value)}
              placeholder="0x6B3595068778DD592e39A122f4f5a5cF09C90fE2"
              className="bg-dark-1000 border-dark-700 border rounded-[14px] px-2 py-1 w-[38ch]"
            ></input>
            <div>
              {tokenData?.isValid ?? false ? (
                <CheckIcon width={16} color="green" />
              ) : tokenDataLoading ? (
                <RefreshIcon width={16} />
              ) : (
                <XIcon width={16} color="red" />
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start w-full space-y-2">
          <div className="text-xl">3. Check the details</div>
          <TokenDetails tokenData={tokenData} />
        </div>

        <div className="flex flex-col items-start w-full space-y-2">
          <div className="text-xl">4. Upload an image</div>
          <IconSelector tokenIcon={tokenIcon} setTokenIcon={setTokenIcon} />
        </div>

        <div className="space-y-2">
          <div className="flex flex-row items-center justify-between">
            <div>Icon PR</div>
            <a
              target="_blank"
              rel="noreferrer"
              href={submitState.data?.iconPr}
              className="bg-dark-1000 border-dark-700 border rounded-[14px] px-2 py-1 w-[50ch] text-right h-8"
            >
              {submitState.data?.iconPr}
            </a>
          </div>
          <div className="flex flex-row items-center justify-between">
            <div>List PR</div>
            <a
              target="_blank"
              rel="noreferrer"
              href={submitState.data?.listPr}
              className="bg-dark-1000 border-dark-700 border rounded-[14px] px-2 py-1 w-[50ch] text-right h-8"
            >
              {submitState.data?.listPr}
            </a>
          </div>
        </div>

        <div className="flex items-center justify-end pt-4 space-x-2">
          <div className="w-6">
            {submitState.state === "loading" ? (
              <RefreshIcon width={20} />
            ) : submitState.state === "success" ? (
              <CheckIcon width={20} color="green" />
            ) : (
              submitState.state === "error" && (
                <QuestionHelper text={submitState?.error}>
                  <div>
                    <XIcon width={20} color="red" />
                  </div>
                </QuestionHelper>
              )
            )}
          </div>
          <Button variant="outlined" color="blue" onClick={onSubmit}>
            Submit
          </Button>
        </div>
      </div>
      <NetworkModal chainId={chainId} setChainId={setChainId} />
    </div>
  );
}
