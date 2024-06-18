import { useEffect, useMemo, useState } from "react";

import { Pagination, Table, Modal } from "@componentsReact";

import { GetParams, StationData, StationServiceData } from "@types";

import { getStationsService } from "@services";
import { useAuth } from "@hooks/useAuth";
import useApi from "@hooks/useApi";

interface StationsModalProps {
    setModalState: React.Dispatch<
        React.SetStateAction<
            | { show: boolean; title: string; type: "add" | "edit" | "none" }
            | undefined
        >
    >;
}

const StationsModal = ({ setModalState }: StationsModalProps) => {
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

    const { harpos_coeff_otl, ...restOfStations } = stations?.[0] || {}; //eslint-disable-line

    const titles = Object.keys(restOfStations || {});

    const tableData = stations?.map(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ({ harpos_coeff_otl, ...st }: StationData) => {
            return Object.values(st);
        },
    );

    return (
        <Modal
            close={true}
            modalId={"Stations"}
            size={"md"}
            setModalState={setModalState}
        >
            <div className="w-full inline-flex">
                <h3 className="font-bold text-center text-3xl my-2 grow">
                    Stations
                </h3>
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
        </Modal>
    );
};

export default StationsModal;
