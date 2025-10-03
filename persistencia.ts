// src/persistencia.ts
import * as fs from 'fs';

export function salvarAeronaves(aeronaves: any[], arquivo: string) {
  fs.writeFileSync(arquivo, JSON.stringify(aeronaves, null, 2));
  console.log('Dados salvos com sucesso!');
}

export function carregarAeronaves(arquivo: string) {
  if (fs.existsSync(arquivo)) {
    const dados = fs.readFileSync(arquivo, 'utf-8');
    return JSON.parse(dados) || [];
  }
  return [];
}

export function salvarFuncionarios(funcionarios: any[], arquivo: string) {
  fs.writeFileSync(arquivo, JSON.stringify(funcionarios, null, 2));
}
export function carregarFuncionarios(arquivo: string) {
  if (fs.existsSync(arquivo)) {
    const dados = fs.readFileSync(arquivo, 'utf-8');
    return JSON.parse(dados) || [];
  }
  return [];
}
