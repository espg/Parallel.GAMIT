import { woTz } from "@utils";
import { FormReducerAction } from "@hooks/useFormReducer";

interface DatetimePickerProps {
    typeKey: string;
    startDate: Date | null;
    endDate: Date | null;
    setStartDate: React.Dispatch<React.SetStateAction<Date | null>>;
    setEndDate: React.Dispatch<React.SetStateAction<Date | null>>;
    dispatch: (value: FormReducerAction) => void;
}

const DateTimePicker = ({
    typeKey,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    dispatch,
}: DatetimePickerProps) => {
    const CustomTimeInput = ({
        date,
        onChangeCustom,
    }: {
        date: Date | null;
        onChangeCustom: (date: Date, time: string) => void;
    }) => {
        const value =
            date instanceof Date ? date.toLocaleTimeString("it-IT") : "";
        return (
            <input
                type="time"
                step="1"
                value={value}
                onChange={(e) =>
                    onChangeCustom(date ?? new Date(), e.target.value)
                }
            />
        );
    };

    const handleChangeTime = (date: Date, time: string) => {
        const [hh, mm, ss] = time.split(":");
        const targetDate = date instanceof Date ? date : new Date();
        targetDate.setHours(Number(hh) || 0, Number(mm) || 0, Number(ss) || 0);
        if (typeKey === "date_start") {
            setStartDate(targetDate);
        } else {
            setEndDate(targetDate);
        }

        const timeWoTZ = new Date(woTz(date) ?? "").toISOString();

        dispatch({
            type: "change_value",
            payload: {
                inputName: typeKey,
                inputValue: timeWoTZ,
            },
        });
    };

    return (
        <>
            <div className="badge badge-ghost">
                <input
                    type="date"
                    // selected={typeKey === "date_start" ? startDate : endDate}
                    defaultValue={
                        typeKey === "date_start" && startDate
                            ? startDate.toISOString().split("T")[0]
                            : typeKey === "date_end" && endDate
                              ? endDate.toISOString().split("T")[0]
                              : ""
                    }
                    onChange={(e) => {
                        const date = new Date(e.target.value);
                        if (date) {
                            const dateWoTZ = date.toISOString();

                            if (typeKey === "date_start") {
                                setStartDate(date);
                            } else {
                                setEndDate(date);
                            }
                            dispatch({
                                type: "change_value",
                                payload: {
                                    inputName: typeKey,
                                    inputValue: dateWoTZ,
                                },
                            });
                        }
                    }}
                />
            </div>

            <div className="badge badge-ghost">
                <CustomTimeInput
                    date={typeKey === "date_start" ? startDate : endDate}
                    onChangeCustom={handleChangeTime}
                />
            </div>
        </>
    );
};

export default DateTimePicker;
