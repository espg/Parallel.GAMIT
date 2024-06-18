import { forwardRef } from "react";
import DatePicker from "react-datepicker";

import { woTz } from "@utils/index";
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
    const CustomInputTime = forwardRef<HTMLButtonElement>(
        ({ value, onClick }: any, ref) => {
            return (
                <button
                    className="badge badge-ghost"
                    type="button"
                    onClick={onClick}
                    ref={ref}
                >
                    {value}
                </button>
            );
        },
    );

    const CustomInputDate = forwardRef<HTMLButtonElement>(
        ({ value, onClick }: any, ref) => {
            return (
                <button
                    className="badge badge-ghost"
                    type="button"
                    onClick={onClick}
                    ref={ref}
                >
                    {value}
                </button>
            );
        },
    );

    return (
        <>
            <DatePicker
                className="text-center"
                selected={typeKey === "date_start" ? startDate : endDate}
                onChange={(date) => {
                    if (date) {
                        const dateWoTZ = new Date(
                            woTz(date) ?? "",
                        ).toISOString();
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
                customInput={<CustomInputDate />}
                peekNextMonth
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                dateFormat="MM/dd/yyyy"
            />

            <DatePicker
                className="text-center"
                selected={typeKey === "date_start" ? startDate : endDate}
                onChange={(time) => {
                    if (time) {
                        const timeWoTZ = new Date(
                            woTz(time) ?? "",
                        ).toISOString();
                        if (typeKey === "date_start") {
                            setStartDate(time);
                        } else {
                            setEndDate(time);
                        }
                        dispatch({
                            type: "change_value",
                            payload: {
                                inputName: typeKey,
                                inputValue: timeWoTZ,
                            },
                        });
                    }
                }}
                customInput={<CustomInputTime />}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={1}
                timeCaption="Time"
                dateFormat="h:mm aa"
            />
        </>
    );
};

export default DateTimePicker;
