import { AxiosInstance } from "axios";
import { axiosInstanceUnauth } from "./axiosconfig";
import { GetParams, StationData, User } from "@types";
import { transformParams } from "@utils";
/* <----------------------- UN AUTH -----------------------------> */

export async function loginService<T>(
    username: string,
    password: string,
): Promise<T> {
    try {
        const data = { username, password };
        const response = await axiosInstanceUnauth.post(`api/token`, data);
        return response.data as Promise<T>;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function refreshTokenService<T>(token: string): Promise<T> {
    try {
        const response = await axiosInstanceUnauth.post(`api/token/refresh`, {
            refresh: token,
        });
        return response.data as Promise<T>;
    } catch (error) {
        return Promise.reject(error);
    }
}

/* <------------------------------------------------------------> */

/*
               SERVICIOS CON AUTENTICACION

 <------------------------- AUTH -----------------------------> */
// Users
export async function getUsersService<T>(
    api: AxiosInstance,
    params?: GetParams,
): Promise<T> {
    try {
        const paramsArr = params ? transformParams(params) : "";
        const response = await api.get(
            `api/users${paramsArr.length > 0 ? `?${paramsArr}` : ""}`,
        );
        return response.data as Promise<T>;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function getUserPhotoService<T>(
    api: AxiosInstance,
    id: number,
): Promise<T> {
    try {
        const response = await api.get(`api/users/${id}/photo`, {
            responseType: "blob",
            headers: {
                "Content-Type": "image/*",
            },
        });
        return response.data as Promise<T>;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function getUserService<T>(
    api: AxiosInstance,
    id: number,
): Promise<T> {
    try {
        const response = await api.get(`api/users/${id}`);
        return response.data as Promise<T>;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function postUserService<T>(
    api: AxiosInstance,
    data: FormData,
): Promise<T> {
    try {
        const response = await api.post(`api/users`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data as Promise<T>;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function patchUserService<T>(
    api: AxiosInstance,
    id: number,
    data: FormData | User | { is_active: boolean },
): Promise<T> {
    try {
        const response = await api.patch(`api/users/${id}`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data as Promise<T>;
    } catch (error) {
        return Promise.reject(error);
    }
}
// Roles
export async function getRolesService<T>(
    api: AxiosInstance,
    params?: GetParams,
): Promise<T> {
    try {
        const paramsArr = params ? transformParams(params) : "";
        const response = await api.get(
            `api/roles${paramsArr.length > 0 ? `?${paramsArr}` : ""}`,
        );
        return response.data as Promise<T>;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function getRoleService<T>(
    api: AxiosInstance,
    id: number,
): Promise<T> {
    try {
        const response = await api.get(`api/roles/${id}`);
        return response.data as Promise<T>;
    } catch (error) {
        return Promise.reject(error);
    }
}

type RoleData = {
    name: string;
    role_api: boolean;
    allow_all: boolean;
    endpoints_clusters: number[] | [];
    pages: number[] | [];
};

export async function postRoleService<T>(
    api: AxiosInstance,
    data: RoleData,
): Promise<T> {
    try {
        const response = await api.post(`api/roles`, data);
        return response.data as Promise<T>;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function putRoleService<T>(
    api: AxiosInstance,
    id: number,
    data: RoleData,
): Promise<T> {
    try {
        const response = await api.put(`api/roles/${id}`, data);
        return response.data as Promise<T>;
    } catch (error) {
        return Promise.reject(error);
    }
}

// Endpoint Clusters

export async function getEndpointClustersService<T>(
    api: AxiosInstance,
): Promise<T> {
    try {
        const response = await api.get(`api/endpoints-clusters`);
        return response.data as Promise<T>;
    } catch (error) {
        return Promise.reject(error);
    }
}

// Pages
export async function getPagesService<T>(api: AxiosInstance): Promise<T> {
    try {
        const response = await api.get(`api/pages`);
        return response.data as Promise<T>;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function getPageService<T>(
    api: AxiosInstance,
    id: number,
): Promise<T> {
    try {
        const response = await api.get(`api/pages/${id}`);
        return response.data as Promise<T>;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function postPageService<T>(
    api: AxiosInstance,
    data: { url: string; description: string },
): Promise<T> {
    try {
        const response = await api.post(`api/pages`, data);
        return response.data as Promise<T>;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function putPageService<T>(
    api: AxiosInstance,
    id: number,
    data: { url: string; description: string },
): Promise<T> {
    try {
        const response = await api.put(`api/pages/${id}`, data);
        return response.data as Promise<T>;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function delPageService<T>(
    api: AxiosInstance,
    id: number,
): Promise<T> {
    try {
        const response = await api.delete(`api/pages/${id}`);
        return response.data as Promise<T>;
    } catch (error) {
        return Promise.reject(error);
    }
}

// Networks
export async function getNetworksService<T>(api: AxiosInstance): Promise<T> {
    try {
        const response = await api.get(`api/networks`);
        return response.data as Promise<T>;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function getNetworkService<T>(
    api: AxiosInstance,
    id: number,
): Promise<T> {
    try {
        const response = await api.get(`api/networks/${id}`);
        return response.data as Promise<T>;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function postNetworkService<T>(
    api: AxiosInstance,
    data: { network_code: string; network_name: string },
): Promise<T> {
    try {
        const response = await api.post(`api/networks`, data);
        return response.data as Promise<T>;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function putNetworkService<T>(
    api: AxiosInstance,
    id: number,
    data: { network_name: string },
): Promise<T> {
    try {
        const response = await api.put(`api/networks/${id}`, data);
        return response.data as Promise<T>;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function delNetworkService<T>(
    api: AxiosInstance,
    id: number,
): Promise<T> {
    try {
        const response = await api.delete(`api/networks/${id}`);
        return response.data as Promise<T>;
    } catch (error) {
        return Promise.reject(error);
    }
}

// Stations
export async function getStationInfoService<T>(
    api: AxiosInstance,
    params: GetParams,
): Promise<T> {
    try {
        const paramsArr = params ? transformParams(params) : "";
        const response = await api.get(
            `api/station-info${paramsArr.length > 0 ? `?${paramsArr}` : ""}`,
        );
        return response.data as Promise<T>;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function postStationInfoService<T>(
    api: AxiosInstance,
    body: object,
): Promise<T> {
    try {
        const response = await api.post("api/station-info", body);
        return response.data as Promise<T>;
    } catch (err) {
        return Promise.reject(err);
    }
}

export async function putStationInfoService<T>(
    api: AxiosInstance,
    id: number,
    body: object,
): Promise<T> {
    try {
        const response = await api.put(`api/station-info/${id}`, body);
        return response.data as Promise<T>;
    } catch (err) {
        return Promise.reject(err);
    }
}

export async function delStationInfoService<T>(
    api: AxiosInstance,
    id: number,
): Promise<T> {
    try {
        const response = await api.delete(`api/station-info/${id}`);
        return response.data as Promise<T>;
    } catch (err) {
        return Promise.reject(err);
    }
}

export async function getStationsService<T>(
    api: AxiosInstance,
    params?: GetParams,
    options?: { signal?: AbortSignal },
): Promise<T> {
    try {
        const paramsArr = params ? transformParams(params) : "";
        const response = await api.get(
            `api/stations${paramsArr.length > 0 ? `?${paramsArr}` : ""}`,
            { signal: options?.signal },
        );
        return response.data as Promise<T>;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function getStationService<T>(
    api: AxiosInstance,
    id: number,
): Promise<T> {
    try {
        const response = await api.get(`api/stations/${id}`);
        return response.data as Promise<T>;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function postStationService<T>(
    api: AxiosInstance,
    data: StationData,
): Promise<T> {
    try {
        const response = await api.post(`api/stations`, data);
        return response.data as Promise<T>;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function patchStationService<T>(
    api: AxiosInstance,
    id: number,
    data: any,
): Promise<T> {
    try {
        const response = await api.patch(`api/stations/${id}`, data);
        return response.data as Promise<T>;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function delStationService<T>(
    api: AxiosInstance,
    id: number,
): Promise<T> {
    try {
        const response = await api.delete(`api/stations/${id}`);
        return response.data as Promise<T>;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function getStationMetaService<T>(
    api: AxiosInstance,
    id: number,
): Promise<T> {
    try {
        const response = await api.get(`api/station-meta/${id}`);
        return response.data as Promise<T>;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function patchStationMetaService<T>(
    api: AxiosInstance,
    id: number,
    data: any,
): Promise<T> {
    try {
        const response = await api.patch(`api/station-meta/${id}`, data);
        return response.data as Promise<T>;
    } catch (error) {
        return Promise.reject(error);
    }
}

// Antennas
export async function getAntennasService<T>(api: AxiosInstance): Promise<T> {
    try {
        const response = await api.get(`api/antennas`);
        return response.data as Promise<T>;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function getAntennaService<T>(
    api: AxiosInstance,
    id: number,
): Promise<T> {
    try {
        const response = await api.get(`api/antennas/${id}`);
        return response.data as Promise<T>;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function postAntennaService<T>(
    api: AxiosInstance,
    data: { antenna_code: string; antenna_description: string },
): Promise<T> {
    try {
        const response = await api.post(`api/antennas`, data);
        return response.data as Promise<T>;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function putAntennaService<T>(
    api: AxiosInstance,
    id: number,
    data: { antenna_description: string }, // FIXME:
): Promise<T> {
    try {
        const response = await api.put(`api/antennas/${id}`, data);
        return response.data as Promise<T>;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function delAntennaService<T>(
    api: AxiosInstance,
    id: number,
): Promise<T> {
    try {
        const response = await api.delete(`api/antennas/${id}`);
        return response.data as Promise<T>;
    } catch (error) {
        return Promise.reject(error);
    }
}

// Receivers

export async function getReceiversService<T>(api: AxiosInstance): Promise<T> {
    try {
        const response = await api.get(`api/receivers`);
        return response.data as Promise<T>;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function getReceiverService<T>(
    api: AxiosInstance,
    id: number,
): Promise<T> {
    try {
        const response = await api.get(`api/receivers/${id}`);
        return response.data as Promise<T>;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function postReceiverService<T>(
    api: AxiosInstance,
    data: { receiver_code: string; receiver_description: string },
): Promise<T> {
    try {
        const response = await api.post(`api/receivers`, data);
        return response.data as Promise<T>;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function putReceiverService<T>(
    api: AxiosInstance,
    id: number,
    data: { receiver_description: string }, // FIXME:
): Promise<T> {
    try {
        const response = await api.put(`api/receivers/${id}`, data);
        return response.data as Promise<T>;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function delReceiverService<T>(
    api: AxiosInstance,
    id: number,
): Promise<T> {
    try {
        const response = await api.delete(`api/receivers/${id}`);
        return response.data as Promise<T>;
    } catch (error) {
        return Promise.reject(error);
    }
}

// Height Codes

export async function getHeightCodesService<T>(
    api: AxiosInstance,
    params?: GetParams,
): Promise<T> {
    try {
        const paramsArr = params ? transformParams(params) : "";
        const response = await api.get(
            `api/gamit-htc${paramsArr.length > 0 ? `?${paramsArr}` : ""}`,
        );
        return response.data as Promise<T>;
    } catch (error) {
        return Promise.reject(error);
    }
}

// Countries

export async function getCountriesService<T>(api: AxiosInstance): Promise<T> {
    try {
        const response = await api.get(`api/countries`);
        return response.data as Promise<T>;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function getCountryService<T>(
    api: AxiosInstance,
    id: number,
): Promise<T> {
    try {
        const response = await api.get(`api/countries/${id}`);
        return response.data as Promise<T>;
    } catch (error) {
        return Promise.reject(error);
    }
}

// Rinex

export async function getRinexService<T>(
    api: AxiosInstance,
    params?: GetParams,
): Promise<T> {
    try {
        const paramsArr = params ? transformParams(params) : "";
        const response = await api.get(
            `api/rinex${paramsArr.length > 0 ? `?${paramsArr}` : ""}`,
        );
        return response.data as Promise<T>;
    } catch (error) {
        return Promise.reject(error);
    }
}

// Overview

// Monuments CRUD
export async function getMonumentsTypesService<T>(
    api: AxiosInstance,
    params?: GetParams,
): Promise<T> {
    try {
        const paramsArr = params ? transformParams(params) : "";
        const response = await api.get(
            `api/monument-types${paramsArr.length > 0 ? `?${paramsArr}` : ""}`,
        );
        return response.data as Promise<T>;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function getMonumentsTypesByIdService<T>(
    api: AxiosInstance,
    id: number,
): Promise<T> {
    try {
        const response = await api.get(`api/monument-types/${id}`);
        return response.data as Promise<T>;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function postMonumentTypesService<T>(
    api: AxiosInstance,
    data: FormData,
): Promise<T> {
    try {
        const response = await api.post(`api/monument-types`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data as Promise<T>;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function patchMonumentTypesService<T>(
    api: AxiosInstance,
    id: number,
    data: FormData | any,
): Promise<T> {
    try {
        const response = await api.patch(`api/monument-types/${id}`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data as Promise<T>;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function delMonumentTypesService<T>(
    api: AxiosInstance,
    id: number,
): Promise<T> {
    try {
        const response = await api.delete(`api/monument-types/${id}`);
        return response.data as Promise<T>;
    } catch (error) {
        return Promise.reject(error);
    }
}

// Station Status CRUD

export async function getStationStatusService<T>(
    api: AxiosInstance,
    params?: GetParams,
): Promise<T> {
    try {
        const paramsArr = params ? transformParams(params) : "";
        const response = await api.get(
            `api/station-status${paramsArr.length > 0 ? `?${paramsArr}` : ""}`,
        );
        return response.data as Promise<T>;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function getStationStatusByIdService<T>(
    api: AxiosInstance,
    id: number,
): Promise<T> {
    try {
        const response = await api.get(`api/station-status/${id}`);
        return response.data as Promise<T>;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function postStationStatusService<T>(
    api: AxiosInstance,
    data: { name: string },
): Promise<T> {
    try {
        const response = await api.post(`api/station-status`, data);
        return response.data as Promise<T>;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function patchStationStatusService<T>(
    api: AxiosInstance,
    id: number,
    data: { name: string },
): Promise<T> {
    try {
        const response = await api.patch(`api/monument-types/${id}`, data);
        return response.data as Promise<T>;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function delStationStatusService<T>(
    api: AxiosInstance,
    id: number,
): Promise<T> {
    try {
        const response = await api.delete(`api/station-status/${id}`);
        return response.data as Promise<T>;
    } catch (error) {
        return Promise.reject(error);
    }
}

// Station Roles CRUD

export async function getStationRolesService<T>(
    api: AxiosInstance,
    params?: GetParams,
): Promise<T> {
    try {
        const paramsArr = params ? transformParams(params) : "";
        const response = await api.get(
            `api/station-roles${paramsArr.length > 0 ? `?${paramsArr}` : ""}`,
        );
        return response.data as Promise<T>;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function postStationRolesService<T>(
    api: AxiosInstance,
    data: { name: string },
): Promise<T> {
    try {
        const response = await api.post(`api/station-roles`, data);
        return response.data as Promise<T>;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function patchStationRolesService<T>(
    api: AxiosInstance,
    id: number,
    data: { name: string },
): Promise<T> {
    try {
        const response = await api.patch(`api/station-roles/${id}`, data);
        return response.data as Promise<T>;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function delStationRolesService<T>(
    api: AxiosInstance,
    id: number,
): Promise<T> {
    try {
        const response = await api.delete(`api/station-roles/${id}`);
        return response.data as Promise<T>;
    } catch (error) {
        return Promise.reject(error);
    }
}

// Station Types CRUD

export async function getStationTypesService<T>(
    api: AxiosInstance,
    params?: GetParams,
): Promise<T> {
    try {
        const paramsArr = params ? transformParams(params) : "";
        const response = await api.get(
            `api/station-types${paramsArr.length > 0 ? `?${paramsArr}` : ""}`,
        );
        return response.data as Promise<T>;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function getStationTypesByIdService<T>(
    api: AxiosInstance,
    id: number,
): Promise<T> {
    try {
        const response = await api.get(`api/station-types/${id}`);
        return response.data as Promise<T>;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function postStationTypesService<T>(
    api: AxiosInstance,
    data: { name: string },
): Promise<T> {
    try {
        const response = await api.post(`api/station-types`, data);
        return response.data as Promise<T>;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function patchStationTypesService<T>(
    api: AxiosInstance,
    id: number,
    data: { name: string },
): Promise<T> {
    try {
        const response = await api.patch(`api/station-types/${id}`, data);
        return response.data as Promise<T>;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function delStationTypesService<T>(
    api: AxiosInstance,
    id: number,
): Promise<T> {
    try {
        const response = await api.delete(`api/station-types/${id}`);
        return response.data as Promise<T>;
    } catch (error) {
        return Promise.reject(error);
    }
}

// People CRUD

export async function getPeopleService<T>(
    api: AxiosInstance,
    params?: GetParams,
): Promise<T> {
    try {
        const paramsArr = params ? transformParams(params) : "";
        const response = await api.get(
            `api/people${paramsArr.length > 0 ? `?${paramsArr}` : ""}`,
        );
        return response.data as Promise<T>;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function postPeopleService<T>(
    api: AxiosInstance,
    data: FormData,
): Promise<T> {
    try {
        const response = await api.post(`api/people`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data as Promise<T>;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function patchPeopleService<T>(
    api: AxiosInstance,
    id: number,
    data: FormData | any,
): Promise<T> {
    try {
        const response = await api.patch(`api/people/${id}`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data as Promise<T>;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function delPeopleService<T>(
    api: AxiosInstance,
    id: number,
): Promise<T> {
    try {
        const response = await api.delete(`api/people/${id}`);
        return response.data as Promise<T>;
    } catch (error) {
        return Promise.reject(error);
    }
}

// FIN Overview

// CRD role-person-station

export async function getRolePersonStationService<T>(
    api: AxiosInstance,
    params?: GetParams,
): Promise<T> {
    try {
        const paramsArr = params ? transformParams(params) : "";
        const response = await api.get(
            `api/role-person-station${paramsArr.length > 0 ? `?${paramsArr}` : ""}`,
        );
        return response.data as Promise<T>;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function postRolePersonStationService<T>(
    api: AxiosInstance,
    data: { role: string; person: string },
): Promise<T> {
    try {
        const response = await api.post(`api/role-person-station`, data);
        return response.data as Promise<T>;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function delRolePersonStationService<T>(
    api: AxiosInstance,
    id: number,
): Promise<T> {
    try {
        const response = await api.delete(`api/role-person-station/${id}`);
        return response.data as Promise<T>;
    } catch (error) {
        return Promise.reject(error);
    }
}

/* <------------------------------------------------------------> */
