import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import JSZip from "jszip";
// @ts-expect-error leaflet omnivore doesnt have any types
import omnivore from "leaflet-omnivore";
import { StationData } from "@types";
import { LatLngExpression } from "leaflet";
import PopupChildren from "./PopupChildren";

interface MyMapContainerProps {
    zoom: number;
    scrollWheelZoom: boolean;
    center: LatLngExpression;

    style?: React.CSSProperties;
}

interface MapProps {
    base64Data: string; // Base64 data from the database
    station: StationData;
}

const LoadKmzFromBase64 = ({ base64Data }: { base64Data: string }) => {
    const map = useMap();

    useEffect(() => {
        const loadKmzOrKmlFile = async () => {
            if (!base64Data) return;

            try {
                const binaryString = atob(base64Data);
                const len = binaryString.length;
                const bytes = new Uint8Array(len);
                for (let i = 0; i < len; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }
                const arrayBuffer = bytes.buffer;

                // Intentar cargar como KMZ
                try {
                    const zip = await JSZip.loadAsync(arrayBuffer);
                    const kmlFile = zip.file(/.*\.kml/)[0];
                    if (kmlFile) {
                        const kmlString = await kmlFile.async("string");
                        const overlayLayer = omnivore.kml.parse(kmlString);
                        map.fitBounds(overlayLayer.getBounds());
                        map.zoomOut(1);
                        overlayLayer.options = { interactive: false };
                        overlayLayer.addTo(map);
                    } else {
                        console.error("No KML file found in the KMZ archive.");
                    }
                } catch (kmzError) {
                    // Si falla, intentar cargar como KML
                    try {
                        const kmlString = new TextDecoder().decode(arrayBuffer);
                        const overlayLayer = omnivore.kml.parse(kmlString);
                        map.fitBounds(overlayLayer.getBounds());
                        map.zoomOut(1);
                        overlayLayer.options = { interactive: false };
                        overlayLayer.addTo(map);
                    } catch (kmlError) {
                        console.error("Error loading KML file:", kmlError);
                    }
                }
            } catch (error) {
                console.error("Error processing file:", error);
            }
        };

        loadKmzOrKmlFile();
    }, [base64Data, map]);

    return null;
};

const MapVisit = ({ base64Data, station }: MapProps) => {
    const [mapProps, setMapProps] = useState<MyMapContainerProps>({
        zoom: 13,
        center: [0, 0],
        scrollWheelZoom: true,
    });

    useEffect(() => {
        const pos: LatLngExpression = station
            ? [station.lat, station.lon]
            : [0, 0];
        setMapProps({
            ...mapProps,
            center: pos,
        });
    }, [station]);

    return (
        <div className="z-10 pt-6 flex justify-center">
            <MapContainer
                {...mapProps}
                className="w-[55vw] h-[30vh] xl:w-[40vw] lg:w-[30vw] md:w-[30vw] sm:w-[20vw]"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    minZoom={4}
                />
                <Marker
                    // icon={iconGaps}
                    key={station ? station.lat + station.lon : "key"}
                    position={mapProps.center}
                >
                    <Popup maxWidth={1000} minWidth={200}>
                        <PopupChildren station={station} />
                    </Popup>
                </Marker>
                <LoadKmzFromBase64 base64Data={base64Data} />
            </MapContainer>
        </div>
    );
};

export default MapVisit;