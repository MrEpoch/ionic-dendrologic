import { useRef } from "react";
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

export default function DendrologicInfoModal({
  isOpen,
  info,
  selectedFeature,
  refetch,
}) {
  const modal = useRef<HTMLIonModalElement>(null);
  const { takePhoto } = usePhotoGallery();
  console.log("here");

  return (
    <IonModal
      ref={modal}
      isOpen={isOpen}
      initialBreakpoint={0.25}
      breakpoints={[0, 0.25, 0.5, 0.75, 1]}
    >
      <div className="p-4 rounded">
        <div className="flex rounded justify-center gap-4 w-full items-center">
          <IonFabButton
            onClick={async () => {
              const res = await takePhoto(info?.id, selectedFeature?.id);
              if (res) {
                refetch();
                modal.current?.dismiss();
              }
            }}
            className="camera-button"
          >
            <IonIcon icon={camera} />
          </IonFabButton>
          <IonHeader className="text-xl">{selectedFeature?.name}</IonHeader>
        </div>
        {selectedFeature &&
          selectedFeature?.image.map((image, i) => (
            <IonImg
              src={"https://minio.stencukpage.com/dendrologic-bucket/" + image}
            />
          ))}
      </div>
    </IonModal>
  );
}
