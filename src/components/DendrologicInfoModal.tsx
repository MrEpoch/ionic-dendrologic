import React, { useRef } from "react";
import {
  IonButton,
  IonModal,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonPage,
  IonList,
  IonItem,
  IonLabel,
  IonAvatar,
  IonImg,
  IonSearchbar,
  IonFabButton,
  IonIcon,
} from "@ionic/react";
import { camera } from "ionicons/icons";
import { usePhotoGallery } from "../hooks/usePhotoGallery";
import { api_url } from "@/lib/config";

export default function DendrologicInfoModal({ isOpen, info, selectedFeature }) {
  const modal = useRef<HTMLIonModalElement>(null);
  const { photos, takePhoto } = usePhotoGallery();
  console.log(selectedFeature);

  return (
    <IonModal
      ref={modal}
      isOpen={isOpen}
      initialBreakpoint={0.25}
      breakpoints={[0, 0.25, 0.5, 0.75]}
    >
      <IonContent className="ion-padding">
        <IonList inset={true}>
            <IonItem key={selectedFeature?.id}>
              <IonFabButton onClick={async () => await takePhoto(info?.id, selectedFeature?.id)} className="camera-button">
                <IonIcon icon={camera} />
              </IonFabButton>
              <IonLabel>{selectedFeature?.name}</IonLabel>
            </IonItem>
        </IonList>
        {photos && photos.length > 0 && (
          <IonImg src={photos[0].webviewPath} />
        )}
        {selectedFeature && selectedFeature?.image.map((image, i) => (
          <IonImg src={"https://minio.stencukpage.com/dendrologic-bucket/" + image} />
        ))}
      </IonContent>
    </IonModal>
  );
}
