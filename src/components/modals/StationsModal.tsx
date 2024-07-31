import { useEffect, useMemo, useState } from "react";

import { Pagination, Table } from "@componentsReact";

import { GetParams, StationData, StationServiceData } from "@types";

import { getStationsService } from "@services";
import { useAuth } from "@hooks/useAuth";
import useApi from "@hooks/useApi";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface Props {
    setState: React.Dispatch<React.SetStateAction<boolean>>;
}

const StationsModal = ({ setState }: Props) => {
    const { token, logout } = useAuth();
    const api = useApi(token, logout);

    const [stations, setStations] = useState<StationData[] | undefined>(
        undefined,
    );

    const bParams: GetParams = useMemo(() => {
        return {
            limit: 5,
            offset: 0,
        };
    }, []);

    const [params, setParams] = useState<GetParams>(bParams);
    const [loading, setLoading] = useState<boolean>(false);

    // PAGINATION... HEADACHE
    const [activePage, setActivePage] = useState<number>(1);
    const [pages, setPages] = useState<number>(0);
    const PAGES_TO_SHOW = 2;
    const REGISTERS_PER_PAGE = 5; // Es el mismo que params.limit

    const getStations = async () => {
        try {
            setLoading(true);
            const res = await getStationsService<StationServiceData>(
                api,
                bParams,
            );
            setStations(res.data);
            setPages(Math.ceil(res.total_count / bParams.limit));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const paginateStations = async (newParams: GetParams) => {
        try {
            setLoading(true);
            const res = await getStationsService<StationServiceData>(
                api,
                newParams,
            );
            setStations(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handlePage = (page: number) => {
        if (page < 1 || page > pages) return;
        let newParams;
        if (page === 1) {
            newParams = {
                ...params,
                limit: REGISTERS_PER_PAGE * 1,
                offset: REGISTERS_PER_PAGE * (page - 1),
            };
        } else {
            newParams = {
                ...params,
                limit: REGISTERS_PER_PAGE,
                offset: REGISTERS_PER_PAGE * (page - 1),
            };
        }

        setParams(newParams);
        setActivePage(page);
        paginateStations(newParams);
    };

    useEffect(() => {
        getStations();
    }, []); // eslint-disable-line

    const bTitles = {
        station: String,
        country_code: String,
        station_name: String,
        dome: String,
        lat: Number,
        lon: Number,
    };

    const titles = Object.keys(bTitles || {});

    /* eslint-disable */
    const tableData = stations?.map(
        ({
            harpos_coeff_otl,
            date_start,
            date_end,
            marker,
            api_id,
            auto_x,
            auto_y,
            auto_z,
            height,
            max_dist,
            // station_code,
            // network_code,
            ...st
        }: StationData) => {
            const orderedStation = {
                station:
                    st.station_code.toUpperCase() +
                    "." +
                    st.network_code.toUpperCase(),
                country_code: st.country_code,
                station_name: st.station_name,
                lat: st.lat,
                lon: st.lon,
                dome: st.dome,
            };
            return Object.values(orderedStation);
        },
    );
    /* eslint-enable */

    return (
        <div className="flex flex-col">
            <div className="card bg-base-200 p-4 space-y-2 w-[700px]">
                <div className="w-full inline-flex">
                    <h3 className="font-bold text-center text-3xl my-2 grow">
                        Stations
                    </h3>
                    <XMarkIcon
                        className="btn btn-circle"
                        style={{
                            width: "26px",
                            height: "26px",
                            minHeight: 0,
                        }}
                        onClick={() => setState(false)}
                    />
                </div>
                <Table
                    titles={titles}
                    body={tableData}
                    loading={loading}
                    table={"Stations"}
                    dataOnly={true}
                    onClickFunction={() => undefined}
                    state={stations}
                />
                {stations && stations?.length > 0 && (
                    <Pagination
                        pages={pages}
                        pagesToShow={PAGES_TO_SHOW}
                        activePage={activePage}
                        handlePage={handlePage}
                    />
                )}
            </div>
        </div>
    );
};

export default StationsModal;
