import { StatusPeca } from "./enums";

export class Peca {
  constructor(
    public nome: string,
    public tipo: string, // nacional/importada
    public fornecedor: string,
    public status: StatusPeca
  ) {}
}
