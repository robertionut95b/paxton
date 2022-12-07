import { Link } from "react-router-dom";

export default function Index() {
  return (
    <div className="px-base">
      This is the main page! Hello World!
      <br />
      <Link to={"/app"}>To app</Link>
    </div>
  );
}
