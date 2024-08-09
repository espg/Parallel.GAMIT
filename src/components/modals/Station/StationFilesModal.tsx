import { Modal } from "@componentsReact";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { StationMetadataServiceData } from "@types";
import { useState } from "react";

interface Props {
    stationId: string | undefined;
    modalType: string;
    reFetch: () => void;
    setStateModal: React.Dispatch<
        React.SetStateAction<
            | { show: boolean; title: string; type: "add" | "edit" | "none" }
            | undefined
        >
    >;
}

const StationFilesModal = ({
    stationId,
    modalType,
    reFetch,
    setStateModal,
}: Props) => {
    const handleCloseModal = () => {
        reFetch();
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };

    return (
        <Modal
            close={false}
            modalId={"StationFiles"}
            size={"smPlus"}
            handleCloseModal={() => handleCloseModal()}
            setModalState={setStateModal}
        >
            <div className="w-full flex grow mb-2">
                <h3 className="font-bold text-center text-2xl my-2 w-full self-center">
                    Station Files
                </h3>

                <button
                    className="btn btn-ghost btn-circle ml-2"
                    // onClick={() => {
                    //     setModals({
                    //         show: true,
                    //         title: "EditStats",
                    //         type: "add",
                    //     });
                    //     setStationInfo(undefined);
                    // }}
                >
                    <PlusCircleIcon
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-8 h-10"
                    />
                </button>
            </div>
            <form className="form-control space-y-4" onSubmit={handleSubmit}>
                <div className="form-control space-y-2"></div>
            </form>
        </Modal>
    );
};

export default StationFilesModal;
