import { useOutletContext } from "react-router-dom";

import { MapStation, Photo } from "@componentsReact";

import { StationData } from "@types";

const StationMain = () => {
    const station: StationData = useOutletContext();

    return (
        <div>
            <h1 className="text-2xl font-base text-center">
                {station?.country_code?.toUpperCase()}
            </h1>
            <div className="flex w-full pr-2 space-x-2 px-2">
                <MapStation station={station} />
                <Photo
                    phArray={
                        [
                            // {
                            //     desc: "",
                            //     src: "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg",
                            // },
                            // {
                            //     desc: "",
                            //     src: "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg",
                            // },
                        ]
                    }
                />
            </div>
        </div>
    );
};

export default StationMain;
