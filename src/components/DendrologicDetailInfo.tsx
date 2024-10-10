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

export default function DendrologicDetailInfo({ info, shown }) {
  function handleCamera() {}

  return (
    <>
      {shown && (
        <IonContent color="light">
          <IonList inset={true}>
            {info?.geojson?.features.map(({ properties }) => (
              <IonItem>
                <IonFabButton onClick={handleCamera} className="camera-button">
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
