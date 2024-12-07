import { useEffect, useState } from "react";
import { DynamicWidget, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { BACKEND_API_URL } from "../../utils/constants";
import userStore from "../../store/userStore";

const LoginScreen = () => {
  const { user } = useDynamicContext();
  //   const {
  //     user: userData,
  //     setUser,
  //     updateUser,
  //   } = userStore((state) => ({
  //     user: state.user,
  //     setUser: state.setUser,
  //     updateUser: state.updateUser,
  //   }));

  const [loading, setLoading] = useState(false);

  console.log({ user });

  useEffect(() => {
    if (user) {
      //   setUser(user);
      if (user?.newUser) {
        registerUser(user);
      }
    }
  }, [user]);

  const registerUser = async (userData) => {
    try {
      setLoading(true);
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
