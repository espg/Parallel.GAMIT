import CardContainer from "./CardContainer";

interface Props {
    phArray: { src: string; desc: string }[];
}

const Photo = ({ phArray }: Props) => {
    return (
        <>
            <CardContainer title={"Photos"}>
                <>
                    {phArray.map((s, idx) => {
                        return (
                            <div
                                key={"photo" + String(idx)}
                                className="card card-compact bg-base-100 w-4/12 shadow-xl"
                            >
                                <figure>
                                    <img
                                        src={s.src}
                                        alt={"photo" + String(idx)}
                                    />
                                </figure>
                                <div className="card-body text-center">
                                    {s.desc ?? "NONE"}
                                </div>
                            </div>
                        );
                    })}
                </>
            </CardContainer>
        </>
    );
};

export default Photo;
