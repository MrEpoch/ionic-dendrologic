import React, { useCallback, useEffect, useRef, useState } from "react";
import "./Geolocation.css";
import {
  GeoJSON,
  MapContainer,
  TileLayer,
  Tooltip,
  useMapEvent,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css"; // Re-uses images from ~leaflet package

import { Geolocation, Position } from "@capacitor/geolocation";
import { Dialog } from "@capacitor/dialog";

function AnimatedPanningElement() {
  const map = useMapEvent("click", (e: unknown) => {
    map.setView(e.latlng, map.getZoom(), {
      animate: true,
    });
  });
  return null;
}

// currentRequest = current one request, with geojson data, photos and more
// It should represent one instance for dendrologic mapping

export default function GeoLocationComponent({
  geoJSONdata,
  updateShown,
  selectFeature,
  location,
}) {
  {/*
  const [coordinates, setCoordinates] = useState<Position | null>(null);
  // no any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const codeStack = useRef<null | any>(null);
  const watchRef = useRef<string | null>(null);
  const GPSenabledRef = useRef<boolean>(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any

  const [hoverInfo, setHoverInfo] = useState(null);

  async function validateGPS() {
    const status = await checkIfGPSEnabled();
    if (status === false) {
      codeStack.current = null;
      await GPSwarning();
      GPSenabledRef.current = status;
    } else if (status === true && status !== GPSenabledRef.current) {
      codeStack.current = null;
      if (watchRef.current) {
        Geolocation.clearWatch({ id: watchRef.current });
        watchRef.current = null;
      }
      codeStack.current = await startWatchingPosition();
      GPSenabledRef.current = status;
    }
  }

  useEffect(() => {
    const interval = setInterval(validateGPS, 1000);
    console.log(geoJSONdata);

    return () => {
      if (typeof watchRef.current === "string") {
        Geolocation.clearWatch({ id: watchRef.current ?? "" });
        watchRef.current = null;
      }
      codeStack.current = null;

      clearInterval(interval);
    };
  }, []);

  async function startWatchingPosition() {
    try {
      if (watchRef.current === null) {
        const watchId = await Geolocation.watchPosition(
          {
            timeout: 10000,
            enableHighAccuracy: true,
          },
          WatchCallback,
        );

        watchRef.current = watchId;
      } else {
        await Geolocation.clearWatch({ id: watchRef.current });
        watchRef.current = null;
      }
    } catch {
      console.error("Yep, it happened in startWatchingPosition");
      await GPSwarning();
      GPSenabledRef.current = false;
    }
  }

  type watchError = {
    error: string;
  };

  function WatchCallback(position: Position | null, err: watchError | null) {
    // If error is present
    if (position) {
      setCoordinates(position);
    }

    console.log("Position = ", position, "Error = ", err);
  }

  async function checkIfGPSEnabled() {
    try {
      await Geolocation.checkPermissions();
      return true;
    } catch {
      console.error("No GPS available");
      return false;
    }
  }

  // Will make native alert
  async function GPSwarning() {
    await Dialog.alert({
      title: "GPS not enabled",
      message: "Please enable GPS in settings and reload app",
    });
  }

  */}

  return (
    <div className={"map-container"}>
    {/*
    {GPSenabledRef.current && location && (
  */}
        <MapContainer
          className="map-container"
          zoom={13}
          center={[location.x, location.y]}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <AnimatedPanningElement />
          {geoJSONdata && (
            <GeoJSON
              eventHandlers={{
                click: (geo: unknown) => {
                  console.log(geo);
                  updateShown();
                  selectFeature(geo?.layer?.feature?.properties);
                },
              }}
              data={geoJSONdata}
            ></GeoJSON>
          )}
        </MapContainer>
    {/*
      )}
      */}
    </div>
  );
}
