import { ArrowLeftIcon, XIcon } from "@heroicons/react/outline";
import React, { FC, ReactNode } from "react";

export interface ModalHeaderProps {
  header: string | ReactNode;
  subheader?: string;
  onClose?(): void;
  onBack?(): void;
}

const ModalHeader: FC<ModalHeaderProps> = ({
  header,
  subheader,
  onBack,
  onClose,
}) => {
  return (
    <div className="flex items-start justify-between">
      <div className="flex flex-col gap-1 justify-center">
        <div className="flex gap-3 text-high-emphesis items-center font-bold">
          {onBack && (
            <ArrowLeftIcon
              onClick={onBack}
              width={24}
              height={24}
              className="cursor-pointer text-high-emphesis"
            />
          )}
          {header}
        </div>
        {subheader && <div className="text-sm">{subheader}</div>}
      </div>
      {onClose && (
        <div
          className="flex items-center justify-center w-6 h-6 cursor-pointer"
          onClick={onClose}
        >
          <XIcon width={24} height={24} className="text-high-emphesis" />
        </div>
      )}
    </div>
  );
};

export default ModalHeader;
