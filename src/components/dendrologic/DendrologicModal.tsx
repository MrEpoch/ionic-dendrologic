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
  IonFooter,
} from "@ionic/react";
import { Camera, Check, Grip, X } from "lucide-react";
import { CapacitorHttp } from "@capacitor/core";
import { api_url } from "@/lib/config";
import { usePhotoGallery } from "@/hooks/usePhotoGallery";
import { ItemModal, ScrollModal } from "./DendrologicSearch";

export default function DendrologicModal({ selectedFeature, close, selected, selectFeature }) {
  const modal = useRef<HTMLIonModalElement>(null);

  return (
    <IonModal
      className="rounded-lg shadow"
      onDidDismiss={() => {
        selectFeature(null);
        close();
      }}
      ref={modal}
      isOpen={!!selectedFeature}
    >
      <IonHeader className="rounded">
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton
              onClick={() => {
                selectFeature(null);
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
