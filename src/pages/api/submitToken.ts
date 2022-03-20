import { createAppAuth } from "@octokit/auth-app";
import { ChainId, ChainKey } from "@sushiswap/core-sdk";
import { TokenData } from "app/hooks/useTokenData";
import { ethers } from "ethers";
import type { NextApiRequest, NextApiResponse } from "next";
import { Octokit } from "octokit";

interface Body {
  tokenAddress: string;
  tokenData: TokenData;
  tokenIcon: string;
  chainId: ChainId;
}

const owner = "sushiswap";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { tokenAddress, tokenData, tokenIcon, chainId } = req.body as Body;
  if (
    !tokenData?.decimals ||
    !tokenData.name ||
    !tokenData.symbol ||
    !tokenIcon ||
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

  const displayName = tokenData.symbol.toLowerCase().replace(/( )|(\.)/g, "_");

  // find unused branch name
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
    // Upload image
    await octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
      owner,
      repo: "list",
      branch: branch,
      path: imagePath,
      content: tokenIcon.split(",")[1],
      message: `Upload ${displayName} icon`,
    });
  } catch {
    res.status(500).json({ error: "Token image already exists." });
    return;
  }

  const listPath = `lists/token-lists/default-token-list/tokens/${ChainKey[
    ChainId[chainId]
  ].toLowerCase()}.json`;

  // Get current list to append to
  const { data: currentListData } = (await octokit.request(
    "GET /repos/{owner}/{repo}/contents/{path}",
    {
      owner,
      repo: "list",
      branch: "master",
      path: listPath,
    }
  )) as any;

  // Append to current list
  const newList = [
    ...JSON.parse(
      Buffer.from(currentListData.content, "base64").toString("ascii")
    ),
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
    sha: currentListData.sha,
  });

  // Open List PR
  const {
    data: { html_url: listPr },
  } = await octokit.request("POST /repos/{owner}/{repo}/pulls", {
    owner,
    repo: "list",
    title: `Token: ${displayName}`,
    head: branch,
    base: "master",
    body: `Name: ${tokenData.name}\nSymbol: ${tokenData.symbol}\nDecimals: ${tokenData.decimals}\nImage: https://github.com/${owner}/list/tree/${branch}/${imagePath}\n![${displayName}](https://raw.githubusercontent.com/${owner}/list/${branch}/${imagePath})`,
  });

  res.status(200).json({ listPr });
};

export default handler;
