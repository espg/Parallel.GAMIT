import React, { useEffect, useMemo, useState } from "react";

import { StationInfoModal } from "@componentsReact";

import {
    ArchiveBoxIcon,
    ChartBarIcon,
    InformationCircleIcon,
    PhotoIcon,
    PlusIcon,
} from "@heroicons/react/24/outline";

import { useAuth } from "@hooks/useAuth";

import { StationData } from "@types";
import { showModal } from "@utils/index";

interface SidebarProps {
    show: boolean;
    station: StationData | undefined;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Icons {
    [key: string]: any;
}

const Sidebar = ({ show, station, setShow }: SidebarProps) => {
    const { role } = useAuth();

    const [modals, setModals] = useState<
        | { show: boolean; title: string; type: "add" | "edit" | "none" }
        | undefined
    >(undefined);

    const icons: Icons = {
        Information: InformationCircleIcon,
        Photos: PhotoIcon,
        Equipment: ArchiveBoxIcon,
        Stats: ChartBarIcon,
        Additional: PlusIcon,
    };

    // TODO: Cuando halla pages cambiar titulos estaticos por dinamicos

    const longTitles = [
        "Information",
        "Photos",
        "Equipment",
        "Stats",
        "Additional",
    ];

    // const admTitles = ["Admin", "Users", "Settings"];
    const sidebarWidth = show ? "w-72" : "w-32";

    const userRole = useMemo(() => {
        return role;
    }, [role]);

    useEffect(() => {
        modals?.show && showModal(modals.title);
    }, [modals]);

    return (
        <>
            {
                /*userRole === "1" && AGREGAR SI VAMOS A HANDLEAR X ROLE */ station && (
                    <div
                        className="left-0 top-0 min-h-full pt-[8vh] bg-gray-800"
                        onMouseEnter={() => setShow(true)}
                        onMouseLeave={() => setShow(false)}
                    >
                        <div className="flex sm:flex-row sm:justify-around">
                            <div
                                className={
                                    sidebarWidth +
                                    " transition-all duration-200"
                                }
                            >
                                <nav className="mt-10 space-y-8 flex flex-col items-center text-center">
                                    {longTitles.map((title, idx) => (
                                        <div
                                            className="flex w-full justify-center"
                                            key={idx}
                                        >
                                            <div className="flex items-center justify-center w-4/12">
                                                {icons[title] &&
                                                    React.createElement(
                                                        icons[title],
                                                        {
                                                            className: `h-8 w-full ${show ? "ml-16" : ""} text-white mt-2`,
                                                        },
                                                    )}
                                            </div>

                                            {show && station && (
                                                <div className="flex items-center justify-center w-8/12">
                                                    <button
                                                        className="py-2 w-8/12 self-center flex items-center 
                                                transition-colors hover:text-white hover:bg-gray-600 duration-200  
                                                text-gray-400 rounded-lg justify-center"
                                                        key={title + idx}
                                                        onClick={() => {
                                                            setModals({
                                                                show: true,
                                                                title: title,
                                                                type: "none",
                                                            });
                                                        }}
                                                    >
                                                        <span className="mx-4 text-lg font-normal">
                                                            {title}
                                                        </span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </nav>
                            </div>
                        </div>
                    </div>
                )
            }
            {modals?.show && modals.title === "Information" && (
                <StationInfoModal
                    close={false}
                    station={station}
                    size={"xl"}
                    setModalState={setModals}
                />
            )}
        </>
    );
};

export default Sidebar;
