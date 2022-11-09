import React from "react";

export interface IShowIFProps {
  if: unknown;
  else: React.ReactNode;
  children: React.ReactNode;
}

const checkTypeFunction = (children: React.ReactNode) =>
  // @ts-expect-error(type check)
  typeof children === "function" ? children() : children;

// eslint-disable-next-line react/display-name
export default React.memo(
  /* eslint-disable react/prop-types */
  ({ if: show, else: elseChildren, children }: IShowIFProps) =>
    show ? checkTypeFunction(children) : elseChildren
);
