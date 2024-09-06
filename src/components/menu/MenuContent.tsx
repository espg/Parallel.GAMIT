import { CheckIcon } from "@heroicons/react/24/outline";
import { FormReducerAction } from "@hooks/useFormReducer";

interface MenuContentProps {
    value: string;
    multiple?: boolean;
    multipleValue?: string;
    alterValue?: string;
    typeKey: string;
    disabled?: boolean;
    alterFunction?: () => void;
    dispatch?: (value: FormReducerAction) => void;
    setShowMenu: React.Dispatch<
        React.SetStateAction<
            | {
                  type: string;
                  show: boolean;
              }
            | undefined
        >
    >;
}

const MenuContent = ({
    value,
    multiple,
    multipleValue,
    alterValue,
    typeKey,
    disabled,
    dispatch,
    alterFunction,
    setShowMenu,
}: MenuContentProps) => {
    const handleClick = () => {
        let newValue = alterValue ? alterValue : value;

        if (multiple) {
            let valuesArray = multipleValue ? multipleValue.split(",") : [];
            if (valuesArray.includes(value)) {
                valuesArray = valuesArray.filter((v) => v !== value);
            } else {
                valuesArray.push(value);
            }
            newValue = valuesArray.join(",");
        }
        dispatch &&
            dispatch({
                type: "change_value",
                payload: {
                    inputName: typeKey,
                    inputValue: newValue,
                },
            });

        !multiple && setShowMenu(undefined);
    };

    return (
        <li
            className={`py-2 font-semibold text-lg w-full ${disabled ? "disabled" : ""}`}
        >
            <button
                className={`w-full justify-center text-center ${disabled ? "btn-disabled" : ""}`}
                type="button"
                onClick={() => {
                    dispatch ? handleClick() : alterFunction && alterFunction();
                }}
            >
                {value}{" "}
                {multiple && multipleValue?.split(",").includes(value) ? (
                    <span className="absolute right-10">
                        <CheckIcon className="size-6" />
                    </span>
                ) : null}
            </button>
        </li>
    );
};

export default MenuContent;
