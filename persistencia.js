"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.salvarAeronaves = salvarAeronaves;
exports.carregarAeronaves = carregarAeronaves;
exports.salvarFuncionarios = salvarFuncionarios;
exports.carregarFuncionarios = carregarFuncionarios;
// src/persistencia.ts
var fs = require("fs");
function salvarAeronaves(aeronaves, arquivo) {
    fs.writeFileSync(arquivo, JSON.stringify(aeronaves, null, 2));
    console.log('Dados salvos com sucesso!');
}
function carregarAeronaves(arquivo) {
    if (fs.existsSync(arquivo)) {
        var dados = fs.readFileSync(arquivo, 'utf-8');
        return JSON.parse(dados) || [];
    }
    return [];
}
function salvarFuncionarios(funcionarios, arquivo) {
    fs.writeFileSync(arquivo, JSON.stringify(funcionarios, null, 2));
}
function carregarFuncionarios(arquivo) {
    if (fs.existsSync(arquivo)) {
        var dados = fs.readFileSync(arquivo, 'utf-8');
        return JSON.parse(dados) || [];
    }
    return [];
}
