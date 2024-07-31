import { Outlet, useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { Sidebar, Skeleton, Breadcrumb } from "@componentsReact";

import { useAuth } from "@hooks/useAuth";
import useApi from "@hooks/useApi";

import { getStationMetaService, getStationsService } from "@services";

import {
    StationData,
    StationMetadataServiceData,
    StationServiceData,
} from "@types";

const Station = () => {
    const { sc, nc } = useParams<{ sc: string; nc: string }>();
    const { token, logout } = useAuth();
    const api = useApi(token, logout);

    const [station, setStation] = useState<StationData | undefined>(undefined);

    const [stationMeta, setStationMeta] = useState<
        StationMetadataServiceData | undefined
    >(undefined);

    const [loading, setLoading] = useState<boolean>(true);

    const getStation = async () => {
        try {
            setLoading(true);
            const res = await getStationsService<StationServiceData>(api, {
                network_code: nc,
                station_code: sc,
                limit: 1,
                offset: 0,
            });
            setStation(res.data[0]);
        } catch (e) {
            console.error(e);
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

    const refetch = () => {
        getStation();
    };

    const location = useLocation();

    const [showSidebar, setShowSidebar] = useState<boolean>(false);

    const locationState = location.state as StationData;

    useEffect(() => {
        if (locationState && !loading) {
            setStation(locationState);
        } else {
            getStation();
        }
    }, [locationState]);

    useEffect(() => {
        if (station) {
            getStationMeta();
        }
    }, [station]);

    const stationTitle = station
        ? station.network_code.toUpperCase() +
          "." +
          station.station_code.toUpperCase()
        : "Station not found";

    return (
        <div className="max-h-[92vh] flex transition-all duration-200">
            {loading ? (
                <Skeleton />
            ) : (
                <>
                    <Sidebar
                        show={showSidebar}
                        station={station}
                        stationMeta={stationMeta}
                        refetch={refetch}
                        setShow={setShowSidebar}
                    />
                    <Breadcrumb sidebar={showSidebar} />
                    <div className="w-full flex flex-col pt-20 flex-wrap min-h-[92vh]">
                        <h1 className="text-6xl font-bold text-center">
                            {stationTitle}
                        </h1>
                        <Outlet context={station} />
                    </div>{" "}
                </>
            )}
        </div>
    );
};

export default Station;
