import { LatLngExpression } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

import { StationData } from "@types";
import { useEffect, useState } from "react";
import PopupChildren from "./PopupChildren";

interface MyMapContainerProps {
    center: LatLngExpression;
    zoom: number;
    scrollWheelZoom: boolean;
    style?: React.CSSProperties;
}

interface MapProps {
    stations: StationData[] | undefined;
}

const ChangeView = ({
    center,
    zoom,
}: {
    center: LatLngExpression;
    zoom: number;
}) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
};

const Map = ({ stations }: MapProps) => {
    const [mapProps, setMapProps] = useState<MyMapContainerProps>({
        center: [0, 0],
        zoom: 4,
        scrollWheelZoom: true,
    });

    useEffect(() => {
        const pos: LatLngExpression =
            stations && stations.length > 0
                ? [stations[0]?.lat, stations[0]?.lon]
                : [0, 0];

        setMapProps((prevProps) => ({
            ...prevProps,
            center: pos,
        }));
    }, [stations]);

    return (
        <div className="z-10 pt-6 w-full flex justify-center">
            <MapContainer
                {...mapProps}
                className="w-[80vw] h-[70vh] xl:w-[70vw] lg:w-[60vw] md:w-[50vw] sm:w-[40vw]"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    minZoom={4}
                />
                <ChangeView center={mapProps.center} zoom={mapProps.zoom} />
                {/* <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    subdomains="abcd"
                    minZoom={5}
                /> */}
                {stations?.map((s) => {
                    const pos: LatLngExpression = [s?.lat ?? 0, s?.lon ?? 0];
                    return (
                        <Marker
                            key={s.lat + s.lon + (s?.api_id ?? 0)}
                            position={pos}
                        >
                            {" "}
                            <Popup maxWidth={1000} minWidth={400}>
                                <PopupChildren station={s} fromMain={true} />
                            </Popup>{" "}
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
};

export default Map;
