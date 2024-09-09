import { useEffect, useMemo, useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Pdf } from "@componentsReact";

import { DocumentArrowDownIcon } from "@heroicons/react/24/outline";

import { useApi, useAuth } from "@hooks";

import {
    getMonumentsTypesByIdService,
    getPeopleService,
    getRolePersonStationService,
    getStationInfoService,
    getStationRolesService,
} from "@services";

import {
    MonumentTypes,
    People,
    RolePersonStationData,
    RolePersonStationServiceData,
    StationData,
    StationImagesData,
    StationInfoData,
    StationInfoServiceData,
    StationMetadataServiceData,
    StationStatus,
    StationStatusServiceData,
} from "@types";

interface Props {
    station: StationData | undefined;
    stationMeta: StationMetadataServiceData | undefined;
    images: StationImagesData[] | undefined;
}

type PeopleWithRole = People & { role: string };

const PdfContainer = ({ station, stationMeta, images }: Props) => {
    const { token, logout } = useAuth();
    const api = useApi(token, logout);

    const [stationInfo, setStationInfo] = useState<StationInfoData | undefined>(
        undefined,
    );

    const [allPeople, setAllPeople] = useState<PeopleWithRole[]>([]);

    const [rolePersonStations, setRolePersonStations] = useState<
        RolePersonStationData[] | undefined
    >(undefined);

    const [roles, setRoles] = useState<StationStatus[] | undefined>(undefined);

    const [monuments, setMonuments] = useState<MonumentTypes>();

    const getStationPeople = async () => {
        try {
            const res =
                await getRolePersonStationService<RolePersonStationServiceData>(
                    api,
                    {
                        station_api_id: String(station?.api_id),
                        offset: 0,
                        limit: 0,
                    },
                );
            setRolePersonStations(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const getPeople = async () => {
        try {
            const res = await getPeopleService<any>(api);
            setAllPeople(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const getRoles = async () => {
        try {
            const res =
                await getStationRolesService<StationStatusServiceData>(api);
            setRoles(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const getMonuments = async () => {
        try {
            const res = await getMonumentsTypesByIdService<MonumentTypes>(
                api,
                Number(stationMeta?.monument_type),
            );
            setMonuments(res);
        } catch (err) {
            console.error(err);
        }
    };

    const getLastStationInfo = async () => {
        try {
            if (stationMeta && station) {
                const res = await getStationInfoService<StationInfoServiceData>(
                    api,
                    {
                        network_code: station?.network_code ?? "",
                        station_code: station?.station_code ?? "",
                        offset: 0,
                        limit: 0,
                    },
                );

                const lastArrayValue = res.data.length - 1;

                setStationInfo(res.data[lastArrayValue]);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (station && stationMeta) {
            getPeople();
            getStationPeople();
            getMonuments();
            getLastStationInfo();
            getRoles();
        }
    }, [station, stationMeta]);

    const people = useMemo(() => {
        if (rolePersonStations && allPeople) {
            const people = rolePersonStations.map((rps) => {
                const person = allPeople.find((p) => p.id === rps.person);
                if (person) {
                    person.role =
                        roles?.find((r) => r.id === rps.role)?.name ?? "";
                }
                return person;
            });
            return people;
        }
        return [];
    }, [allPeople, rolePersonStations]);

    return (
        <PDFDownloadLink
            document={
                <Pdf
                    stationInfo={stationInfo}
                    monuments={monuments}
                    station={station}
                    stationMeta={stationMeta}
                    people={people}
                    images={images}
                />
            }
            fileName={`${station?.network_code?.toUpperCase() ?? "none"}.${station?.station_code?.toUpperCase() ?? "none"}-INFO.pdf`}
        >
            <button className="hover:scale-110 btn-ghost rounded-lg p-1 transition-all align-top">
                <DocumentArrowDownIcon className="size-6" />
            </button>
        </PDFDownloadLink>
    );
};

export default PdfContainer;
