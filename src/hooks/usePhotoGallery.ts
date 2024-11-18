import { useState, useEffect } from "react";
import { isPlatform } from "@ionic/react";

import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from "@capacitor/camera";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Preferences } from "@capacitor/preferences";
import { Capacitor, CapacitorHttp } from "@capacitor/core";
import { useHistory } from "react-router-dom";
import { SecureStoragePlugin } from "capacitor-secure-storage-plugin";
import { api_url, sessionName } from "@/lib/config";

export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}

const PHOTO_STORAGE = "photos";

export function usePhotoGallery() {
  const [photos, setPhotos] = useState<UserPhoto[]>([]);
  const history = useHistory();

  const savePicture = async (
    photo: Photo,
    fileName: string,
    geoRequestId: string,
    featureId: string,
  ): Promise<UserPhoto | null> => {
    let base64Data: string = photo.base64String as string;

    console.log("Photo is", photo);

    // "hybrid" will detect Cordova or Capacitor;

    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data,
    });
    console.log(Capacitor.convertFileSrc(savedFile.uri));
    console.log(base64Data.toString().length);

    const imageJson = {
      image: photo.base64String as string,
      featureId: featureId,
    };

    try {
      let token = null;
      try {
        const keys = await SecureStoragePlugin.keys();
        token = keys.value.includes(sessionName)
          ? await SecureStoragePlugin.get({ key: sessionName })
          : null;
      } catch (error) {
        console.error("Error fetching data:", error);
      }

      console.log("took photo");

      const res = await CapacitorHttp.post({
        //url: "https://dendrologic-web.stencukpage.com/api/images",
        url: `${api_url}/api/images/` + geoRequestId,
        data: imageJson,
        headers: {
          "Content-Type": "application/json",
          "Authorization-Session": token?.value ?? "",
        },
      });
      const data = res.data;

      console.log("after sending photo");
      if (!data.success && data.error === "UNAUTHORIZED") {
        await SecureStoragePlugin.clear();
        console.error("err");
        history.push("/auth/login");
        return null;
      }
      console.log(res);
    } catch (e) {
      console.error(e);
    }

    if (isPlatform("hybrid")) {
      return {
        filepath: savedFile.uri,
        webviewPath: Capacitor.convertFileSrc(savedFile.uri),
      };
    } else {
      // Use webPath to display the new image instead of base64 since it's
      // already loaded into memory
      return {
        filepath: fileName,
        webviewPath: photo.webPath,
      };
    }
  };

  const takePhoto = async (geoRequestId, featureId) => {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Base64,
      saveToGallery: true,
      source: CameraSource.Camera,
      quality: 100,
    });

    const fileName = Date.now() + ".jpeg";
    const savedFileImage = await savePicture(
      photo,
      fileName,
      geoRequestId,
      featureId,
    );
    if (!savedFileImage) {
      return false;
    }
    const newPhotos = [savedFileImage, ...photos];
    setPhotos(newPhotos);
    Preferences.set({ key: PHOTO_STORAGE, value: JSON.stringify(newPhotos) });
    return true;
  };

  useEffect(() => {
    const loadSaved = async () => {
      const { value } = await Preferences.get({ key: PHOTO_STORAGE });
      const photosInPreferences = (
        value ? JSON.parse(value) : []
      ) as UserPhoto[];

      if (!isPlatform("hybrid")) {
        for (let photo of photosInPreferences) {
          const file = await Filesystem.readFile({
            path: photo.filepath,
            directory: Directory.Data,
          });
          // Web platform only: Load the photo as base64 data
          photo.webviewPath = `data:image/jpeg;base64,${file.data}`;
        }
      }

      setPhotos(photosInPreferences);
    };

    loadSaved();
  }, []);

  return {
    takePhoto,
    photos,
  };
}

export async function base64FromPath(path: string): Promise<string> {
  const response = await fetch(path);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject("method did not return a string");
      }
    };
    reader.readAsDataURL(blob);
  });
}
