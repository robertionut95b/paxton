import { Tooltip } from "@mantine/core";
import geoUrl from "assets/geo-map/world-countries.json";
import { forwardRef } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";

type LocationProps = {
  name: string;
  lng: string;
  lat: string;
};

type MapChartProps = {
  darkMode?: boolean;
  markers: Array<LocationProps>;
};

type MarkerProps = {
  lat: string;
  lng: string;
  name: string;
  darkMode: boolean;
};

const MapMarker = forwardRef<SVGPathElement, MarkerProps>(
  ({ lng, lat, name, darkMode, ...rest }, ref) => (
    <Marker
      ref={ref}
      coordinates={[parseFloat(lng), parseFloat(lat)]}
      {...rest}
    >
      <circle r={2.5} fill={"#F00"} stroke="#fff" strokeWidth={1} />
    </Marker>
  )
);

MapMarker.displayName = "MapMarker";

const MapChart = ({ darkMode = false, markers }: MapChartProps) => {
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
      {markers.map(({ lat, lng, name }) => (
        <Tooltip.Floating key={name} label={name}>
          <MapMarker lat={lat} lng={lng} darkMode={darkMode} name={name} />
        </Tooltip.Floating>
      ))}
    </ComposableMap>
  );
};

export default MapChart;
