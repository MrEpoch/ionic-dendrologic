import React, { useRef } from 'react';
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
} from '@ionic/react';
import { camera } from "ionicons/icons";
import { usePhotoGallery } from '../hooks/usePhotoGallery';

export default function DendrologicInfoModal({ isOpen, info }) {
  const modal = useRef<HTMLIonModalElement>(null);
  const { photos, takePhoto } = usePhotoGallery();

  return (
        <IonModal ref={modal} isOpen={isOpen} initialBreakpoint={0.25} breakpoints={[0, 0.25, 0.5, 0.75]}>
          <IonContent className="ion-padding">
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
        </IonModal>
  );
}
