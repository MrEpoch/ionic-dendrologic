import { RouteComponentProps } from "react-router";
import "./ExploreContainer.css";
import { z } from "zod";
import requests from "../temp.json";
import { IonFab, IonFabButton, IonIcon } from "@ionic/react";
import { add, mapOutline } from "ionicons/icons";
import React, { useMemo, useState } from "react";
import GeoLocationComponent from "./Geolocation";
import DendrologicDetailInfo from "./DendrologicDetailInfo";

const DendrologicRequestDetail: React.FC<RouteComponentProps> = ({
  match,
  history,
}) => {
  const zodValidateId = z.string().uuid();
  const [data, setData] = useState<any | null>(null);
  const [mapShown, setMapShown] = useState(false);

  function updateShown() {
    setMapShown(!mapShown);
  }

  useMemo(() => {
    const validateId = zodValidateId.safeParse(match?.params.id);
    if (!validateId.success) {
      history.replace("/tab1");
    }

    setData(
      requests.georequests.find((request) => request.id === validateId?.data),
    );
  }, []);

  useMemo(() => {
    console.log(data);
  }, [data]);

  return (
    <>
      <IonFab slot="fixed" vertical="top" horizontal="end">
        <IonFabButton onClick={() => setMapShown(!mapShown)}>
          <IonIcon icon={mapOutline}></IonIcon>
        </IonFabButton>
      </IonFab>

      <DendrologicDetailInfo shown={mapShown} info={data} />
      <GeoLocationComponent
        updateShown={updateShown}
        shown={mapShown}
        geoJSONdata={data?.geojson}
      />
    </>
  );
};

export default DendrologicRequestDetail;
