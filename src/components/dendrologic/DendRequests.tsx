import { CapacitorHttp } from "@capacitor/core";
import { IonItem, IonList } from "@ionic/react";
import { useEffect, useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { api_url } from "@/lib/config";

interface GeoRequest {
  id: string;
  name: string;
}

const DendrologicRequests = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const loadingData = useRef(false);
  const [data, setData] = useState<null | GeoRequest[]>(null);

  const fetchData = async () => {
    try {
      // Check rate limit
      console.log("fetch");
      const geoData = await CapacitorHttp.request({
        method: "GET",
        url: `${api_url}/api/geo-requests`,
        headers: {
          "Content-Type": "application/json",
        },
      });

      const geoDataRes = await geoData.data;
      console.log(geoDataRes);
      if (!geoDataRes.success) {
        if (geoDataRes.redirect) return history.push(geoDataRes.redirect);
        return history.push("/");
      }

      // Get data
      setData(geoDataRes.geoRequests);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loadingData.current) {
      console.log("run");
      loadingData.current = true;
      fetchData();
    }
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <IonList inset={true}>
        {data?.map((request, i) => (
          <IonItem key={i}>
            <Link key={request.id} to={`/map-request/${request.id}`}>
              {request.name}
            </Link>
          </IonItem>
        ))}
      </IonList>
    </>
  );
};

export default DendrologicRequests;
