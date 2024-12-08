import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  DynamicWidget,
  useDynamicContext,
  useEmbeddedWallet,
} from "@dynamic-labs/sdk-react-core";
import { BACKEND_API_URL } from "../../utils/constants";
import styles from "./LoginScreen.module.css";
import {
  BossBabyTokenDetails,
  SJDxGoblinTokenDetails,
  ADIITokenDetails,
} from "../../utils/token-details";

const LoginScreen = () => {
  const { user } = useDynamicContext();
  const { addCustomToken } = useEmbeddedWallet();
  const requestDone = useRef(false);

  const navigate = useNavigate();
  console.log({ user });

  console.log(useEmbeddedWallet(), "waa");

  useEffect(() => {
    if (user && !requestDone.current) {
      if (user?.newUser) {
        registerUser(user);
        // addTokenToWallet();
      }
      // addTokenToWalletHandler();
      navigate("/find-coin");
    }
  }, [user, requestDone]);

  const addTokenToWalletHandler = async () => {
    try {
      console.log("Adding tokens to wallet", requestDone.current);
      if (requestDone.current) return;
      await addCustomToken(BossBabyTokenDetails);
      await addCustomToken(SJDxGoblinTokenDetails);
      const result = await addCustomToken(ADIITokenDetails);
      console.log({ result });
      console.log("Tokens added to wallet");
      requestDone.current = true;
    } catch (error) {
      console.log({ error });
    }
  };

  const registerUser = async (userData) => {
    try {
      // setLoading(true);
      const payload = {
        firstName: userData?.firstName || "",
        lastName: userData?.lastName || "",
        email: userData?.email || "",
        userId: userData?.userId || "",
        defaultWalletAddress:
          userData?.verifiedCredentials[0]?.address ||
          userData?.verifiedCredentials[1]?.address ||
          "",
      };

      console.log({ payload });

      const response = await fetch(`${BACKEND_API_URL}/users/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log({ result });
      navigate("/find-coin");
    } catch (error) {
      console.log({ error });
    } finally {
      // setLoading(false);
    }
  };

  return (
    <div className={styles.loginScreen}>
      <h1 className="text-6xl font-bold text-blue-600">Pokimint</h1>
      <DynamicWidget />
    </div>
  );
};

export default LoginScreen;
