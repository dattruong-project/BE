import { AppDataSource } from "../../datasource.config"
import { Book } from "../model/book"

const bookRepository = AppDataSource.getRepository(Book);

export const getAllBooks = async () => {
  const books = await bookRepository.find();
  return books;
}