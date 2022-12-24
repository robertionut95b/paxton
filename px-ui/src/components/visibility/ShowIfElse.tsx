import React, { ReactElement } from "react";

export interface ShowIFElseProps {
  if: unknown;
  else: ReactElement | unknown;
  children: ReactElement | unknown;
}

const checkTypeFunction = (children: ReactElement | unknown) =>
  typeof children === "function" ? children() : children;

const ShowIfElse = React.memo(
  ({
    if: show,
    else: elseChildren,
    children,
  }: ShowIFElseProps): ReactElement | null =>
    show ? checkTypeFunction(children) : elseChildren
);

ShowIfElse.displayName = "ShowIfElse";

export default ShowIfElse;
