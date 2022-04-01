import { createAppAuth } from "@octokit/auth-app";
import { ChainId, ChainKey } from "@sushiswap/core-sdk";
import { TokenData } from "app/hooks/useTokenData";
import { ethers } from "ethers";
import { gql, request } from "graphql-request";
import type { NextApiRequest, NextApiResponse } from "next";
import { Octokit } from "octokit";

interface Body {
  tokenAddress: string;
  tokenData: TokenData;
  tokenIcon: string;
  chainId: ChainId;
  listType: "default-token-list" | "community-token-list";
}

const owner = "sushiswap";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { tokenAddress, tokenData, tokenIcon, chainId, listType } =
    req.body as Body;
  if (
    !tokenData?.decimals ||
    !tokenData.name ||
    !tokenData.symbol ||
    !tokenIcon ||
    !listType ||
    !chainId
  ) {
    res.status(500).json({ error: "Invalid data submitted." });
    return;
  }

  const checksummedAddress = ethers.utils.getAddress(tokenAddress);

  const octokit = new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId: 169875,
      privateKey: process.env.OCTOKIT_KEY?.replace(/\\n/g, "\n"),
      installationId: 23112528,
    },
  });

  // Get latest commit for the new branch
  const {
    data: {
      commit: { sha: latestIconsSha },
    },
  } = await octokit.request("GET /repos/{owner}/{repo}/branches/{branch}", {
    owner,
    repo: "list",
    branch: "master",
  });

  // Filter out characters that github / ... might not like
  const displayName = tokenData.symbol.toLowerCase().replace(/( )|(\.)/g, "_");

  // Find unused branch name
  const branch = await (async function () {
    const branches: string[] = [];

    for (let i = 1; ; i++) {
      const { data } = await octokit.request(
        "GET /repos/{owner}/{repo}/branches",
        {
          owner,
          repo: "list",
          per_page: 100,
          page: i,
        }
      );

      const newBranches = data.reduce(
        (acc, e) => [...acc, e.name],
        [] as string[]
      );

      branches.push(...newBranches);

      if (newBranches.length < 100) break;
    }

    const createBranchName = (name: string, depth: number = 0) => {
      if (!branches.includes(name)) return name;
      else if (!branches.includes(`${name}-${depth}`))
        return `${name}-${depth}`;
      else return createBranchName(name, ++depth);
    };

    return createBranchName(displayName);
  })();

  // Create new branch
  await octokit.request("POST /repos/{owner}/{repo}/git/refs", {
    owner,
    repo: "list",
    ref: `refs/heads/${branch}`,
    sha: latestIconsSha,
  });

  const imagePath = `logos/token-logos/network/${ChainKey[
    ChainId[chainId]
  ].toLowerCase()}/${checksummedAddress}.jpg`;

  try {
    // Figure out if image already exists, overwrite if it does
    let previousImageFileSha: string | undefined;

    try {
      ({
        data: { sha: previousImageFileSha },
      } = (await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
        owner,
        repo: "list",
        branch: "master",
        path: imagePath,
      })) as any);
    } catch {}

    // Upload image
    await octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
      owner,
      repo: "list",
      branch: branch,
      path: imagePath,
      content: tokenIcon.split(",")[1],
      message: `Upload ${displayName} icon`,
      sha: previousImageFileSha,
    });
  } catch (e) {
    res.status(500).json({ error: "Failed to add token image" });
    return;
  }

  const listPath = `lists/token-lists/${listType}/tokens/${ChainKey[
    ChainId[chainId]
  ].toLowerCase()}.json`;

  // Get current token list to append to
  let currentListData: { sha: string; content: any } | undefined;

  try {
    ({ data: currentListData } = (await octokit.request(
      "GET /repos/{owner}/{repo}/contents/{path}",
      {
        owner,
        repo: "list",
        branch: "master",
        path: listPath,
      }
    )) as any);
  } catch {}

  const currentList = currentListData
    ? JSON.parse(
        Buffer.from(currentListData?.content, "base64").toString("ascii")
      )
    : [];

  // No need to update token list when entry already exists
  // For cases when only updating the image
  if (!currentList.find((entry) => entry.address === checksummedAddress)) {
    // Append to current list
    const newList = [
      ...currentList,
      {
        name: tokenData.name,
        address: checksummedAddress,
        symbol: tokenData.symbol,
        decimals: tokenData.decimals,
        chainId: chainId,
        logoURI: `https://raw.githubusercontent.com/${owner}/list/master/${imagePath}`,
      },
    ];

    // Upload new list
    await octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
      owner,
      repo: "list",
      branch: branch,
      path: listPath,
      content: Buffer.from(JSON.stringify(newList, null, 2)).toString("base64"),
      message: `Add ${displayName} on ${ChainId[chainId].toLowerCase()}`,
      sha: currentListData?.sha,
    });
  }

  const exchangeData = await getExchangeData(chainId, tokenAddress);

  // Open List PR
  const {
    data: { html_url: listPr },
  } = await octokit.request("POST /repos/{owner}/{repo}/pulls", {
    owner,
    repo: "list",
    title: `Token: ${displayName}`,
    head: branch,
    base: "master",
    body: `Name: ${tokenData.name}
      Symbol: ${tokenData.symbol}
      Decimals: ${tokenData.decimals}
      Volume: $${exchangeData.volumeUSD.toFixed(2)}
      Liquidity: $${exchangeData.liquidityUSD.toFixed(2)}
      CoinGecko: ${await getCoinGecko(chainId, checksummedAddress)}
      Image: https://github.com/${owner}/list/tree/${branch}/${imagePath}
      ![${displayName}](https://raw.githubusercontent.com/${owner}/list/${branch}/${imagePath})
    `,
  });

  // Send Discord notification using webhook
  await fetch(process.env.LIST_PR_WEBHOOK_URL, {
    method: "POST",
    body: JSON.stringify({
      content: null,
      embeds: [
        {
          description: "New pull request",
          color: 5814783,
          author: {
            name: `${tokenData.name} - ${ChainId[chainId]}`,
            url: listPr,
            icon_url: `https://raw.githubusercontent.com/${owner}/list/${branch}/${imagePath}`,
          },
        },
      ],
      username: "GitHub List Repo",
      avatar_url:
        "https://banner2.cleanpng.com/20180824/jtl/kisspng-computer-icons-logo-portable-network-graphics-clip-icons-for-free-iconza-circle-social-5b7fe46b0bac53.1999041115351082030478.jpg",
    }),
    headers: { "Content-Type": "application/json" },
  });

  res.status(200).json({ listPr });
};

