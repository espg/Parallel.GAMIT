import { useOutletContext } from "react-router-dom";
import { MapStation, Photo } from "@componentsReact";

import {
    StationData,
    StationImagesData,
    StationMetadataServiceData,
} from "@types";

interface OutletContext {
    station: StationData;
    stationMeta: StationMetadataServiceData;
    images: StationImagesData[];
    photoLoading: boolean;
    getStationImages: () => void;
}

const StationMain = () => {
    const { station, stationMeta, images, photoLoading, getStationImages } =
        useOutletContext<OutletContext>();
    return (
        <div>
            <h1 className="text-2xl font-base text-center">
                {station?.country_code?.toUpperCase()}
            </h1>
            <div className="flex w-full pr-2 space-x-2 px-2">
                <MapStation
                    station={station}
                    base64Data={stationMeta?.navigation_actual_file ?? ""}
                />
                <Photo
                    loader={photoLoading}
                    phArray={
                        images?.map((img) => {
                            return {
                                id: img.id ?? 0,
                                actual_image: img.actual_image ?? "",
                                description: img.description ?? "",
                                name: img.name ?? "",
                            };
                        }) ?? []
                    }
                    reFetch={() => {
                        getStationImages();
                    }}
                />
            </div>
        </div>
    );
};

export default StationMain;
