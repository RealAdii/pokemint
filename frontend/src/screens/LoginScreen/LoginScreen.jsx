import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DynamicWidget, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { BACKEND_API_URL } from "../../utils/constants";
import styles from "./LoginScreen.module.css";

const LoginScreen = () => {
  const { user } = useDynamicContext();

  const navigate = useNavigate();
  console.log({ user });

  useEffect(() => {
    if (user) {
      if (user?.newUser) {
        registerUser(user);
      }

      navigate("/find-coin");
    }
  }, [user]);

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
