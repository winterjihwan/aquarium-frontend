import React from "react";
import { useMe } from "../../providers/MeProvider";
import LoginPage from "../LoginPage";

const HomePage = () => {
  const { me, isMounted } = useMe();

  if (me) {
    return <div>HomePage</div>;
  } else {
    return <LoginPage />;
  }
};

export default HomePage;
