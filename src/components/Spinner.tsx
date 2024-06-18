interface SpinnerProps {
    size: string;
}

const Spinner = ({ size }: SpinnerProps) => {
    return <span className={`loading loading-spinner loading-${size} `}></span>;
};

export default Spinner;
