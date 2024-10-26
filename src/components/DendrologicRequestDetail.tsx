import { RouteComponentProps } from "react-router";
import { z } from "zod";
import requests from "../temp.json";
import React, { useMemo, useState } from "react";
import GeoLocationComponent from "./Geolocation";
import DendrologicInfoModal from "./DendrologicInfoModal";

const DendrologicRequestDetail: React.FC<RouteComponentProps> = ({
  match,
  history,
}) => {
  const zodValidateId = z.string().uuid();
  const [data, setData] = useState<any | null>(null);
  const [selectedData, setSelectedData] = useState<any | null>(null);
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
      {/*
      <IonFab slot="fixed" vertical="top" horizontal="end">
        <IonFabButton onClick={() => setMapShown(!mapShown)}>
          <IonIcon icon={mapOutline}></IonIcon>
        </IonFabButton>
      </IonFab>
      <DendrologicDetailInfo shown={mapShown} info={data} />
    */}
      <GeoLocationComponent
        updateShown={updateShown}
        selectData={setSelectedData}
        shown={mapShown}
        location={data?.location}
        geoJSONdata={data?.geojson}
      />
      <DendrologicInfoModal info={data} isOpen={mapShown} />
    </>
  );
};

export default DendrologicRequestDetail;
