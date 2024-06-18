import { RolesTable, UsersTable } from "@componentsReact";

const Users = () => {
    return (
        <div
            className="my-auto flex xl:space-x-2 xl:mt-4 
        xl:flex-col xl:items-center xl:space-y-4 space-x-4 
        justify-center transition-all duration-200 pb-4"
        >
            <UsersTable />
            <RolesTable />
        </div>
    );
};

export default Users;
