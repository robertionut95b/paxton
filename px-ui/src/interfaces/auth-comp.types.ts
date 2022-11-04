import { ReactElement, ReactNode } from "react"

export interface AuthComponentProps {
    expected: string | string[],
    actual: string[]
    unauthorized?: ReactElement
    children: ReactNode
}