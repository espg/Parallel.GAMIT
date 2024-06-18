import {
    ArrowRightEndOnRectangleIcon,
    BellIcon,
    UserCircleIcon,
    UserGroupIcon,
    UserIcon,
} from "@heroicons/react/24/outline";

import { useAuth } from "@hooks/useAuth";
import { jwtDeserializer } from "@utils/index";

import { Link } from "react-router-dom";

const Nav = () => {
    const { logout, token, userPhoto } = useAuth();

    const tokenDeserialized = jwtDeserializer(token as string);

    const userName = tokenDeserialized?.username;

    return (
        <div
            className="navbar bg-gray-800 text-white"
            style={{ maxHeight: "none", minHeight: "8vh" }}
        >
            <div className="navbar-start"></div>
            <div className="navbar-center">
                <Link to={"/"} className="text-2xl ml-6">
                    Parallel.GAMIT
                </Link>
            </div>
            <div className="navbar-end">
                <button className="btn btn-ghost btn-circle">
                    <div className="indicator">
                        <BellIcon
                            fill="none"
                            className="size-5"
                            strokeWidth={2}
                        />
                        <span className="badge badge-xs badge-primary indicator-item"></span>
                    </div>
                </button>
                <div className="dropdown dropdown-end">
                    <div
                        tabIndex={0}
                        role="button"
                        className="btn btn-ghost btn-circle avatar"
                    >
                        {!userPhoto ? (
                            <UserCircleIcon className="size-8" />
                        ) : (
                            <img
                                alt="User"
                                className="rounded-full w-6 h-6"
                                src={`${userPhoto ? userPhoto : ""} `}
                            />
                        )}
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content mt-3 z-30 space-y-1 p-2 shadow bg-gray-800 rounded-box w-52"
                    >
                        <div className=" border-b-[1px] border-gray-600 flex justify-center">
                            <span className="mb-2">
                                <strong>{userName?.toUpperCase()}</strong>
                            </span>
                        </div>
                        <li className="">
                            <a //TODO: CHANGE TO LINK
                                className="hover:bg-slate-600 flex justify-start "
                                onClick={() => console.log("Profile")}
                            >
                                <UserIcon className="size-6" />

                                <span className="ml-[40px]">Profile</span>
                            </a>
                        </li>
                        <li className="">
                            <Link
                                className="hover:bg-slate-600 flex justify-start focus:text-primary"
                                to={"/users"}
                            >
                                <UserGroupIcon className="size-6" />

                                <span className="ml-[40px]">Users</span>
                            </Link>
                        </li>
                        <li className="">
                            <a
                                className="hover:bg-slate-600 flex w-full justify-start"
                                onClick={() => logout(true)}
                            >
                                <ArrowRightEndOnRectangleIcon className="size-6" />

                                <span className="ml-[40px]">Logout</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Nav;