export default handler;

async function getCoinGecko(chainId: ChainId, address: string) {
  return await fetch(
    `https://api.coingecko.com/api/v3/coins/${ChainId[
      chainId
    ].toLowerCase()}/contract/${address}`
  )
    .then((data) => data.json())
    .then((data) =>
      data.id ? `https://www.coingecko.com/en/coins/${data.id}` : "Not Found"
    );
}

export const exchangeSubgraph: any = {
  [ChainId.ARBITRUM]:
    "https://api.thegraph.com/subgraphs/name/sushiswap/arbitrum-exchange",
  [ChainId.AVALANCHE]:
    "https://api.thegraph.com/subgraphs/name/sushiswap/avalanche-exchange",
  [ChainId.BSC]:
    "https://api.thegraph.com/subgraphs/name/sushiswap/bsc-exchange",
  [ChainId.CELO]:
    "https://api.thegraph.com/subgraphs/name/sushiswap/celo-exchange",
  [ChainId.FANTOM]:
    "https://api.thegraph.com/subgraphs/name/sushiswap/fantom-exchange",
  [ChainId.HARMONY]:
    "https://sushi.graph.t.hmny.io/subgraphs/name/sushiswap/harmony-exchange",
  [ChainId.HECO]: "https://q.hg.network/subgraphs/name/heco-exchange/heco",
  [ChainId.ETHEREUM]:
    "https://api.thegraph.com/subgraphs/name/sushiswap/exchange",
  [ChainId.MATIC]:
    "https://api.thegraph.com/subgraphs/name/sushiswap/matic-exchange",
  [ChainId.OKEX]: "https://n19.hg.network/subgraphs/name/okex-exchange/oec",
  [ChainId.XDAI]:
    "https://api.thegraph.com/subgraphs/name/sushiswap/xdai-exchange",
  [ChainId.MOONRIVER]:
    "https://api.thegraph.com/subgraphs/name/sushiswap/moonriver-exchange",
  [ChainId.FUSE]:
    "https://api.thegraph.com/subgraphs/name/sushiswap/fuse-exchange",
};

async function getExchangeData(chainId: ChainId, address: string) {
  try {
    const { token } = await request(
      exchangeSubgraph[chainId],
      gql`
        query exchangeData($token: String!) {
          token(id: $token) {
            derivedETH
            liquidity
            volumeUSD
          }
        }
      `,
      { token: address.toLowerCase() }
    );

    const { bundles } = await request(
      exchangeSubgraph[chainId],
      gql`
        query bundle {
          bundles(first: 1) {
            ethPrice
          }
        }
      `,
      { token: address.toLowerCase() }
    );

    return {
      liquidityUSD: token.liquidity * token.derivedETH * bundles[0].ethPrice,
      volumeUSD: Number(token.volumeUSD),
    };
  } catch {
    return {
      liquidityUSD: 0,
      volumeUSD: 0,
    };
  }
}
