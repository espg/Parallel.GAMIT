import { formattedDates } from "@utils/index";
import { useNavigate } from "react-router-dom";
import { Spinner } from "..";

interface TableProps {
    table: string;
    titles: string[];
    body: any[][] | undefined;
    loading?: boolean;
    dataOnly?: boolean;
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
    table,
    state,
    onClickFunction,
    setState,
}: TableProps) => {
    const navigate = useNavigate();

    return (
        <div className="overflow-x-auto">
            <table className="table table-zebra bg-neutral-content">
                <thead>
                    <tr>
                        {titles.length > 0 ? (
                            !dataOnly && (
                                <th className="text-center text-neutral">
                                    Modify
                                </th>
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
                                    .toUpperCase()
                                    .replace("_", " ")
                                    .replace("_", " ")}
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
                                {!dataOnly && (
                                    <td key={index}>
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
                                        return (
                                            <td
                                                key={idx}
                                                title={String(val) ?? ""}
                                                className={`text-center ${row?.[idx] === false ? "text-red-600" : row?.[idx] === true && "text-green-600"}`}
                                                onClick={() => {
                                                    dataOnly &&
                                                        table === "Stations" &&
                                                        navigate(
                                                            `/${state?.[index].network_code}/${state?.[index].station_code}`,
                                                        );
                                                }}
                                            >
                                                {val !== ""
                                                    ? typeof val === "string"
                                                        ? val?.length > 15 &&
                                                          !isDate
                                                            ? val?.substring(
                                                                  0,
                                                                  15,
                                                              ) + "..."
                                                            : isDate
                                                              ? formattedDates(
                                                                    new Date(
                                                                        val,
                                                                    ),
                                                                )
                                                              : val
                                                        : typeof val ===
                                                            "boolean"
                                                          ? val
                                                              ? "✔"
                                                              : "✘"
                                                          : typeof val ===
                                                              "number"
                                                            ? val
                                                            : "-"
                                                    : "-"}
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
