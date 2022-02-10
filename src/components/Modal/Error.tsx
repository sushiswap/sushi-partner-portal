import { classNames } from "app/functions";
import React, { FC } from "react";

export interface ModalActionErrorProps {
  className?: string;
}

const ModalError: FC<ModalActionErrorProps> = ({
  className = "",
  children,
}) => {
  if (!children) return <></>;

  return (
    <div
      className={classNames(
        "text-center text-red font-bold text-xs",
        className
      )}
    >
      {children}
    </div>
  );
};

export default ModalError;
