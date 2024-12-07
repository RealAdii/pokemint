import { useRef, useState, useEffect } from "react";
import { Entity, Scene } from "aframe-react";
import { useLocation, useNavigate } from "react-router-dom";
import { ReclaimProofRequest } from "@reclaimprotocol/js-sdk";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import styles from "./CollectCoin.module.css";
import { BACKEND_API_URL } from "../../utils/constants";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { storage } from "../../../firebase";

const CollectCoin = () => {
  const { user } = useDynamicContext();
  const fetchedUserData = useRef(null);
  const transactionTaskId = useRef(null);

  console.log({ user, transactionTaskId });

  const navigate = useNavigate();

  const [loading, setLoading] = useState({ value: false, message: "" });
  const [clickedImage, setClickedImage] = useState({
    visible: false,
    url: null,
  });

  useEffect(() => {
    if (user && !fetchedUserData.current) {
      getUserDataFromDB(user?.userId);
    }
  }, [user]);

  const getUserDataFromDB = async (userId) => {
    try {
      setLoading({ value: true, message: "Fetching user data..." });
      const response = await fetch(
        `${BACKEND_API_URL}/users/get-user/${userId}`
      );
      const data = await response.json();
      console.log({ data, response });
      fetchedUserData.current = data?.data || null;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading({ value: false, message: "" });
    }
  };

  const verifyUser = async (userId) => {
    try {
      setLoading({ value: true, message: "Verifying user..." });
      const response = await fetch(
        `${BACKEND_API_URL}/users/verify-user/${userId}`
      );
      const data = await response.json();
      console.log({ data, response });
      fetchedUserData.current = {
        ...fetchedUserData.current,
        isVerified: true,
      };
    } catch (error) {
      console.log(error);
    } finally {
      setLoading({ value: false, message: "" });
    }
  };

  const holdMoneyInEscrow = async () => {
    try {
      setLoading({ value: true, message: "Holding money in wallet..." });
      const payload = {
        token:
          coin?.tokenAddress ?? "0xB47c748CBe68Efcc918439ED5367a225cF3937a9",
        recipient:
          user?.verifiedCredentials?.[0]?.address ??
          "0xd2C475236F53209AE8AD2595B0e68475f9cB7881",
        amount: 999999,
      };
      console.log({ payload });
      const response = await fetch(`${BACKEND_API_URL}/escrow/create-task`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      transactionTaskId.current = data?.transactionHash?.taskId;
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    } finally {
      setLoading({ value: false, message: "" });
    }
  };

  let coinImageUrl =
    "https://firebasestorage.googleapis.com/v0/b/bgc-inside-out.appspot.com/o/memego%2Fsize.svg?alt=media&token=aaf15c74-dfad-4299-a446-8682456d3e27";

  const coin = useLocation().state?.coin;
  console.log({ coin });

  if (coin?.symbol === "BossBaby") {
    coinImageUrl =
      "https://firebasestorage.googleapis.com/v0/b/bgc-inside-out.appspot.com/o/pokemint%2Fboss-modified.png?alt=media&token=5189e619-9001-40ea-a777-d97cfed213e7";
  } else if (coin?.symbol === "ADII") {
    coinImageUrl =
      "https://firebasestorage.googleapis.com/v0/b/bgc-inside-out.appspot.com/o/pokemint%2Fadii-modified.png?alt=media&token=a7ea7788-23a5-4d19-8fad-4044c1347a42";
  } else if (coin?.symbol === "SJD") {
    coinImageUrl =
      "https://firebasestorage.googleapis.com/v0/b/bgc-inside-out.appspot.com/o/pokemint%2Fsjd-modified.png?alt=media&token=0f72877f-d4a2-449f-9fac-8c173a3e5cce";
  }

  const arContainerRef = useRef(null);

  const getVerificationReq = async () => {
    // Your credentials from the Reclaim Developer Portal
    // Replace these with your actual credentials
    console.log("here....");
    const APP_ID = import.meta.env.VITE_RECLAIM_APP_ID;
    const APP_SECRET = import.meta.env.VITE_RECLAIM_APP_SECRET;
    const PROVIDER_ID = import.meta.env.VITE_RECLAIM_PROVIDER_ID;

    // Initialize the Reclaim SDK with your credentials
    const reclaimProofRequest = await ReclaimProofRequest.init(
      APP_ID,
      APP_SECRET,
      PROVIDER_ID
    );

    // Generate the verification request URL
    const requestUrl = await reclaimProofRequest.getRequestUrl();
    console.log("Request URL:", requestUrl);
    setLoading({ value: true, message: "Waiting for verification..." });
    window.open(requestUrl, "_blank", "noopener,noreferrer");

    // Start listening for proof submissions
    await reclaimProofRequest.startSession({
      // Called when the user successfully completes the verification
      onSuccess: async (proofs) => {
        if (proofs) {
          if (typeof proofs === "string") {
            // When using a custom callback url, the proof is returned to the callback url and we get a message instead of a proof
            console.log("SDK Message:", proofs);
          } else if (typeof proofs !== "string") {
            // When using the default callback url, we get a proof object in the response
            console.log("Verification success", proofs?.claimData.context);
          }
        }
        setLoading({ value: false, message: "" });
        await verifyUser(user?.userId);
        alert("You can now collect the coin");
        // Add your success logic here, such as:
        // - Updating UI to show verification success
        // - Storing verification status
        // - Redirecting to another page
      },
      // Called if there's an error during verification
      onError: (error) => {
        console.error("Verification failed", error);
        setLoading({ value: false, message: "" });
        alert("something went wrong...");
      },
    });
  };

  const resizeCanvas = (origCanvas, width, height) => {
    let resizedCanvas = document.createElement("canvas");
    let resizedContext = resizedCanvas.getContext("2d");

    resizedCanvas.height = height;
    resizedCanvas.width = width;

    resizedContext.drawImage(origCanvas, 0, 0, width, height);
    return resizedCanvas.toDataURL();
  };

  const captureVideoFrame = (video, format, width, height) => {
    if (typeof video === "string") {
      const videoList = document.querySelectorAll("video");
      video = videoList[videoList?.length - 1];
    }

    format = format || "jpeg";

    if (!video || (format !== "png" && format !== "jpeg")) {
      return false;
    }

    var canvas = document.createElement("CANVAS");

    canvas.width = width || video.videoWidth;
    canvas.height = height || video.videoHeight;

    canvas.getContext("2d").drawImage(video, 0, 0);
    var dataUri = canvas.toDataURL("image/" + format);
    var data = dataUri.split(",")[1];
    var mimeType = dataUri.split(";")[0].slice(5);

    var bytes = window.atob(data);
    var buf = new ArrayBuffer(bytes.length);
    var arr = new Uint8Array(buf);

    for (var i = 0; i < bytes.length; i++) {
      arr[i] = bytes.charCodeAt(i);
    }

    var blob = new Blob([arr], { type: mimeType });
    return {
      blob: blob,
      dataUri: dataUri,
      format: format,
      width: canvas.width,
      height: canvas.height,
    };
  };

  const captureImage = async () => {
    try {
      const videoList = document.querySelectorAll("video");
      const video = videoList[videoList?.length - 1];
      video?.pause();

      let aScene = document
        .querySelector("a-scene")
        .components.screenshot.getCanvas("perspective");

      let frame = captureVideoFrame("video", "png");

      aScene = resizeCanvas(aScene, frame.width, frame.height);

      frame = frame.dataUri;

      mergeImages([frame, aScene]).then(async (b64) => {
        setClickedImage({ visible: true, url: b64 });
        console.log({ fetchedUserData: fetchedUserData.current }, "???");
        if (!fetchedUserData.current?.isVerified) {
          alert(
            "Your coin has been kept on hold and it's safe. Please verify your account to collect the coin"
          );
        } else {
          alert("You are already verified, you can collect the coin directly");
        }
        await holdMoneyInEscrow();
        console.log({ b64 });
      });

      video?.removeAttribute("src"); // empty source
      video?.load();
      video?.remove();
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  const handleRetake = () => {
    setClickedImage({ visible: false, url: null });
  };

  const handleUpload = async () => {
    try {
      setLoading({
        value: true,
        message: "Uploading image and claiming coin...",
      });
      const url = `pokemint/${coin?.coinId ?? Date.now()}-${Date.now()}.png`;
      const storageRef = ref(storage, url);
      const uploadData = await uploadString(
        storageRef,
        clickedImage.url,
        "data_url"
      );
      const uploadedUrl = await getDownloadURL(uploadData.ref);
      const payload = {
        coinDetails: coin ?? {},
        uploadUrl: uploadedUrl,
        walletAddress: user?.verifiedCredentials?.[0]?.address,
        taskId: transactionTaskId.current,
        userId: user?.userId,
      };
      console.log({ payload }, "???");
      const response = await fetch(`${BACKEND_API_URL}/escrow/complete-task`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      console.log({ result, response });
      if (response.status !== 200) {
        throw new Error(result.message);
      }
      alert("Coin Claimed Successfully");

      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
      setLoading({ value: false, message: "" });
    }
  };

  return (
    <div className={styles.container}>
      {loading.value && (
        <div className={styles.loading}>
          <img
            src={"../../assets/loading.gif"}
            alt="loading"
            style={{ width: "100px", height: "100px" }}
          />
          <p>{loading?.message || ""}</p>
          <p>Please wait...</p>
        </div>
      )}

      <div className={styles.arOuterContainer}>
        <div
          className={`${styles.arInnerContainer} ar-container`}
          ref={arContainerRef}
        >
          {!clickedImage.visible ? (
            <Scene
              vr-mode-ui="enabled: false"
              arjs="sourceType: webcam; videoTexture: true; debugUIEnabled: false;"
              embedded
            >
              <Entity primitive="a-assets">
                <img
                  id="logo1"
                  src={coinImageUrl}
                  preload="auto"
                  crossOrigin="anonymous"
                />
              </Entity>
              <Entity primitive="a-camera" rotation-reader></Entity>
              <Entity
                primitive="a-image"
                src="#logo1"
                width={10}
                height={10}
                position={`${-2} ${0} ${-20}`}
                visible={`true`}
              ></Entity>
            </Scene>
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                overflow: "hidden",
              }}
            >
              <img
                src={clickedImage.url}
                alt="clicked image"
                style={{
                  width: "100%",
                  height: "100%",
                  display: "block",
                  margin: "auto",
                  // objectFit: "cover",
                }}
              />
            </div>
          )}
        </div>
      </div>
      <div className={styles.arButtonsContainer}>
        {clickedImage.visible ? (
          <>
            <button
              className={`${styles.arButton} ${styles.discardButton}`}
              onClick={handleRetake}
            >
              Discard
            </button>
            {fetchedUserData.current?.isVerified ? (
              <button
                className={`${styles.arButton} ${styles.collectButton}`}
                onClick={handleUpload}
              >
                Collect Coin
              </button>
            ) : (
              <button
                className={`${styles.arButton} ${styles.collectButton}`}
                onClick={getVerificationReq}
              >
                Verify Yourself
              </button>
            )}
          </>
        ) : (
          <button className={`${styles.arButton}`} onClick={captureImage}>
            Capture
          </button>
        )}
      </div>
    </div>
  );
};

export default CollectCoin;
