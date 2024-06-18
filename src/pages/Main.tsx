import { useEffect, useState } from "react";
import {
    Map,
    SearchInput,
    Sidebar,
    Skeleton,
    StationsModal,
    // StationInfo,
} from "@componentsReact";

import useApi from "@hooks/useApi";
import { useAuth } from "@hooks/useAuth";

import { getStationsService } from "@services";
import { GetParams, StationData, StationServiceData } from "@types";
import { showModal } from "@utils/index";

const MainPage = () => {
    const { token, logout } = useAuth();
    const api = useApi(token, logout);

    const [station, setStation] = useState<StationData | undefined>(undefined);
    const [stations, setStations] = useState<StationData[] | undefined>(
        undefined,
    );
    const [initialStations, setInitialStations] = useState<
        StationData[] | undefined
    >(undefined);

    const [loading, setLoading] = useState<boolean>(true);

    const [modals, setModals] = useState<
        | { show: boolean; title: string; type: "add" | "edit" | "none" }
        | undefined
    >(undefined);

    const getInitialStations = async () => {
        try {
            setLoading(true);
            const result = await getStationsService<StationServiceData>(
                api,
                params,
            );
            if (result) {
                setInitialStations(result.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getStations = async () => {
        try {
            // if (!params.country_code || !params.network_code) return;
            const result = await getStationsService<StationServiceData>(
                api,
                params,
            );
            if (result) {
                setStations(result.data);
            }
        } catch (err) {
            console.error(err);
        }
    };
    // const [showStations, setShowStations] = useState<boolean>(false);
    const [showSidebar, setShowSidebar] = useState<boolean>(false);

    const [params, setParams] = useState<GetParams>({
        country_code: "",
        network_code: "",
        station_code: "",
        limit: 1000,
        offset: 0,
    });

    useEffect(() => {
        if (
            initialStations &&
            (params.country_code !== "" ||
                params.network_code !== "" ||
                params.station_code !== "")
        ) {
            getStations();
        }
    }, [params]);

    useEffect(() => {
        if (!initialStations) {
            // FIXME: Corresponder las initialstations al rango de la vista
            //que el usuario tenga determinada, seguro tenga que hacer un nuevo getStations
            getInitialStations();
        }
    }, []);

    useEffect(() => {
        modals?.show && showModal(modals.title);
    }, [modals]);

    return (
        <div className={" my-auto flex transition-all duration-200"}>
            {loading ? (
                <Skeleton />
            ) : (
                <>
                    <Sidebar
                        show={showSidebar}
                        setShow={setShowSidebar}
                        station={station}
                    />

                    <div
                        className={"self-center w-full flex flex-col flex-wrap"}
                    >
                        <div className="flex justify-center flex-wrap items-center">
                            <SearchInput
                                stations={stations}
                                params={params}
                                setParams={setParams}
                                setStation={setStation}
                            />
                            <button
                                className="btn w-[10%] ml-6"
                                onClick={() =>
                                    setModals({
                                        show: !modals?.show,
                                        title: "Stations",
                                        type: "none",
                                    })
                                }
                            >
                                Stations
                            </button>
                        </div>
                        <Map stations={stations ? stations : initialStations} />
                    </div>

                    {modals?.show && modals.title === "Stations" && (
                        <StationsModal setModalState={setModals} />
                    )}
                </>
            )}
        </div>
    );
};

export default MainPage;
