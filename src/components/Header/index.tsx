import Typography from "app/components/Typography";
import Image from "next/image";
import React from "react";

import Container from "../Container";

function Header() {
  return (
    <div className="z-20 w-full flex items-center">
      <nav className="w-full h-full flex items-center h-[64px]">
        <Container maxWidth="7xl" className="mx-auto">
          <div className="flex items-center justify-between gap-4 px-6">
            <div className="flex items-center">
              <div className="flex items-center w-6 mr-4">
                <Image
                  src="https://app.sushi.com/images/logo.svg"
                  alt="Sushi logo"
                  width="24px"
                  height="24px"
                />
              </div>
              <Typography weight={700} className="text-high-emphesis">
                Partner Portal
              </Typography>
            </div>
          </div>
        </Container>
      </nav>
    </div>
  );
}

export default Header;
