import React, { ReactElement } from "react";

export interface ShowIFProps {
  if: unknown;
  children: ReactElement | unknown;
}

const checkTypeFunction = (children: ReactElement | unknown) =>
  typeof children === "function" ? children() : (children as ReactElement);

const ShowIf = React.memo(
  ({ if: show, children }: ShowIFProps): ReactElement | null =>
    show ? checkTypeFunction(children) : null
);

ShowIf.displayName = "ShowIfElse";

export default ShowIf;
