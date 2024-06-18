interface TableSkeletonProps {
    titleSize?: string;
    mainSize?: string;
}

const TableSkeleton = ({ titleSize, mainSize }: TableSkeletonProps) => {
    return (
        <div className="flex flex-col">
            <div
                className={`skeleton h-[${titleSize ? titleSize : "40px"}] w-5/12 self-center`}
            >
                {" "}
            </div>
            <div
                className={`skeleton h-[${mainSize ? mainSize : "400px"}] mt-4 w-full`}
            >
                {" "}
            </div>
        </div>
    );
};

export default TableSkeleton;
