import { RouteComponentProps, useHistory } from "react-router";
import { z } from "zod";
import React, { useEffect, useMemo, useRef, useState } from "react";
import GeoLocationComponent from "./Geolocation";
import DendrologicInfoModal from "./DendrologicInfoModal";
import { CapacitorHttp } from "@capacitor/core";
import { api_url } from "@/lib/config";
import geoJsonData from "../assets/stromy.json";
import OpenLayers from "./OpenLayers";
import Loading from "./Loading";

const DendrologicRequestDetail: React.FC<RouteComponentProps> = ({ match }) => {
  const zodValidateId = z.string().length(36);

  function updateShown() {
    setMapShown(!mapShown);
  }

  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const loadingData = useRef(false);
  const [data, setData] = useState<null | any>(null);
  const [mapShown, setMapShown] = useState(false);
  const [selected, setSelected] = useState<null | any>(null);

  function selectFeature(feature) {
    setSelected(feature);
    updateShown();
  }

  const fetchData = async () => {
    try {
      // Check rate limit
      const validateId = zodValidateId.safeParse(match?.params?.id);
      if (!validateId.success) {
        return history.push("/main/requests");
      }

      console.log("fetch");
      const geoData = await CapacitorHttp.request({
        method: "GET",
        url: `${api_url}/api/geo-requests/${validateId.data}`,
        headers: {
          "Content-Type": "application/json",
        },
      });

      const geoDataRes = await geoData.data;
      console.log(geoDataRes);
      if (!geoDataRes.success) {
        if (geoDataRes.redirect) return history.push(geoDataRes.redirect);
        return history.push("/");
      }

      console.log(geoJsonData);
      setData({
        geojson: geoJsonData,
      });

      // Get data

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loadingData.current) {
      console.log("run");
      loadingData.current = true;
      fetchData();
    }
  }, []);

  if (loading) return <Loading />;

  return (
    <>
      {/*
      <IonFab slot="fixed" vertical="top" horizontal="end">
        <IonFabButton onClick={() => setMapShown(!mapShown)}>
          <IonIcon icon={mapOutline}></IonIcon>
        </IonFabButton>
      </IonFab>
      <DendrologicDetailInfo shown={mapShown} info={data} />
    */}
      <OpenLayers geoJSONData={data?.geojson} />
      {/*
      <GeoLocationComponent
        updateShown={updateShown}
        shown={mapShown}
        selectFeature={selectFeature}
        location={data?.location}
        geoJSONdata={data?.geojson}
      />
      <DendrologicInfoModal
        refetch={fetchData}
        info={data}
        selectedFeature={selected}
        isOpen={mapShown}
      />
    */}
    </>
  );
};

export default DendrologicRequestDetail;
