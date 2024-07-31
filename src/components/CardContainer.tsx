import { ReactNode } from "react";

interface Props {
    title: string;
    titlePosition?: "center" | "start" | "end";
    children: ReactNode;
}

const CardContainer = ({ title, titlePosition, children }: Props) => {
    return (
        <div className="flex flex-col pt-6 w-full">
            <div className="card bg-base-200 p-4 space-y-2 h-full">
                {title.length > 0 && (
                    <div className="w-full inline-flex">
                        <h3
                            className={`font-bold ${titlePosition ? "text-" + titlePosition : "text-center"} text-3xl my-2 grow`}
                        >
                            {title}
                        </h3>
                    </div>
                )}
                <div className="w-full inline-flex space-x-4 justify-center">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default CardContainer;
