import { Routes } from "@app/routes";
import { redirect } from "react-router-dom";

export default function Index() {
  return redirect(Routes.Feed.path);
}
