import React, { useEffect } from "react";
import Map from "ol/Map.js";
import View from "ol/View.js";
import "./Geolocation.css";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style.js";
import GeoJSON from "ol/format/GeoJSON.js";
import { OSM, Vector as VectorSource } from "ol/source.js";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer.js";
import { click } from "ol/events/condition.js";
import Select from "ol/interaction/Select.js";
import DendrologicModal from "./dendrologic/DendrologicModal";
import { simplify } from "@turf/turf";
import Cluster from "ol/source/Cluster";
import { transform } from "ol/proj";

export default function OpenLayers({ geoJSONData }) {
  const image = new CircleStyle({
    radius: 5,
    fill: null,
    stroke: new Stroke({ color: "blue", width: 11 }),
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
        color: "blue",
        lineDash: [4],
        width: 3,
      }),
      fill: new Fill({
        color: "rgba(0, 0, 255, 0.1)",
      }),
    }),
    GeometryCollection: new Style({
      stroke: new Stroke({
        color: "magenta",
        width: 2,
      }),
      fill: new Fill({
        color: "magenta",
      }),
      image: new CircleStyle({
        radius: 10,
        fill: null,
        stroke: new Stroke({
          color: "magenta",
        }),
      }),
    }),
    Circle: new Style({
      stroke: new Stroke({
        color: "blue",
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
    null,
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
        },
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
        center: transform([15.243629268374999, 49.272716766783859], 'EPSG:4326', 'EPSG:3857'),
        zoom: 7,
      }),
    });
    const selectClick = new Select({
      condition: click,
    });
    map.addInteraction(selectClick);
    selectClick.on("select", function (e) {
      setSelectedFeature(e?.selected[0]?.getProperties());
      console.log(e, "hello", e?.selected[0]);
    });
  }, [geoJSONData]);

  function selectedFeatureToNull() {
    setSelectedFeature(null);
  }

  return (
    <>
      <div className="w-full min-h-screen" id="map">
        <DendrologicModal
          close={selectedFeatureToNull}
          selectedFeature={selectedFeature}
        />
      </div>
    </>
  );
}
