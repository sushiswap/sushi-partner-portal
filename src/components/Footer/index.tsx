import {
  DiscordIcon,
  InstagramIcon,
  MediumIcon,
  TwitterIcon,
} from "app/components/Icon";
import Typography from "app/components/Typography";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import Container from "../Container";

const Footer = () => {
  return (
    <div className="z-10 w-full py-20 mt-20">
      <Container maxWidth="7xl" className="mx-auto px-6">
        <div className="grid grid-cols-2 gap-10 pt-8 md:grid-cols-3 lg:grid-cols-6 xs:px-6 border-t border-dark-900">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-start gap-2">
              <div className="">
                <Image
                  src="https://app.sushi.com/images/logo.svg"
                  alt="Sushi logo"
                  width="28px"
                  height="28px"
                />
              </div>
              <Typography
                variant="h2"
                weight={700}
                className="tracking-[0.02em] scale-y-90 hover:text-high-emphesis"
              >
                Sushi
              </Typography>
            </div>
            <Typography variant="xs" className="text-low-emphesis">
              Our community is building a comprehensive decentralized trading
              platform for the future of finance. Join us!
            </Typography>
            <div className="flex items-center gap-4">
              <a
                href="https://twitter.com/sushiswap"
                target="_blank"
                rel="noreferrer"
              >
                <TwitterIcon width={16} className="text-low-emphesis" />
              </a>
              <a
                href="https://instagram.com/instasushiswap"
                target="_blank"
                rel="noreferrer"
              >
                <InstagramIcon width={16} className="text-low-emphesis" />
              </a>
              <a
                href="https://medium.com/sushiswap-org"
                target="_blank"
                rel="noreferrer"
              >
                <MediumIcon width={16} className="text-low-emphesis" />
              </a>
              <a
                href="https://discord.gg/NVPXN4e"
                target="_blank"
                rel="noreferrer"
              >
                <DiscordIcon width={16} className="text-low-emphesis" />
              </a>
            </div>
          </div>
          <div className="flex flex-col gap-1 text-right">
            <Typography
              variant="xs"
              weight={700}
              className="mt-2.5 hover:text-high-emphesis"
            >
              Products
            </Typography>
            <Link href="/legacy/pools" passHref={true}>
              <Typography
                variant="xs"
                className="text-low-emphesis hover:text-high-emphesis"
              >
                Liquidity Pools
              </Typography>
            </Link>
            <Link href="/lend" passHref={true}>
              <Typography
                variant="xs"
                className="text-low-emphesis hover:text-high-emphesis"
              >
                Lending
              </Typography>
            </Link>
            <Link href="/miso" passHref={true}>
              <Typography
                variant="xs"
                className="text-low-emphesis hover:text-high-emphesis"
              >
                Launchpad
              </Typography>
            </Link>
            <a href="https://shoyunft.com" target="_blank" rel="noreferrer">
              <Typography
                variant="xs"
                className="text-low-emphesis hover:text-high-emphesis"
              >
                Shoyu NFT
              </Typography>
            </a>
            <Link href="/tools" passHref={true}>
              <Typography
                variant="xs"
                className="text-low-emphesis hover:text-high-emphesis"
              >
                Tools
              </Typography>
            </Link>
          </div>
          <div className="flex flex-col gap-1 md:text-right lg:text-right">
            <Typography
              variant="xs"
              weight={700}
              className="mt-2.5 hover:text-high-emphesis"
            >
              Help
            </Typography>
            <a href="https://docs.sushi.com" target="_blank" rel="noreferrer">
              <Typography
                variant="xs"
                className="text-low-emphesis hover:text-high-emphesis"
              >
                What is Sushi?
              </Typography>
            </a>
            <a
              href="https://discord.gg/NVPXN4e"
              target="_blank"
              rel="noreferrer"
            >
              <Typography
                variant="xs"
                className="text-low-emphesis hover:text-high-emphesis"
              >
                Ask on Discord
              </Typography>
            </a>
            <a
              href="https://twitter.com/sushiswap"
              target="_blank"
              rel="noreferrer"
            >
              <Typography
                variant="xs"
                className="text-low-emphesis hover:text-high-emphesis"
              >
                Ask on Twitter
              </Typography>
            </a>
            <a href="https://forum.sushi.com" target="_blank" rel="noreferrer">
              <Typography
                variant="xs"
                className="text-low-emphesis hover:text-high-emphesis"
              >
                Ask on Forum
              </Typography>
            </a>
          </div>
          <div className="flex flex-col gap-1 text-right xs:text-right md:text-left lg:text-right">
            <Typography
              variant="xs"
              weight={700}
              className="mt-2.5 hover:text-high-emphesis"
            >
              Developers
            </Typography>
            <a href="https://docs.sushi.com" target="_blank" rel="noreferrer">
              <Typography
                variant="xs"
                className="text-low-emphesis hover:text-high-emphesis"
              >
                GitBook
              </Typography>
            </a>
            <a
              href="https://github.com/sushiswap"
              target="_blank"
              rel="noreferrer"
            >
              <Typography
                variant="xs"
                className="text-low-emphesis hover:text-high-emphesis"
              >
                GitHub
              </Typography>
            </a>
            <a href="https://dev.sushi.com" target="_blank" rel="noreferrer">
              <Typography
                variant="xs"
                className="text-low-emphesis hover:text-high-emphesis"
              >
                Development
              </Typography>
            </a>
            <a href="https://docs.openmev.org" target="_blank" rel="noreferrer">
              <Typography
                variant="xs"
                className="text-low-emphesis hover:text-high-emphesis"
              >
                Sushi Relay
              </Typography>
            </a>
          </div>
          <div className="flex flex-col gap-1 md:text-right lg:text-right">
            <Typography
              variant="xs"
              weight={700}
              className="mt-2.5 hover:text-high-emphesis"
            >
              Governance
            </Typography>
            <a href="https://forum.sushi.com" target="_blank" rel="noreferrer">
              <Typography
                variant="xs"
                className="text-low-emphesis hover:text-high-emphesis"
              >
                Forum & Proposals
              </Typography>
            </a>
            <a
              href="https://snapshot.org/#/sushigov.eth"
              target="_blank"
              rel="noreferrer"
            >
              <Typography
                variant="xs"
                className="text-low-emphesis hover:text-high-emphesis"
              >
                Vote
              </Typography>
            </a>
          </div>
          <div className="flex flex-col gap-1 text-right">
            <Typography
              variant="xs"
              weight={700}
              className="mt-2.5 hover:text-high-emphesis"
            >
              Protocol
            </Typography>
            <a
              href="https://docs.google.com/document/d/19bL55ZTjKtxlom2CpVo6K8jL1e-OZ13y6y9AQgw_qT4"
              target="_blank"
              rel="noreferrer"
            >
              <Typography
                variant="xs"
                className="text-low-emphesis hover:text-high-emphesis"
              >
                Apply for Onsen
              </Typography>
            </a>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSecahmrXOJytn-wOUB8tEfONzOTP4zjKqz3sIzNzDDs9J8zcA/viewform"
              target="_blank"
              rel="noreferrer"
            >
              <Typography
                variant="xs"
                className="text-low-emphesis hover:text-high-emphesis"
              >
                Apply for Miso
              </Typography>
            </a>

            <Link href="/vesting" passHref={true}>
              <Typography
                variant="xs"
                className="text-low-emphesis hover:text-high-emphesis"
              >
                Vesting
              </Typography>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Footer;
