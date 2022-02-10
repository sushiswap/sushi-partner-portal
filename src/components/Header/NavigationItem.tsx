import { Popover, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/outline";
import { classNames } from "app/functions";
import { useRouter } from "next/router";
import React, { FC, Fragment, ReactNode, useCallback, useRef } from "react";

interface NavigationItem {
  node: MenuItem;
}

interface MenuItemLeaf {
  key: string;
  title: string;
  link: string;
  icon?: ReactNode;
}

interface MenuItemNode {
  key: string;
  title: string;
  items: MenuItemLeaf[];
  icon?: ReactNode;
}

type MenuItem = MenuItemLeaf | MenuItemNode;

export const NavigationItem: FC<NavigationItem> = ({ node }) => {
  const router = useRouter();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleToggle = useCallback((open, type) => {
    if (!open && type === "enter") {
      buttonRef?.current?.click();
    } else if (open && type === "leave") {
      buttonRef?.current?.click();
    }
  }, []);

  if (node && node.hasOwnProperty("link")) {
    const { link } = node as MenuItemLeaf;
    return (
      <div
        onClick={() => router.push(link)}
        className={classNames(
          router.asPath === link ? "text-white" : "",
          "hover:text-white font-bold py-5 px-2 rounded flex gap-3 text-sm"
        )}
      >
        {node.title}
      </div>
    );
  }

  return (
    <Popover key={node.key} className="flex relative">
      {({ open }) => (
        <div
          {...{
            onMouseEnter: () => handleToggle(open, "enter"),
            onMouseLeave: () => handleToggle(open, "leave"),
          }}
        >
          <Popover.Button ref={buttonRef}>
            <div
              className={classNames(
                open ? "text-white" : "",
                "text-sm font-bold py-5 px-2 rounded flex gap-3 items-center"
              )}
            >
              {node.title}
              <ChevronDownIcon strokeWidth={5} width={12} />
            </div>
          </Popover.Button>
          {node.hasOwnProperty("items") && (
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Popover.Panel className="z-10 w-full absolute w-40 translate-y-[-8px] translate-x-[-8px]">
                <div
                  className={classNames(
                    "shadow-md shadow-black/40 border border-dark-700 rounded overflow-hidden backdrop-blur-fallback before:z-[-1] before:rounded before:absolute before:w-full before:h-full before:content-[''] before:backdrop-blur-[20px] bg-white bg-opacity-[0.02]"
                  )}
                >
                  {(node as MenuItemNode).items.map((leaf) => (
                    <div
                      key={leaf.key}
                      onClick={() => {
                        router
                          .push(leaf.link)
                          .then(() => buttonRef?.current?.click());
                      }}
                      className="relative px-3 py-2 hover:cursor-pointer hover:text-white m-1 rounded-lg hover:bg-white/10 font-bold text-sm"
                    >
                      {leaf.title}
                    </div>
                  ))}
                </div>
              </Popover.Panel>
            </Transition>
          )}
        </div>
      )}
    </Popover>
  );
};
