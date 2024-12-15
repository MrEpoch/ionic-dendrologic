import React, { useEffect, useState } from "react";
import { simplify } from "@turf/turf";
import "./Geolocation.css";

import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style.js";
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

  const image = new CircleStyle({
    radius: 5,
    stroke: new Stroke({ color: "#0D2617", width: 11 }),
  });

  const styles = {
    Point: new Style({
      image: image,
    }),
    Geometry: new Style({
      image: image,
    }),
    LineString: new Style({
      stroke: new Stroke({
        color: "green",
        width: 1,
      }),
    }),
    MultiLineString: new Style({
      stroke: new Stroke({
        color: "green",
        width: 1,
      }),
    }),
    MultiPoint: new Style({
      image: image,
    }),
    MultiPolygon: new Style({
      stroke: new Stroke({
        color: "yellow",
        width: 1,
      }),
      fill: new Fill({
        color: "rgba(255, 255, 0, 0.1)",
      }),
    }),
    Polygon: new Style({
      stroke: new Stroke({
        color: "green",
        lineDash: [4],
        width: 3,
      }),
      fill: new Fill({
        color: "rgba(0, 0, 255, 0.1)",
      }),
    }),
    GeometryCollection: new Style({
      stroke: new Stroke({
        color: "green",
        width: 2,
      }),
      fill: new Fill({
        color: "green",
      }),
      image: new CircleStyle({
        radius: 10,
        stroke: new Stroke({
          color: "green",
        }),
      }),
    }),
    Circle: new Style({
      stroke: new Stroke({
        color: "green",
        width: 2,
      }),
      fill: new Fill({
        color: "rgba(255,0,0,0.2)",
      }),
    }),
  };

  const styleFunction = function (feature) {
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
