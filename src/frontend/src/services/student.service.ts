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
class StudentDataService {
    create(data : Omit<Student, "id">) {
        return http.post("/students", data);
    }
    getAll() {
        return http.get("/students");
    }
    get(id: number) {
        return http.get(`/students/${id}`);
    }
    update(id: number, data:Omit<Student, "id">) {
        return http.put(`/students/${id}`, data);
    }
    delete(id:number) {
        return http.delete(`/students/${id}`);
    }
}

export default new StudentDataService();