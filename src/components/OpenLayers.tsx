import React, { useEffect, useState } from "react";
import { simplify } from "@turf/turf";
import "./Geolocation.css";

import { Circle as CircleStyle, Fill, Stroke, Style, Text } from "ol/style.js";
import GeoJSON from "ol/format/GeoJSON.js";
import { OSM, Vector as VectorSource } from "ol/source.js";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer.js";
import { click } from "ol/events/condition.js";
import Select from "ol/interaction/Select.js";
import DendrologicModal from "./dendrologic/DendrologicModal";
import Cluster from "ol/source/Cluster";
import { transform } from "ol/proj";
import Map from "ol/Map.js";
import View from "ol/View.js";
import DendrologicSearch from "./dendrologic/DendrologicSearch";

export default function OpenLayers({ geoJSONData }) {
  const [selectEvent, setSelectEvent] = useState<null | Select>(null);
  const [selected, setSelected] = useState<null | any>(null);

  function selectFeature(feature) {
    setSelected(feature);
  }

  function colorIntensity(size) {
    if (size === 1) {
      return "#FFE599";
    } else if (size < 10) {
      return "#FFD966";
    } else if (size < 20) {
      return "#F4B183";
    } else if (size < 50) {
      return "#D24D27";
    } else {
      return "#A50026";
    }
  }

  const styleFunction = function (feature) {
    const size = feature.get("features").length;
    const styles = {
      Point: new Style({
        image: new CircleStyle({
          radius: 5,
          fill: new Fill({
            color: colorIntensity(size),
          }),
          stroke: new Stroke({
            color: colorIntensity(size),
            width: 5,
          }),
        }),
      }),
      Polygon: new Style({
        stroke: new Stroke({
          color: "var(--text-main-background-100)",
          lineDash: [4],
          width: 3,
        }),
        fill: new Fill({
          color: "var(--text-main-background-100)",
        }),
      }),
    };

    return styles[feature.getGeometry().getType()];
  };

  const [selectedFeature, setSelectedFeature] = React.useState<null | any>(
    null
  );

  useEffect(() => {
    const vectorSource = new VectorSource({
      features: new GeoJSON({
        featureProjection: "EPSG:3857",
      }).readFeatures(
        simplify(geoJSONData, { tolerance: 0.01, highQuality: false }),
        {
          dataProjection: "EPSG:4326",
          featureProjection: "EPSG:3857",
        }
      ),
    });

    const vectorLayer = new VectorLayer({
      source: new Cluster({
        distance: 40,
        source: vectorSource,
      }),
      style: styleFunction,
    });
    const map = new Map({
      target: "map",
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer,
      ],
      view: new View({
        center: transform(
          [15.243629268374999, 49.272716766783859],
          "EPSG:4326",
          "EPSG:3857"
        ),
        zoom: 7,
      }),
    });
    const selectClick = new Select({
      condition: click,
    });
    map.addInteraction(selectClick);
    selectClick.on("select", function (e) {
      e.preventDefault();
      setSelectedFeature(e?.selected[0]?.getProperties());
    });

    setSelectEvent(selectClick);

    return () => {
      map.dispose();
    };
  }, [geoJSONData]);

  function selectedFeatureToNull() {
    setSelectedFeature(null);
    selectEvent?.getFeatures().clear();
  }

  return (
    <>
      <div className="w-full min-h-screen" id="map">
        <DendrologicSearch
          selected={selected}
          selectFeature={selectFeature}
          geoJSONData={geoJSONData}
        />
        <DendrologicModal
          selectFeature={selectFeature}
          selected={selected}
          close={selectedFeatureToNull}
          selectedFeature={selectedFeature}
        />
      </div>
    </>
  );
}
