import "reflect-metadata";
import { DataSource } from "typeorm";
import {Book} from "./src/model/book";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "127.0.0.1",
    port: 3306,
    username: "root",
    password: "Langngo@98",
    database: "test",
    entities: [Book],
    synchronize: true,
    logging: false,
})
