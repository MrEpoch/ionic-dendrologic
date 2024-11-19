import geoJsonData from "../../assets/stromy.json";
import OpenLayers from "../OpenLayers";

export default function GlobalDendrologic() {
  return (
    <>
      <OpenLayers geoJSONData={geoJsonData} />
    </>
  );
}
