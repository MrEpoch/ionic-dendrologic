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
  const [data, setData] = useState<null | any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const imageData = await CapacitorHttp.request({
        method: "GET",
        url: `${api_url}/api/images/${selectedFeature.KOD}`,
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

  const { takePhoto } = usePhotoGallery();

  return (
    <IonModal ref={modal} isOpen={!!selectedFeature}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => close()}>
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
      <IonContent className="ion-padding">
        <IonFabButton
          onClick={async () => {
            const res = await takePhoto(selectedFeature?.KOD);
            if (res) {
              modal.current?.dismiss();
            }
          }}
          className="camera-button"
        >
          <Camera />
        </IonFabButton>
        <IonItem>
          <h2>{selectedFeature?.NAZEV}</h2>
        </IonItem>
        <IonItem>
          {data &&
            data.images &&
            data?.images.map((image, i) => (
              <IonImg
                key={i}
                src={
                  "https://minio.stencukpage.com/dendrologic-bucket/" + image
                }
              />
            ))}
        </IonItem>
      </IonContent>
    </IonModal>
  );
}
