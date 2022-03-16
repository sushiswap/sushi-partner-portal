import { classNames } from "app/functions";
import { FC, ReactElement } from "react";

import { FormSectionProps } from "./FormSection";

export interface FormCardProps {
  children: ReactElement<FormSectionProps> | ReactElement<FormSectionProps>[];
  className?: string;
}

const FormCard: FC<FormCardProps> = ({ children, className }) => {
  return (
    <div
      className={classNames(
        "bg-dark-900 border border-dark-800 p-6 rounded space-y-8 divide-y divide-dark-700",
        className
      )}
    >
      {children}
    </div>
  );
};

export default FormCard;
