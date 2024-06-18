import { useEffect, useMemo, useState } from "react";
import { EditUsersModal, Pagination, Table } from "@componentsReact";

import { useAuth, useApi } from "@hooks";
import { getUsersService } from "@services";

import { GetParams, UsersData, UsersServiceData } from "@types";
import { showModal } from "@utils";

const UsersTable = () => {
    const { token, logout } = useAuth();
    const api = useApi(token, logout);

    const bParams: GetParams = useMemo(() => {
        return {
            limit: 5,
            offset: 0,
        };
    }, []);

    const [modals, setModals] = useState<
        | { show: boolean; title: string; type: "add" | "edit" | "none" }
        | undefined
    >(undefined);

    const [loading, setLoading] = useState<boolean>(false);
    const [params, setParams] = useState<GetParams>(bParams);

    const [users, setUsers] = useState<UsersData[]>([]);
    const [user, setUser] = useState<UsersData | undefined>(undefined);

    const [activePage, setActivePage] = useState<number>(1);
    const [pages, setPages] = useState<number>(0);
    const PAGES_TO_SHOW = 2;
    const REGISTERS_PER_PAGE = 5; // Es el mismo que params.limit

    const getUsers = async () => {
        try {
            setLoading(true);
            const res = await getUsersService<UsersServiceData>(api, params);
            setUsers(res.data);
            setPages(Math.ceil(res.total_count / bParams.limit));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const paginateUsers = async (newParams: GetParams) => {
        try {
            setLoading(true);
            const res = await getUsersService<UsersServiceData>(api, newParams);
            setUsers(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handlePage = (page: number) => {
        if (page < 1 || page > pages) return;
        let newParams;
        if (page === 1) {
            newParams = {
                ...params,
                limit: REGISTERS_PER_PAGE * 1,
                offset: REGISTERS_PER_PAGE * (page - 1),
            };
        } else {
            newParams = {
                ...params,
                limit: REGISTERS_PER_PAGE,
                offset: REGISTERS_PER_PAGE * (page - 1),
            };
        }

        setParams(newParams);
        setActivePage(page);
        paginateUsers(newParams);
    };

    useEffect(() => {
        getUsers();
    }, []); // eslint-disable-line

    const titles = [
        "First Name",
        "Last Name",
        "Username",
        "Role",
        "Email",
        "Phone",
        "Address",
        "Active",
    ];

    const body = useMemo(() => {
        return users?.map((user) =>
            Object.values({
                first_name: user.first_name,
                last_name: user.last_name,
                username: user.username,
                role: user.role.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                active: user.is_active,
            }),
        );
    }, [users]);

    useEffect(() => {
        modals?.show && showModal(modals.title);
    }, [modals]);

    return (
        <div className="flex flex-col">
            <div className="card bg-base-200 p-4 space-y-2">
                <div className="flex w-full justify-between">
                    <h2 className="card-title">Users</h2>
                    <div className="w-6/12 flex justify-end space-x-2">
                        <button
                            className="btn btn-neutral w-4/12 self-end no-animation"
                            onClick={() =>
                                setModals({
                                    show: true,
                                    title: "EditUsers",
                                    type: "add",
                                })
                            }
                        >
                            {" "}
                            + User{" "}
                        </button>
                    </div>
                </div>
                <Table
                    titles={body ? titles : []}
                    body={body}
                    table={"Users"}
                    loading={loading}
                    dataOnly={false}
                    onClickFunction={() =>
                        setModals({
                            show: true,
                            title: "EditUsers",
                            type: "edit",
                        })
                    }
                    setState={setUser}
                    state={users}
                />
                {body ? (
                    <Pagination
                        pages={pages}
                        pagesToShow={PAGES_TO_SHOW}
                        activePage={activePage}
                        handlePage={handlePage}
                    />
                ) : null}
            </div>
            {modals?.show && modals.title === "EditUsers" && (
                <EditUsersModal
                    User={user}
                    modalType={modals.type}
                    setStateModal={setModals}
                    setUser={setUser}
                    reFetch={getUsers}
                />
            )}
        </div>
    );
};

export default UsersTable;
