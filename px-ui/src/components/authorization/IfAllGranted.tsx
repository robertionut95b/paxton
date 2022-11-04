import { AuthComponentProps } from "@interfaces/auth-comp.types";

export const IfAllGranted = ({ expected, actual, children, unauthorized } : AuthComponentProps) => {
    const e = expected, a = actual ? (Array.isArray(actual) ? actual : [actual]) : [];
    for (let i = 0; i < e.length; i++) {
        if (a.indexOf(expected[i]) === -1) {
            return unauthorized ?? null;
        }
    }
    if (!Array.isArray(children)) {
        return children ? children : null;
    }
    return <>
        {children}
    </>;
};