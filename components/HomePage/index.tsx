"use client";

import { useMe } from "@/providers/MeProvider";
import LoginPage from "../LoginPage";
import ShowCase from "../ShowCase";

export default function HomePage() {
  const { me, isMounted } = useMe();

  if (!isMounted) return null;

  if (me) {
    return <ShowCase />;
  } else {
    return <LoginPage />;
  }
}
