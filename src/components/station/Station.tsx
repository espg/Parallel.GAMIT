import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { Sidebar, MapStation, Skeleton } from "@componentsReact";

import { useAuth } from "@hooks/useAuth";
import useApi from "@hooks/useApi";

import { getStationsService } from "@services";

import { StationData, StationServiceData } from "@types";

const Station = () => {
    const { sc, nc } = useParams<{ sc: string; nc: string }>();
    const { token, logout } = useAuth();
    const api = useApi(token, logout);

    const [station, setStation] = useState<StationData | undefined>(undefined);
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

    const stationTitle = station
        ? station.network_code.toUpperCase() +
          "." +
          station.station_code.toUpperCase()
        : "Station not found";

    return (
        <div className="min-h-[92vh] min-w-[100vw] flex transition-all duration-200">
            {loading ? (
                <Skeleton />
            ) : (
                <>
                    <Sidebar
                        show={showSidebar}
                        station={station}
                        setShow={setShowSidebar}
                    />
                    <div
                        className={"self-center w-full flex flex-col flex-wrap"}
                    >
                        <h1 className="text-6xl font-bold text-center">
                            {stationTitle}
                        </h1>
                        <h1 className="text-2xl font-base text-center">
                            {station?.country_code?.toUpperCase()}
                        </h1>
                        <MapStation station={station} />
                    </div>{" "}
                </>
            )}
        </div>
    );
};

export default Station;
