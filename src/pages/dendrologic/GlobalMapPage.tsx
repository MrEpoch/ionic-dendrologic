import GlobalDendrologic from "@/components/dendrologic/GlobalDendrologic";
import { IonPage } from "@ionic/react";

const GlobalMapPage = () => {
  return (
    <IonPage>
      <div className="flex gap-4 flex-col dark:bg-background bg-background h-full w-full">
        <GlobalDendrologic />
      </div>
    </IonPage>
  );
};

export default GlobalMapPage;
