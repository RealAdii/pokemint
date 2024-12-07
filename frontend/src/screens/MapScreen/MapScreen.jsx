import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { Threebox } from "threebox-plugin";
import { useNavigate } from "react-router-dom";
import styles from "./MapScreen.module.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { SJD_DEFAULT_LOCATION } from "../../utils/constants";
import { coinsData } from "../../utils/coins-data";
import { calculateDistance } from "../../utils/calculateDistance";

const MapScreen = () => {
  const [currentPosition, setCurrentPosition] = useState(SJD_DEFAULT_LOCATION);
  const [nearestCoinWithinRange, setNearestCoinWithinRange] = useState(null);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const userModelRef = useRef(null);

  console.log({ currentPosition });

  const navigate = useNavigate();

  const findNearestCoinWithinRange = ({ latitude, longitude }) => {
    let nearestCoin = null;
    let shortestDistance = Infinity;

    coinsData.forEach((coin) => {
      const distance = calculateDistance(
        latitude,
        longitude,
        coin.latitude,
        coin.longitude
      );

      if (distance <= 100 && distance < shortestDistance) {
        shortestDistance = distance;
        nearestCoin = { ...coin, distance };
      }
    });

    if (nearestCoin) {
      setNearestCoinWithinRange(nearestCoin);
    }

    return nearestCoin;
  };

  const handleDeviceMotion = (event) => {
    const tiltLR = event.gamma;
    const tiltFB = event.beta;

    // Update map bearing and pitch
    mapRef.current?.setBearing(tiltLR);
    mapRef.current?.setPitch(tiltFB);
  };

  const requestPermission1 = () => {
    if (
      window.DeviceOrientationEvent &&
      typeof window.DeviceOrientationEvent.requestPermission === "function"
    ) {
      window.DeviceOrientationEvent.requestPermission()
        .then((permissionState) => {
          if (permissionState === "granted") {
            window.addEventListener("deviceorientation", handleDeviceMotion);
          }
        })
        .catch(console.error);
    } else {
      // Handle regular non iOS 13+ devices
      window.addEventListener("deviceorientation", handleDeviceMotion);
    }
  };

  const requestPermission2 = () => {
    if (typeof DeviceMotionEvent?.requestPermission === "function") {
      DeviceMotionEvent.requestPermission()
        .then((permissionState) => {
          if (permissionState === "granted") {
            window.addEventListener("devicemotion", () => {});
          }
        })
        .catch(console.error);
    } else {
      // handle devices that don't need permission and those without a gyroscope
      window.addEventListener("devicemotion", () => {});
    }
  };

  useEffect(() => {
    requestPermission1();
    requestPermission2();
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapboxgl.accessToken =
      "pk.eyJ1Ijoic2FqamFkMjE5OTAiLCJhIjoiY20zajd1aGVzMDBzajJrcXp4czR0d21vayJ9.RKqt54M4uBEVCkmk2ir3PA";

    const initializeMap = (coords) => {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/light-v11",
        center: [coords.longitude, coords.latitude],
        zoom: 18,
        pitch: 64.9,
        bearing: 172.5,
        antialias: true,
      });

      mapRef.current.on("style.load", () => {
        if (!mapRef.current) return;

        const tbLayer = {
          id: "threebox-layer",
          type: "custom",
          renderingMode: "3d",
          onAdd: (map, gl) => {
            window.tb = new Threebox(map, gl, { defaultLights: true });

            const scale = 14;
            const options = {
              obj: "/assets/ash_ketchum.glb",
              type: "gltf",
              scale: { x: scale, y: scale, z: scale },
              units: "meters",
              rotation: { x: 90, y: -90, z: 0 },
            };

            window.tb.loadObj(options, (model) => {
              model.setCoords([coords.longitude, coords.latitude]);
              model.setRotation({ x: 0, y: 0, z: 241 });
              window.tb.add(model);
              userModelRef.current = model;
            });

            coinsData.forEach((cData, index) => {
              const el = document.createElement("div");
              el.className = "marker";
              el.style.width = "40px";
              el.style.height = "40px";
              el.style.backgroundSize = "100%";
              el.style.border = "none";
              el.style.borderRadius = "50%";
              el.style.cursor = "pointer";
              // console.log(cData.symbol);
              if (cData.symbol === "BossBaby") {
                el.style.backgroundImage =
                  "url(https://firebasestorage.googleapis.com/v0/b/bgc-inside-out.appspot.com/o/pokemint%2Fboss-modified.png?alt=media&token=5189e619-9001-40ea-a777-d97cfed213e7)";
              } else if (cData.symbol === "@ADII") {
                el.style.backgroundImage =
                  "url(https://firebasestorage.googleapis.com/v0/b/bgc-inside-out.appspot.com/o/pokemint%2Fadii-modified.png?alt=media&token=a7ea7788-23a5-4d19-8fad-4044c1347a42)";
              } else {
                el.style.backgroundImage =
                  "url(https://firebasestorage.googleapis.com/v0/b/bgc-inside-out.appspot.com/o/pokemint%2Fsjd-modified.png?alt=media&token=0f72877f-d4a2-449f-9fac-8c173a3e5cce)";
              }

              el.addEventListener("click", () => {
                console.log(`Coin ${index + 1} clicked at`, cData);
              });

              new mapboxgl.Marker(el)
                .setLngLat([cData.longitude, cData.latitude])
                .addTo(mapRef.current);
            });
          },
          render: () => {
            window.tb.update();
          },
        };

        mapRef.current.addLayer(tbLayer);

        navigator.geolocation.watchPosition(
          (position) => {
            const { longitude, latitude, heading } = position.coords;
            setCurrentPosition({ latitude, longitude });
            findNearestCoinWithinRange({
              latitude,
              longitude,
            });
            // checkNearestCoin(latitude, longitude);

            if (userModelRef.current) {
              userModelRef.current.setCoords([longitude, latitude]);
              if (heading !== null) {
                userModelRef.current.setRotation({ x: 0, y: 0, z: -heading });
              }
            }

            mapRef.current?.flyTo({
              center: [longitude, latitude],
              speed: 0.5,
            });
          },
          (error) => {
            console.warn("Error watching position:", error);
          },
          { enableHighAccuracy: true }
        );
      });
    };

    const timeoutDuration = 5000;
    let locationTimeout;

    if ("geolocation" in navigator) {
      locationTimeout = setTimeout(() => {
        console.log("Geolocation timed out, using default location");
        initializeMap(SJD_DEFAULT_LOCATION);
      }, timeoutDuration);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          clearTimeout(locationTimeout);
          initializeMap({
            longitude: position.coords.longitude,
            latitude: position.coords.latitude,
          });
          findNearestCoinWithinRange({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          clearTimeout(locationTimeout);
          console.warn("Geolocation error:", error);
          initializeMap(SJD_DEFAULT_LOCATION);
        },
        { timeout: timeoutDuration }
      );
    } else {
      console.log("Geolocation not supported, using default location");
      initializeMap(SJD_DEFAULT_LOCATION);
    }

    return () => {
      clearTimeout(locationTimeout);
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  const handleCollectCoin = () => {
    if (nearestCoinWithinRange) {
      navigate("/collect-coin", { state: { coin: nearestCoinWithinRange } });
    }
  };

  return (
    <div className={styles.mapScreen} ref={mapContainerRef}>
      <button
        disabled={!nearestCoinWithinRange}
        className={styles.collectCoinButton}
        onClick={handleCollectCoin}
      >
        Collect Coin
      </button>
    </div>
  );
};

export default MapScreen;
