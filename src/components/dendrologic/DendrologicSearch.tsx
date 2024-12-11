import { IonButton, IonContent, IonFab, IonFabButton, IonFooter, IonItem, IonModal, IonSearchbar, IonToolbar } from "@ionic/react";
import { Camera, Grip, Search } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { usePhotoGallery } from "@/hooks/usePhotoGallery";
import { api_url } from "@/lib/config";
import { CapacitorHttp } from "@capacitor/core";

export default function DendrologicSearch({ geoJSONData, selectFeature, selected }) {
  const [showSearchBar, setShowSearchBar] = useState<boolean>(false);
  const [filteredResults, setFilteredResults] = useState<any[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const modal = useRef<HTMLIonModalElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (searchText.length > 3) {
        const filtered = geoJSONData?.features.filter((feature) => {
          return feature?.properties?.NAZEV
            .toLowerCase()
            .includes(searchText.toLowerCase());
        });
        setFilteredResults(filtered);
      } else {
        setFilteredResults([]);
      }
    };
    fetchData();
  }, [searchText]);

  return (
    <div>
      <IonFab slot="fixed" vertical="top" horizontal="end">
        <IonFabButton
          onClick={() => setShowSearchBar(true)}
          className="search-button"
        >
          <Search />
        </IonFabButton>
      </IonFab>
      <IonModal
        isOpen={showSearchBar}
    onDidDismiss={() => {
      setShowSearchBar(false)
      setSearchText("")
      setFilteredResults([])
      selectFeature(null)
    }}
        ref={modal}
      >
        <IonSearchbar debounce={500} onIonInput={(e) => {
          setSearchText(e?.target?.value ?? "")}}></IonSearchbar>
      {selected ? (
        <ItemModal modal={modal} selectedFeature={selected} />
      ) : (
        <ScrollModal
          selectFeature={selectFeature}
          features={filteredResults}
        />
      )}

      </IonModal>
    </div>
  );
}

export function ItemModal({ modal, selectedFeature }) {
  const { takePhoto } = usePhotoGallery();
  const [data, setData] = useState<null | any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const imageData = await CapacitorHttp.request({
        method: "GET",
        url: `${api_url}/api/images/${selectedFeature && selectedFeature?.properties ? selectedFeature?.properties?.KOD : selectedFeature?.values_ ? selectedFeature?.values_?.KOD : ""}`,
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
    <div className="flex flex-col h-full p-4">
      <IonContent>
        <div className="block">
          {data ? (
            data.images ? (
              data.images.map((image, i) => (
                <img
                  key={i}
                  className="h-56 w-full rounded-bl-3xl rounded-tr-3xl object-cover sm:h-64 lg:h-72"
                  src={
                    "https://minio.stencukpage.com/dendrologic-bucket/" + image
                  }
                />
              ))
            ) : (
              <div className="h-56 w-full rounded-bl-3xl rounded-tr-3xl object-cover sm:h-64 lg:h-72">
                <Grip />{" "}
              </div>
            )
          ) : (
            <div className="h-56 bg-muted flex items-center justify-center w-full rounded-bl-3xl rounded-tr-3xl object-cover sm:h-64 lg:h-72">
              <Grip className="w-full h-full" />
            </div>
          )}

          <div className="mt-4 sm:flex sm:items-center sm:justify-center sm:gap-4">
            <strong className="font-medium">
    {selectedFeature && selectedFeature?.properties ?  selectedFeature?.properties?.NAZEV : selectedFeature?.values_ ? selectedFeature?.values_?.NAZEV : ""}
            </strong>

            <span className="hidden sm:block sm:h-px sm:w-8 sm:bg-primary"></span>

            <p className="mt-0.5 opacity-50 sm:mt-0">
    {selectedFeature && selectedFeature?.properties ? selectedFeature?.properties?.KOD : selectedFeature?.values_ ? selectedFeature?.values_?.KOD : ""}
            </p>
          </div>
        </div>
      </IonContent>
      <IonFooter className="rounded-lg flex justify-center">
        <IonToolbar className="rounded-lg w-full">
          <div className="flex items-center justify-center w-full">
            <IonFabButton
              onClick={async () => {
                const res = await takePhoto(selectedFeature?.values_?.KOD);
                if (res) {
                  modal.current?.dismiss();
                }
              }}
              className="bg-muted camera-button"
            >
              <Camera />
            </IonFabButton>
          </div>
        </IonToolbar>
      </IonFooter>
    </div>
  );
}

export function ScrollModal({ features, selectFeature }) {
  const [loadedFeatures, setLoadedFeatures] = useState<null | any>(null);

  useEffect(() => {
    if (features !== undefined && features !== null && features.length > 0) {
      setLoadedFeatures(features.slice(0, 20));
    }

    return () => {
      setLoadedFeatures(null);
    };
  }, [features]);

  return (
    <IonContent className="w-full h-full ion-padding">
      <div className="flex flex-col gap-4">
    {loadedFeatures?.map((feature, i: number) => (
        <div key={i} className="">
          <IonItem
        className="w-full rounded-lg cursor-pointer"
            onClick={() => {
              selectFeature(feature);
            }}
          >
      {feature && feature.properties ? feature.properties?.NAZEV : feature.values_ ? feature.values_?.NAZEV : ""} - {feature && feature.properties ? feature.properties?.KOD : feature.values_ ? feature.values_?.KOD : ""}
          </IonItem>
          {loadedFeatures.length - 1 === i &&
            features?.length > loadedFeatures.length && (
              <div className="p-4 w-full flex items-center justify-center">
                <IonButton
                  onClick={() => {
                    setLoadedFeatures([
                      ...loadedFeatures,
                      ...features?.slice(
                        loadedFeatures.length,
                        loadedFeatures.length + 20,
                      ),
                    ]);
                  }}
                >
                  Zobrazit další
                </IonButton>
              </div>
            )}
        </div>
      ))}
    </div>
    </IonContent>
  );
}
