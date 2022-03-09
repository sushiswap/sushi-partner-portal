import { TokenData } from "app/hooks/useTokenData";

export default function TokenDetails({ tokenData }: { tokenData: TokenData }) {
  return (
    <>
      {[
        ["Symbol", "symbol"],
        ["Name", "name"],
        ["Decimals", "decimals"],
      ].map((e, i) => (
        <div key={i} className="flex flex-row justify-between w-full">
          <div>{e[0]}</div>
          <div className="bg-dark-1000 border-dark-700 border rounded-[14px] px-2 py-1 w-[16ch] text-right h-8">
            {tokenData?.[e[1]]}
          </div>
        </div>
      ))}
    </>
  );
}
