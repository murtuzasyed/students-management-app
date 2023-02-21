import http from "../http-common";
export enum Gender {
    Male = "MALE",
    Female = "FEMALE",
}

export type Student = {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    gender: Gender;
};
const create = (data : Omit<Student, "id">) => {
    return http.post("/students", data);
};

const getAll = () => {
    return http.get("/students");
}
const get = (id: number) => {
    return http.get(`/students/${id}`);
}
const update = (id: number, data:Omit<Student, "id">) => {
    return http.put(`/students/${id}`, data);
}
const remove = (id:number) => {
    return http.delete(`/students/${id}`);
}
const StudentDataService = {
    create,
    getAll,
    get,
    update,
    remove
};

export default StudentDataService;