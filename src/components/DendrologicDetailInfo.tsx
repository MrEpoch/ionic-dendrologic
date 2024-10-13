import {
  IonContent,
  IonFabButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
} from "@ionic/react";
import React from "react";
import { camera } from "ionicons/icons";
import "./Geolocation.css";
import { usePhotoGallery } from "../hooks/usePhotoGallery";

export default function DendrologicDetailInfo({ info, shown }) {
  function handleCamera() {}

  const { photos, takePhoto } = usePhotoGallery();


  return (
    <>
      {shown && (
        <IonContent color="light">
          <IonList inset={true}>
            {info?.geojson?.features.map(({ properties }) => (
              <IonItem key={properties.id}>
                <IonFabButton onClick={takePhoto} className="camera-button">
                  <IonIcon icon={camera} />
                </IonFabButton>
                <IonLabel>{properties.name}</IonLabel>
              </IonItem>
            ))}
          </IonList>
        </IonContent>
      )}
    </>
  );
}
