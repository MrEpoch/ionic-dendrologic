import React, { useRef } from "react";
import {
  IonModal,
  IonHeader,
  IonContent,
  IonImg,
  IonFabButton,
  IonIcon,
} from "@ionic/react";
import { camera } from "ionicons/icons";
import { usePhotoGallery } from "../hooks/usePhotoGallery";

export default function DendrologicInfoModal({ isOpen, info, selectedFeature }) {
  const modal = useRef<HTMLIonModalElement>(null);
  const { takePhoto } = usePhotoGallery();
  console.log(selectedFeature);

  return (
    <IonModal
      ref={modal}
      isOpen={isOpen}
      initialBreakpoint={0.25}
      breakpoints={[0, 0.25, 0.5, 0.75, 1]}
    >
      <IonContent className="ion-padding">
        <div className="flex justify-center gap-4 w-full items-center">
          <IonFabButton onClick={async () => await takePhoto(info?.id, selectedFeature?.id)} className="camera-button">
            <IonIcon icon={camera} />
          </IonFabButton>
          <IonHeader className="text-xl">{selectedFeature?.name}</IonHeader>
        </div>
        {selectedFeature && selectedFeature?.image.map((image, i) => (
          <IonImg src={"https://minio.stencukpage.com/dendrologic-bucket/" + image} />
        ))}
      </IonContent>
    </IonModal>
  );
}
