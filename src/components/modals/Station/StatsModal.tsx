import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    Alert,
    DateTimePicker,
    Menu,
    MenuButton,
    MenuContent,
    Modal,
} from "@componentsReact";

import "react-datepicker/dist/react-datepicker.css";

import {
    AntennaData,
    AntennaServiceData,
    ErrorResponse,
    Errors,
    ExtendedStationInfoData,
    GamitHTCData,
    GamitHTCServiceData,
    GetParams,
    ReceiversData,
    ReceiversServiceData,
    StationInfoData,
} from "@types";

import {
    delStationInfoService,
    getAntennasService,
    getHeightCodesService,
    getReceiversService,
    postStationInfoService,
    putStationInfoService,
} from "@services";

import { useApi, useAuth, useFormReducer } from "@hooks/index";
import { STATION_INFO_STATE } from "@utils/reducerFormStates";
import {
    apiOkStatuses,
    dateFromDay,
    dateToUTC,
    dayFromDate,
    formattedDates,
    isValidDate,
} from "@utils/index";

interface EditStatsModalProps {
    stationInfo: StationInfoData | undefined;
    modalType: "add" | "edit" | "none";
    setStateModal: React.Dispatch<
        React.SetStateAction<
            | { show: boolean; title: string; type: "add" | "edit" | "none" }
            | undefined
        >
    >;
    setStationInfo: React.Dispatch<
        React.SetStateAction<StationInfoData | undefined>
    >;
    reFetch: () => void;
}

