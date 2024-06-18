import { FormReducerAction } from "@hooks/useFormReducer";

interface MenuContentProps {
    value: string;
    typeKey: string;
    dispatch: (value: FormReducerAction) => void;
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
    typeKey,
    dispatch,
    setShowMenu,
}: MenuContentProps) => {
    return (
        <li className="py-2 font-semibold text-lg w-full">
            <a
                className="w-full justify-center text-center"
                onClick={() => {
                    dispatch({
                        type: "change_value",
                        payload: {
                            inputName: typeKey,
                            inputValue: value,
                        },
                    });
                    setShowMenu(undefined);
                }}
            >
                {value}
            </a>
        </li>
    );
};

export default MenuContent;
