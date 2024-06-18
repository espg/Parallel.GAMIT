import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import useApi from "@hooks/useApi";
import { useAuth } from "@hooks/useAuth";
import { getRinexService } from "@services";

import { RinexData, RinexServiceData, StationData } from "@types";
import { formattedDates } from "@utils/index";

interface PopupChildrenProps {
    station: StationData | undefined;
    fromMain?: boolean | undefined;
}

const child = (key: string, text: string, idx: number) => {
    return (
        <div key={idx} className="flex flex-col w-full">
            <span className="">
                <strong>{key}:</strong> {text}
            </span>
        </div>
    );
};

const PopupChildren = ({ station, fromMain }: PopupChildrenProps) => {
    const { station_code, network_code, country_code, lat, lon, height } =
        station || {};

    const data = {
        Station: station_code,
        Network: network_code,
        Country: country_code,
        Latitude: lat,
        Longitude: lon,
        Height: height,
    };

    const { token, logout } = useAuth();
    const api = useApi(token, logout);

    const [firstRinex, setFirstRinex] = useState<RinexData | undefined>(
        undefined,
    );
    const [lastRinex, setLastRinex] = useState<RinexData | undefined>(
        undefined,
    );

    const [loading, setLoading] = useState(false);

    const getRinex = async () => {
        try {
            setLoading(true);
            const firstRes = await getRinexService<RinexServiceData>(api, {
                network_code: station?.network_code,
                station_code: station?.station_code,
                limit: 1,
                offset: 0,
            });
            const totalRecords = firstRes.total_count;
            const lastRes = await getRinexService<RinexServiceData>(api, {
                network_code: station?.network_code,
                station_code: station?.station_code,
                limit: 1,
                offset: totalRecords - 1,
            });
            setFirstRinex(firstRes.data[0]);
            setLastRinex(lastRes.data[0]);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (fromMain) {
            getRinex();
        }
    }, [fromMain]);

    return (
        <div
            className={`flex flex-col self-start space-y-2 ${fromMain ? "md:w-[400px] lg:w-[450px]" : "w-[200px]"} `}
        >
            <span className="w-full bg-green-400 px-4 text-center font-bold self-center">
                STATUS
            </span>
            <div className="flex justify-between w-full divide-x-2">
                <div className="flex flex-col grow justify-center space-y-2">
                    {Object.entries(data).map((d, idx) =>
                        child(String(d[0]), String(d[1]), idx),
                    )}
                </div>
                {fromMain && loading ? (
                    <span className="loading loading-dots loading-lg mx-auto"></span>
                ) : fromMain !== undefined && !loading ? (
                    <div className="flex flex-col items-center grow">
                        {firstRinex ? (
                            <div className="flex flex-col">
                                <h2
                                    className="menu-title"
                                    style={{ paddingTop: "0px" }}
                                >
                                    First Rinex
                                </h2>
                                <div className="flex">
                                    <strong>Filename: </strong>
                                    <span className="ml-1">
                                        {firstRinex.filename}
                                    </span>
                                </div>
                                <div className="flex">
                                    <strong>Obs day: </strong>
                                    <span className="ml-1">
                                        {" "}
                                        {formattedDates(
                                            new Date(
                                                firstRinex.observation_e_time,
                                            ),
                                        )}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <strong className="my-auto">
                                No Rinex for this station
                            </strong>
                        )}
                        {lastRinex && (
                            <div className="flex flex-col">
                                <h2 className="menu-title">Last Rinex</h2>
                                <div className="flex">
                                    <strong>Filename: </strong>
                                    <span className="ml-1">
                                        {lastRinex.filename}
                                    </span>
                                </div>
                                <div className="flex">
                                    <strong>Obs day: </strong>
                                    <span className="ml-1">
                                        {formattedDates(
                                            new Date(
                                                lastRinex.observation_e_time,
                                            ),
                                        )}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                ) : null}
            </div>

            {fromMain && (
                <Link
                    to={`/${network_code}/${station_code}`}
                    className=" text-center"
                    state={station}
                >
                    {" "}
                    Navigate to Station{" "}
                </Link>
            )}
        </div>
    );
};
export default PopupChildren;
