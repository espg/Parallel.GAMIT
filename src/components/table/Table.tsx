import { Spinner } from "@componentsReact";

import { useNavigate } from "react-router-dom";

import { formattedDates } from "@utils/index";
import { findFlagUrlByIso3Code } from "country-flags-svg-v2";
import { TrashIcon } from "@heroicons/react/24/outline";

interface TableProps {
    table: string;
    titles: string[];
    body: any[][] | undefined;
    loading?: boolean;
    dataOnly?: boolean;
    deleteRegister?: boolean;
    label?: string;
    state?: any;
    setState?: any;
    onClickFunction: () => void;
}

const Table = ({
    titles,
    body,
    loading,
    dataOnly,
    deleteRegister,
    table,
    state,
    onClickFunction,
    setState,
}: TableProps) => {
    const navigate = useNavigate();

    return (
        <div className={`overflow-x-auto`}>
            <table className="table table-zebra bg-neutral-content">
                <thead>
                    <tr>
                        {titles.length > 0 ? (
                            !dataOnly && !deleteRegister ? (
                                <th className="text-center text-neutral">
                                    Modify
                                </th>
                            ) : (
                                dataOnly &&
                                deleteRegister && (
                                    <th className="text-center text-neutral"></th>
                                )
                            )
                        ) : (
                            <th className="text-center text-neutral text-2xl">
                                There is no information for this {table}
                            </th>
                        )}

                        {titles.map((title, index) => (
                            <th
                                className="text-center text-neutral"
                                key={index}
                            >
                                {title
                                    ? title?.toUpperCase().replace(/_/g, " ")
                                    : ""}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="">
                    {loading ? (
                        <tr>
                            <td
                                colSpan={titles.length + 1}
                                className="relative h-[200px]"
                            >
                                <div className="absolute inset-0 flex justify-center items-center">
                                    <Spinner size="lg" />
                                </div>
                            </td>
                        </tr>
                    ) : (
                        body?.map((row, index) => (
                            <tr
                                key={index + 1}
                                className={`${dataOnly && "cursor-pointer hover"}`}
                            >
                                {!dataOnly && !deleteRegister ? (
                                    <td key={index} className="text-center">
                                        <button
                                            className="btn btn-sm btn-circle btn-ghost"
                                            onClick={() => {
                                                onClickFunction();
                                                setState(state?.[index]);
                                            }}
                                        >
                                            📝
                                        </button>
                                    </td>
                                ) : (
                                    dataOnly &&
                                    deleteRegister && (
                                        <td key={index} className="text-center">
                                            <button
                                                className="btn btn-sm btn-square btn-ghost"
                                                onClick={() => {
                                                    onClickFunction();
                                                    setState(state?.[index]);
                                                }}
                                            >
                                                <TrashIcon className="size-6 text-red-600" />
                                            </button>
                                        </td>
                                    )
                                )}
                                {row.map(
                                    (
                                        val: string | boolean | number,
                                        idx: number,
                                    ) => {
                                        const isDate =
                                            !isNaN(Date.parse(val as string)) &&
                                            typeof val === "string" &&
                                            val?.includes("T");

                                        const flag =
                                            titles[idx] === "country_code" &&
                                            val &&
                                            findFlagUrlByIso3Code(
                                                val as string,
                                            );

                                        const base64Str =
                                            "data:image/png;base64,";

                                        return (
                                            <td
                                                key={idx}
                                                title={String(val) ?? ""}
                                                className={`text-center 
                                                    ${
                                                        titles[idx] ===
                                                            "country_code" &&
                                                        "flex justify-center"
                                                    }
                                                    ${
                                                        row?.[idx] === false
                                                            ? "text-red-600"
                                                            : row?.[idx] ===
                                                                  true &&
                                                              "text-green-600"
                                                    }
                                                        `}
                                                onClick={() => {
                                                    dataOnly &&
                                                        table === "Stations" &&
                                                        navigate(
                                                            `/${state?.[index].network_code}/${state?.[index].station_code}`,
                                                        );
                                                }}
                                            >
                                                {titles[idx] ===
                                                    "country_code" &&
                                                    val && (
                                                        <img
                                                            width={30}
                                                            height={30}
                                                            className="mr-2"
                                                            src={`${flag}`}
                                                        />
                                                    )}

                                                {val !== "" &&
                                                titles[idx] !== "Photo" ? (
                                                    typeof val === "string" ? (
                                                        val?.length > 15 &&
                                                        !isDate ? (
                                                            val?.substring(
                                                                0,
                                                                15,
                                                            ) + "..."
                                                        ) : isDate ? (
                                                            formattedDates(
                                                                new Date(val),
                                                            )
                                                        ) : (
                                                            val
                                                        )
                                                    ) : typeof val ===
                                                      "boolean" ? (
                                                        val ? (
                                                            "✔"
                                                        ) : (
                                                            "✘"
                                                        )
                                                    ) : typeof val ===
                                                      "number" ? (
                                                        val
                                                    ) : (
                                                        "-"
                                                    )
                                                ) : val !== "" &&
                                                  val !== null &&
                                                  titles[idx] === "Photo" ? (
                                                    <div className="avatar">
                                                        <div className="w-14 mask mask-squircle ">
                                                            <img
                                                                src={
                                                                    base64Str +
                                                                    val
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    "-"
                                                )}
                                            </td>
                                        );
                                    },
                                )}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
