import { useRef, useState } from "react";
import { Entity, Scene } from "aframe-react";
import { useLocation } from "react-router-dom";
import styles from "./CollectCoin.module.css";

const CollectCoin = () => {
  const [loading, setLoading] = useState(false);
  const [clickedImage, setClickedImage] = useState({
    visible: false,
    url: null,
  });

  const coin = useLocation().state?.coin;
  console.log({ coin });

  const arContainerRef = useRef(null);

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

      mergeImages([frame, aScene]).then((b64) => {
        setClickedImage({ visible: true, url: b64 });
        setLoading(false);
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
    // try {
    //   setLoading(true);
    //   const url = `memego/${coin}.png`;
    //   const storageRef = ref(storage, url);
    //   const uploadData = await uploadString(
    //     storageRef,
    //     clickedImage.url,
    //     "data_url"
    //   );
    //   const uploadedUrl = await getDownloadURL(uploadData.ref);
    //   const payload = {
    //     lat: coin?.latitude,
    //     lng: coin?.longitude,
    //     id: coin?.id,
    //     coinType: coin?.name,
    //     uploadUrl: uploadedUrl,
    //     walletAddress: walletAddress,
    //   };
    //   console.log({ payload }, "???");
    //   const response = await fetch(`https://memego.onrender.com/api/contract`, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(payload),
    //   });
    //   const result = await response.json();
    //   console.log({ result, response });
    //   if (response.status !== 200) {
    //     throw new Error(result.message);
    //   }
    //   alert("Coin Claimed Successfully");
    //   setUploading(false);
    //   navigate("/dashboard");
    // } catch (error) {
    //   console.log(error);
    //   alert("Something went wrong");
    //   setUploading(false);
    // }
  };

  return (
    <div className={styles.container}>
      {loading && (
        <div className={styles.loading}>
          <img
            src={"../../assets/loading.gif"}
            alt="loading"
            style={{ width: "100px", height: "100px" }}
          />
          <p>Sending coin to your wallet...</p>
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
                  src={
                    "https://firebasestorage.googleapis.com/v0/b/bgc-inside-out.appspot.com/o/memego%2Fsize.svg?alt=media&token=aaf15c74-dfad-4299-a446-8682456d3e27"
                  }
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
            <button
              className={`${styles.arButton} ${styles.collectButton}`}
              onClick={handleUpload}
            >
              Collect Coin
            </button>
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
