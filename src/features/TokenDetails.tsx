import { TokenData } from "app/hooks/useTokenData";
import { FC } from "react";
import Typography from "app/components/Typography";
import Loader from "app/components/Loader";

const ITEMS = [
  ["Symbol", "symbol"],
  ["Name", "name"],
  ["Decimals", "decimals"],
];

interface TokenDetails {
  data: TokenData;
  loading: boolean;
}

const TokenDetails: FC<TokenDetails> = ({ data, loading }) => {
  return (
    <div className="grid grid-cols-3">
      {ITEMS.map((e, i) => (
        <div key={i} className="flex flex-col gap-1">
          <Typography variant="sm" className="text-secondary">
            {e[0]}
          </Typography>
          {loading ? (
            <Loader />
          ) : (
            <Typography weight={700}>{data?.[e[1]]}</Typography>
          )}
        </div>
      ))}
    </div>
  );
};

export default TokenDetails;
