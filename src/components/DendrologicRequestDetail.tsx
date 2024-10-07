import { RouteComponentProps } from "react-router";
import "./ExploreContainer.css";
import { z } from "zod";
import requests from "../temp.json";
import React, { useMemo, useState } from "react";
import GeoLocationComponent from "./Geolocation";

const DendrologicRequestDetail: React.FC<RouteComponentProps> = ({
  match,
  history,
}) => {
  const zodValidateId = z.string().uuid();
  const [data, setData] = useState<any | null>(null);

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

      <GeoLocationComponent geoJSONdata={data?.geojson} />
    </>
  );
};

export default DendrologicRequestDetail;