const EditStatsModal = ({
    stationInfo,
    modalType,
    setStateModal,
    setStationInfo,
    reFetch,
}: EditStatsModalProps) => {
    const { nc, sc } = useParams();

    const { token, logout } = useAuth();
    const api = useApi(token, logout);

    const { formState, dispatch } =
        useFormReducer<Record<string, any>>(STATION_INFO_STATE);

    const [loading, setLoading] = useState<boolean>(false);
    const [msg, setMsg] = useState<
        { status: number; msg: string; errors?: Errors } | undefined
    >(undefined);

    const [receivers, setReceivers] = useState<ReceiversData[]>([]);
    const [matchingReceivers, setMatchingReceivers] = useState<ReceiversData[]>(
        [],
    );

    const [antennas, setAntennas] = useState<AntennaData[]>([]);
    const [matchingAntennas, setMatchingAntennas] = useState<AntennaData[]>([]);

    const [heightcodes, setHeightcodes] = useState<GamitHTCData[]>([]);
    const [matchingHeightcodes, setMatchingHeightcodes] = useState<
        GamitHTCData[]
    >([]);

    const [doyCheck, setDoyCheck] = useState<
        { [key: string]: { check: boolean; input: string } } | undefined
    >({
        date_start: {
            check: true,
            input: "",
        },
        date_end: { check: true, input: "" },
    });

    const [startDate, setStartDate] = useState<Date | null>(new Date());

    const [endDate, setEndDate] = useState<Date | null>(new Date());

    const [showMenu, setShowMenu] = useState<
        { type: string; show: boolean } | undefined
    >(undefined);

    useEffect(() => {
        if (stationInfo && modalType === "edit") {
            dispatch({
                type: "set",
                payload: stationInfo,
            });
        } else {
            dispatch({
                type: "change_value",
                payload: {
                    inputName: "network_code",
                    inputValue: nc,
                },
            });
            dispatch({
                type: "change_value",
                payload: {
                    inputName: "station_code",
                    inputValue: sc,
                },
            });
        }
    }, [stationInfo]); // eslint-disable-line

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, name } = e.target;
        dispatch({
            type: "change_value",
            payload: {
                inputName: name,
                inputValue: value,
            },
        });
        if (name === "receiver_code") {
            const match = receivers.filter((receiver) =>
                receiver.receiver_code.toLowerCase().includes(value),
            );
            setMatchingReceivers(match);
        }
        if (name === "antenna_code") {
            const match = antennas.filter((ant) =>
                ant.antenna_code.toLowerCase().includes(value),
            );
            setMatchingAntennas(match);
        }

        if (name === "height_code") {
            const match = heightcodes.filter((hc) =>
                hc.height_code.toLowerCase().includes(value),
            );
            setMatchingHeightcodes(match);
        }
    };

    const getReceivers = async () => {
        try {
            const res = await getReceiversService<ReceiversServiceData>(api);
            if (res) {
                setReceivers(res.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const getAntennas = async () => {
        try {
            const res = await getAntennasService<AntennaServiceData>(api);
            if (res) {
                setAntennas(res.data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const getHeightCodes = async (params: GetParams) => {
        try {
            const res = await getHeightCodesService<GamitHTCServiceData>(
                api,
                params,
            );
            if (res) {
                setHeightcodes(res.data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const postStationInfo = async () => {
        try {
            setLoading(true);
            const res = await postStationInfoService<
                ExtendedStationInfoData | ErrorResponse
            >(api, formState);

            if (res) {
                if ("status" in res) {
                    setMsg({
                        status: res.statusCode,
                        msg: res.response.type,
                        errors: res.response,
                    });
                } else {
                    setMsg({
                        status: res.statusCode,
                        msg: "Station info added successfully",
                    });
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const putStationInfo = async () => {
        try {
            setLoading(true);
            const res = await putStationInfoService<
                ExtendedStationInfoData | ErrorResponse
            >(api, Number(formState.api_id), formState);

            if (res) {
                if ("status" in res) {
                    setMsg({
                        status: res.statusCode,
                        msg: res.response.type,
                        errors: res.response,
                    });
                } else {
                    setMsg({
                        status: res.statusCode,
                        msg: "Station info updated successfully",
                    });
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const delStationInfo = async () => {
        try {
            setLoading(true);
            const res = await delStationInfoService<ErrorResponse>(
                api,
                Number(formState.api_id),
            );

            if (res) {
                if ("status" in res && res.status === "success") {
                    setMsg({
                        status: res.statusCode,
                        msg: res.msg,
                    });
                } else {
                    setMsg({
                        status: res.statusCode,
                        msg: res.response.type,
                        errors: res.response,
                    });
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMsg(undefined);
        if (modalType === "add") {
            postStationInfo();
        } else if (modalType === "edit") {
            putStationInfo();
        }
    };

    useEffect(() => {
        getReceivers();
        getAntennas();
        getHeightCodes({
            limit: 0,
            offset: 0,
            antenna_code: "",
        });
    }, []); // eslint-disable-line

    useEffect(() => {
        if (formState.antenna_code) {
            getHeightCodes({
                limit: 5,
                offset: 0,
                antenna_code: formState.antenna_code,
            });
        }
    }, [formState.antenna_code]); // eslint-disable-line

    const checkDoy = (doyKey: string, formStateKey: string) => {
        if (
            doyCheck?.[doyKey].check === true &&
            formState[formStateKey] !== null &&
            formState[formStateKey] !== "" &&
            formState[formStateKey]
        ) {
            const doyArr = dayFromDate(formState?.[formStateKey]);

            setDoyCheck({
                ...doyCheck,
                [doyKey]: {
                    check: true,
                    input: doyArr,
                },
            });

            dispatch({
                type: "change_value",
                payload: {
                    inputName: formStateKey,
                    inputValue: dateFromDay(
                        dayFromDate(formState?.[formStateKey]),
                    )?.toISOString(),
                },
            });
        }
    };

    useEffect(() => {
        if (
            doyCheck?.date_start.check &&
            formState.date_start !== null &&
            formState.date_start !== "" &&
            formState.date_start
        ) {
            checkDoy("date_start", "date_start");
        }

        if (formState.date_start && isValidDate(formState.date_start)) {
            setStartDate(dateToUTC(formState.date_start));
        }
    }, [formState.date_start]);

    useEffect(() => {
        if (
            doyCheck?.date_end.check &&
            formState.date_end !== null &&
            formState.date_end !== "" &&
            formState.date_end
        ) {
            checkDoy("date_end", "date_end");
        }

        if (formState.date_end && isValidDate(formState.date_end)) {
            setEndDate(dateToUTC(formState.date_end));
        }
    }, [formState.date_end]);

    return (
        <Modal
            close={true}
            modalId={"EditStats"}
            size={"md"}
            handleCloseModal={() => {
                setStationInfo(undefined);
                reFetch();
            }}
            setModalState={setStateModal}
        >
            <h3 className="font-bold text-center text-2xl my-2 w-full">
                {modalType.charAt(0).toUpperCase() + modalType.slice(1)}
            </h3>
            <form className="form-control space-y-4" onSubmit={handleSubmit}>
                <div className="form-control space-y-2">
                    {Object.entries(formState || {}).map(([key], index) => {
                        const inputsToDisable = [
                            "api_id",
                            "network_code",
                            "station_code",
                        ];
                        const inputsToDatePicker = ["date_start", "date_end"];
                        const errorBadge = msg?.errors?.errors.find(
                            (error) => error.attr === key,
                        );

                        return (
                            <div className="flex flex-col" key={index}>
                                {errorBadge && (
                                    <div className="badge badge-error gap-2 self-end -mb-2 z-[1]">
                                        {errorBadge.code.toUpperCase()}
                                    </div>
                                )}
                                <div className="flex w-full">
                                    <label
                                        key={index}
                                        id={key}
                                        className={`w-full input input-bordered flex items-center 
                                            gap-2 ${errorBadge ? "input-error" : ""} 
                                            ${inputsToDatePicker.includes(key) ? "w-11/12" : ""}`}
                                        title={
                                            errorBadge ? errorBadge.detail : ""
                                        }
                                    >
                                        <div className="label">
                                            <span className="font-bold">
                                                {key
                                                    .toUpperCase()
                                                    .replace("_", " ")
                                                    .replace("_", " ")}
                                            </span>
                                        </div>
                                        <input
                                            type={
                                                key in inputsToDatePicker
                                                    ? "datetime-local"
                                                    : "text"
                                            }
                                            name={key}
                                            value={
                                                inputsToDatePicker.includes(key)
                                                    ? doyCheck?.[key]?.check
                                                        ? doyCheck[key].input
                                                        : inputsToDatePicker.includes(
                                                                key,
                                                            ) &&
                                                            formState[
                                                                key as keyof typeof formState
                                                            ] !== "" &&
                                                            formState[
                                                                key as keyof typeof formState
                                                            ] !== null
                                                          ? formattedDates(
                                                                new Date(
                                                                    formState[
                                                                        key as keyof typeof formState
                                                                    ],
                                                                ),
                                                            )
                                                          : ""
                                                    : formState[
                                                          key as keyof typeof formState
                                                      ] ?? ""
                                            }
                                            onChange={(e) => {
                                                const hasDoy =
                                                    (key === "date_start" ||
                                                        key === "date_end") &&
                                                    doyCheck?.[key].check;
                                                hasDoy
                                                    ? (setDoyCheck({
                                                          ...doyCheck,
                                                          [key]: {
                                                              check: true,
                                                              input:
                                                                  e.target
                                                                      .value ??
                                                                  0,
                                                          },
                                                      }),
                                                      dispatch({
                                                          type: "change_value",
                                                          payload: {
                                                              inputName: key,
                                                              inputValue:
                                                                  dateFromDay(
                                                                      e.target
                                                                          .value,
                                                                  )?.toISOString(),
                                                          },
                                                      }))
                                                    : handleChange(e);
                                            }}
                                            className="grow "
                                            autoComplete="off"
                                            disabled={inputsToDisable.includes(
                                                key,
                                            )}
                                            readOnly={
                                                inputsToDatePicker.includes(
                                                    key,
                                                ) && !doyCheck?.[key].check
                                            }
                                            placeholder={
                                                inputsToDatePicker.includes(key)
                                                    ? "YYYY DOY"
                                                    : ""
                                            }
                                        />
                                        {inputsToDatePicker.includes(key) &&
                                            !doyCheck?.[key].check && (
                                                <>
                                                    <DateTimePicker
                                                        typeKey={key}
                                                        startDate={startDate}
                                                        endDate={endDate}
                                                        setStartDate={
                                                            setStartDate
                                                        }
                                                        setEndDate={setEndDate}
                                                        dispatch={dispatch}
                                                    />
                                                </>
                                            )}
                                        {key === "comments" && (
                                            <span className="badge badge-secondary">
                                                Optional
                                            </span>
                                        )}
                                        {(key === "receiver_code" ||
                                            key === "antenna_code" ||
                                            key === "height_code") && (
                                            <MenuButton
                                                setShowMenu={setShowMenu}
                                                showMenu={showMenu}
                                                typeKey={key}
                                            />
                                        )}
                                    </label>
                                    {inputsToDatePicker.includes(key) && (
                                        <div className="form-control justify-center w-1/12">
                                            <label className="label cursor-pointer">
                                                <span className="label-text ml-auto mr-2 text-center font-semibold">
                                                    DOY
                                                </span>
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        doyCheck?.[key].check
                                                    }
                                                    onChange={() => {
                                                        setDoyCheck({
                                                            ...doyCheck,
                                                            [key]: {
                                                                check: !doyCheck?.[
                                                                    key
                                                                ].check,
                                                                input: dayFromDate(
                                                                    formState?.[
                                                                        key as keyof typeof formState
                                                                    ] ?? "",
                                                                ),
                                                            },
                                                        });
                                                    }}
                                                    className="checkbox"
                                                />
                                            </label>
                                        </div>
                                    )}
                                </div>
                                {showMenu?.show &&
                                showMenu.type === key &&
                                key === "receiver_code" ? (
                                    <Menu>
                                        {(matchingReceivers.length > 0
                                            ? matchingReceivers
                                            : receivers
                                        )?.map((receiver) => (
                                            <MenuContent
                                                key={
                                                    receiver.api_id +
                                                    receiver.receiver_code
                                                }
                                                typeKey={key}
                                                value={receiver.receiver_code}
                                                dispatch={dispatch}
                                                setShowMenu={setShowMenu}
                                            />
                                        ))}
                                    </Menu>
                                ) : showMenu?.show &&
                                  showMenu.type === key &&
                                  key === "antenna_code" ? (
                                    <Menu>
                                        {(matchingAntennas.length > 0
                                            ? matchingAntennas
                                            : antennas
                                        )?.map((ant) => (
                                            <MenuContent
                                                key={
                                                    ant.api_id +
                                                    ant.antenna_code
                                                }
                                                typeKey={key}
                                                value={ant.antenna_code}
                                                dispatch={dispatch}
                                                setShowMenu={setShowMenu}
                                            />
                                        ))}
                                    </Menu>
                                ) : (
                                    showMenu?.show &&
                                    showMenu.type === key &&
                                    key === "height_code" && (
                                        <Menu>
                                            {(matchingHeightcodes?.length > 0
                                                ? matchingHeightcodes
                                                : heightcodes
                                            )?.map((hc) => (
                                                <MenuContent
                                                    key={
                                                        hc.api_id +
                                                        hc.height_code
                                                    }
                                                    typeKey={key}
                                                    value={hc.height_code}
                                                    dispatch={dispatch}
                                                    setShowMenu={setShowMenu}
                                                />
                                            ))}
                                        </Menu>
                                    )
                                )}
                            </div>
                        );
                    })}
                </div>
                <Alert msg={msg} />
                <div className="flex w-full justify-center space-x-4">
                    <button
                        type="submit"
                        className="btn btn-success w-5/12"
                        disabled={
                            apiOkStatuses.includes(Number(msg?.status)) ||
                            loading
                        }
                    >
                        {loading && (
                            <span className="loading loading-spinner loading-md"></span>
                        )}
                        Submit
                    </button>
                    {modalType === "edit" && (
                        <button
                            type="button"
                            className="btn btn-error w-3/12"
                            disabled={apiOkStatuses.includes(
                                Number(msg?.status),
                            )}
                            onClick={() => delStationInfo()}
                        >
                            Remove
                        </button>
                    )}
                </div>
            </form>
        </Modal>
    );
};

export default EditStatsModal;
