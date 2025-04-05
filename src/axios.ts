import axios, { AxiosInstance } from "axios";

let customAxios: AxiosInstance = axios.create({
  baseURL: 'https://treasury-management-backend.calpa.workers.dev/',
});

export default customAxios;
