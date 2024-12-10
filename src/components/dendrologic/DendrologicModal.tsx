import React, { useEffect, useRef, useState } from "react";
import {
  IonButtons,
  IonButton,
  IonModal,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonItem,
  IonFabButton,
  IonImg,
} from "@ionic/react";
import { Camera, Check, X } from "lucide-react";
import { CapacitorHttp } from "@capacitor/core";
import { api_url } from "@/lib/config";
import { usePhotoGallery } from "@/hooks/usePhotoGallery";

export default function DendrologicModal({ selectedFeature, close }) {
  const modal = useRef<HTMLIonModalElement>(null);
  const [selected, setSelected] = useState<null | any>(null);

  function selectFeature(feature) {
    setSelected(feature);
  }

  return (
    <IonModal ref={modal} isOpen={!!selectedFeature}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton
              onClick={() => {
                setSelected(null);
                close();
              }}
            >
              <X />
            </IonButton>
          </IonButtons>
          <IonTitle>Informace</IonTitle>
          <IonButtons slot="end">
            <IonButton strong={true} onClick={() => confirm()}>
              <Check />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      {selected && selectedFeature ? (
        <ItemModal modal={modal} selectedFeature={selected} />
      ) : (
        <ScrollModal
          selectFeature={selectFeature}
          features={selectedFeature?.features}
        />
      )}
    </IonModal>
  );
}

function ItemModal({ modal, selectedFeature }) {
  const { takePhoto } = usePhotoGallery();
  const [data, setData] = useState<null | any>(null);
  const [loading, setLoading] = useState(true);
  console.log(selectedFeature);

  const fetchData = async () => {
    try {
      const imageData = await CapacitorHttp.request({
        method: "GET",
        url: `${api_url}/api/images/${selectedFeature.values_.KOD}`,
        headers: {
          "Content-Type": "application/json",
        },
      });

      const imagesRes = await imageData.data;
      if (imagesRes.success) {
        setData(imagesRes.images[0]);
      }
      // Get data

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    selectedFeature && fetchData();
  }, [selectedFeature]);

  return (
    <IonContent className="ion-padding">
      <IonFabButton
        onClick={async () => {
          const res = await takePhoto(selectedFeature?.values_?.KOD);
          if (res) {
            modal.current?.dismiss();
          }
        }}
        className="camera-button"
      >
        <Camera />
      </IonFabButton>
      <IonItem>
        <h2>{selectedFeature?.values_?.NAZEV}</h2>
      </IonItem>
      <IonItem>
        {data &&
          data.images &&
          data?.images.map((image, i) => (
            <IonImg
              key={i}
              src={"https://minio.stencukpage.com/dendrologic-bucket/" + image}
            />
          ))}
      </IonItem>
    </IonContent>
  );
}

function ScrollModal({ features, selectFeature }) {

  const [loadedFeatures, setLoadedFeatures] = useState<null | any>(features.slice(0, 20));

  return (
    <IonContent className="ion-padding">
      {loadedFeatures.map((feature, i) => (
        <div key={i}>
          <IonItem
            onClick={() => {
              selectFeature(feature);
            }}
          >
            {feature.values_.NAZEV} - {feature.values_.KOD}
          </IonItem>
          {(loadedFeatures.length - 1 === i && features.length > loadedFeatures.length) && (
            <div className="p-4 w-full flex items-center justify-center">
            <IonButton
              onClick={() => {
                setLoadedFeatures([...loadedFeatures, ...features.slice(loadedFeatures.length, loadedFeatures.length + 20)]);
              }}
            >
              Zobrazit další
            </IonButton>
            </div>
          )}
        </div>
      ))}
    </IonContent>
  );
}
