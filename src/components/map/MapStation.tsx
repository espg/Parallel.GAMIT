import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { LatLngExpression } from "leaflet";

import { PopupChildren } from "@componentsReact";

import { StationData } from "@types";

interface MyMapContainerProps {
    center: LatLngExpression;
    zoom: number;
    scrollWheelZoom: boolean;
    style?: React.CSSProperties;
}

interface MapProps {
    station: StationData | undefined;
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

const MapStation = ({ station }: MapProps) => {
    const [mapProps, setMapProps] = useState<MyMapContainerProps>({
        center: [0, 0],
        zoom: 13,
        scrollWheelZoom: true,
    });

    useEffect(() => {
        const pos: LatLngExpression = station
            ? [station.lat, station.lon]
            : [0, 0];

        setMapProps((prevProps) => ({
            ...prevProps,
            center: pos,
        }));
    }, [station]);

    return (
        <div className=" z-10 pt-6 w-full flex justify-center">
            <MapContainer
                {...mapProps}
                className="w-[85vw] h-[70vh] xl:w-[70vw] lg:w-[60vw] md:w-[60vw] sm:w-[50vw]"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    minZoom={4}
                />
                <ChangeView center={mapProps.center} zoom={mapProps.zoom} />
                <Marker
                    key={station ? station.lat + station.lon : "key"}
                    position={mapProps.center}
                >
                    {" "}
                    <Popup maxWidth={1000} minWidth={200}>
                        {" "}
                        <PopupChildren station={station} />
                    </Popup>{" "}
                </Marker>
            </MapContainer>
        </div>
    );
};

export default MapStation;
