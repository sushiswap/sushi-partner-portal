import Image from "next/image";
import React from "react";
import Container from "./Header/Container";
import { NavigationItem } from "./Header/NavigationItem";

export const HEADER_HEIGHT = 64;
const NAV_CLASS =
  "backdrop-blur-fallback w-full before:backdrop-blur-[20px] before:z-[-1] before:absolute before:w-full before:h-full border-b border-dark-800";

function Header() {
  return (
    <div
      className="fixed z-20 hidden w-full lg:block"
      style={{ height: HEADER_HEIGHT }}
    >
      <nav className={NAV_CLASS}>
        <Container maxWidth="7xl" className="mx-auto">
          <div className="flex items-center justify-between gap-4 px-6">
            <div className="flex gap-4">
              <div className="flex items-center w-6 mr-4">
                <Image
                  src="https://app.sushi.com/images/logo.svg"
                  alt="Sushi logo"
                  width="24px"
                  height="24px"
                />
              </div>
              {routes.map((node) => {
                return <NavigationItem node={node} key={node.key} />;
              })}
            </div>
          </div>
        </Container>
      </nav>
    </div>
  );
}

const routes = [
  {
    key: "home",
    title: "Home",
    link: "/",
  },
  {
    key: "forms",
    title: "Forms",
    items: [
      {
        key: "forms-default-token-list",
        title: "Default Token List",
        link: "/forms/defaultTokenList",
      },
    ],
  },
];

export default Header;
