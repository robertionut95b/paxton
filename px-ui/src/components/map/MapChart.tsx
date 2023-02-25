import { Tooltip } from "@mantine/core";
import citiesJson from "assets/geo-map/cities.json";
import geoUrl from "assets/geo-map/world-countries.json";
import { forwardRef, useMemo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";

type MapChartProps = {
  darkMode?: boolean;
  markers?: Array<string>;
};

type MarkerProps = {
  lat: string;
  lng: string;
  name: string;
  darkMode: boolean;
};

interface CityObject {
  country: string;
  name: string;
  lat: string;
  lng: string;
}

const cities: CityObject[] = JSON.parse(JSON.stringify(citiesJson));

const MapMarker = forwardRef<SVGPathElement, MarkerProps>(
  ({ lng, lat, name, darkMode, ...rest }, ref) => (
    <Marker
      ref={ref}
      coordinates={[parseFloat(lng), parseFloat(lat)]}
      {...rest}
    >
      <circle r={3} fill={"#F00"} stroke="#fff" strokeWidth={1} />
    </Marker>
  )
);

MapMarker.displayName = "MapMarker";

const MapChart = ({ darkMode = false, markers }: MapChartProps) => {
  const mapMarkers = useMemo(() => {
    const mk: Array<typeof cities[number]> = [];
    markers?.forEach((m) => {
      const c = cities.find((c) => c.name === m);
      if (c) mk.push(c);
    });
    return mk;
  }, [markers]);

  return (
    <ComposableMap>
      <Geographies geography={geoUrl}>
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              fill="#EAEAEC"
              stroke="#D6D6DA"
            />
          ))
        }
      </Geographies>
      {mapMarkers?.map(({ lat, lng, name }) => (
        <Tooltip.Floating key={name} label={name}>
          <MapMarker lat={lat} lng={lng} darkMode={darkMode} name={name} />
        </Tooltip.Floating>
      ))}
    </ComposableMap>
  );
};

export default MapChart;
