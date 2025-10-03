import { TipoAeronave } from './enums';

export class Aeronave {
  public etapas: Etapa[] = [];
  public pecas: Peca[] = [];
  public funcionarios: Funcionario[] = [];
  public testes: Teste[] = [];

  constructor(
    public codigo: string,
    public modelo: string,
    public tipo: TipoAeronave,
    public capacidade: number,
    public alcance: number
  ) {}
}

import { StatusPeca } from './enums';

export class Peca {
  constructor(
    public nome: string,
    public tipo: string,
    public fornecedor: string,
    public status: StatusPeca,
  ) {}
}

import { StatusEtapa } from './enums';
import { carregarFuncionarios } from './persistencia';

export class Etapa {
  public funcionarios: Funcionario[] = [];
  constructor(
    public nome: string,
    public prazo: string,
    public status: StatusEtapa
  ) {}
}

import { NivelPermissao } from './enums';

export class Funcionario {
  constructor(
    public nome: string,
    public telefone: string,
    public endereco: string,
    public usuario: string,
    public senha: string,
    public permissao: NivelPermissao
  ) {}
}

import { TipoTeste } from './enums';

export class Teste {
  public testes: Teste[] = [];
  constructor(
    public tipo: TipoTeste,
    public resultado: boolean
  ) {}
}


  