import { useEffect, useState } from "react";
import { DynamicWidget, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { BACKEND_API_URL } from "../../utils/constants";

const LoginScreen = () => {
  const { user } = useDynamicContext();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  console.log({ user });

  useEffect(() => {
    if (user) {
      setUserData(user);
    }
  }, [user]);

  const registerUser = async (userData) => {
    try {
      setLoading(true);
      const payload = {
        firstName: userData?.firstName || "",
        lastName: userData?.lastName || "",
        email: userData?.email || "",
        userId: userData?.id || "",
        defaultWallet:
          userData?.verifiedCredentials[0]?.address ||
          userData?.verifiedCredentials[1]?.address ||
          "",
      };

      console.log({ payload });
      return;

      const response = await fetch(`${BACKEND_API_URL}/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <DynamicWidget />
    </div>
  );
};

export default LoginScreen;
