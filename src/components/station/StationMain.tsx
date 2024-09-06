import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

import { MapStation, Photo } from "@componentsReact";

import { useAuth } from "@hooks/useAuth";
import useApi from "@hooks/useApi";

import { getStationImagesService, getStationMetaService } from "@services";

import {
    StationData,
    StationImagesData,
    StationImagesServiceData,
    StationMetadataServiceData,
} from "@types";

const StationMain = () => {
    const { token, logout } = useAuth();
    const api = useApi(token, logout);

    const [images, setImages] = useState<StationImagesData[] | undefined>(
        undefined,
    );

    const [stationMeta, setStationMeta] = useState<
        StationMetadataServiceData | undefined
    >(undefined);

    const [loading, setLoading] = useState<boolean>(true);

    const station: StationData = useOutletContext();

    const stationId = station?.api_id;

    const getStationImages = async () => {
        try {
            setLoading(true);
            const result =
                await getStationImagesService<StationImagesServiceData>(api, {
                    offset: 0,
                    limit: 0,
                    station_api_id: String(stationId),
                });

            if (result) {
                setImages(result.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getStationMeta = async () => {
        try {
            const res = await getStationMetaService<StationMetadataServiceData>(
                api,
                Number(station?.api_id),
            );
            if (res) {
                setStationMeta(res);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        getStationImages();
        getStationMeta();
    }, [station]); // eslint-disable-line

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
                    loader={loading}
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
