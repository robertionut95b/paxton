import { useRouteError } from "react-router-dom";

interface ErrorProps {
  statusText: string;
  message: string;
}

export default function ErrorPage() {
  const error = useRouteError();
  const errors = error as ErrorProps;

  return (
    <div className="px-error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{errors.statusText || errors.message}</i>
      </p>
    </div>
  );
}
