import React from "react";

export interface IShowIFProps {
  if: unknown;
  children: React.ReactNode;
}

const checkTypeFunction = (children: React.ReactNode) =>
  // @ts-expect-error(type check)
  typeof children === "function" ? children() : children;

// eslint-disable-next-line react/display-name
export default React.memo(({ if: show, children }: IShowIFProps) =>
  show ? checkTypeFunction(children) : null
);
