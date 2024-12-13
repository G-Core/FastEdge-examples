import { GeoCoords } from "@types";

function getBrowserGeoCoords(): Promise<GeoCoords> {
  return new Promise((resolve) => {
    const fallbackToServerGeoLocation = (err: unknown) => {
      console.warn(err);
      resolve({ lat: 999, lon: 999 });
    };

    if (window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) => {
          resolve({ lat: latitude, lon: longitude });
        },
        (err) => {
          fallbackToServerGeoLocation(err);
        }
      );
    } else {
      fallbackToServerGeoLocation("Geo Location not supported");
    }
  });
}

export { getBrowserGeoCoords };
