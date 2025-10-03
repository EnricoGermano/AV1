"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Teste = exports.Funcionario = exports.Etapa = exports.Peca = exports.Aeronave = void 0;
var Aeronave = /** @class */ (function () {
    function Aeronave(codigo, modelo, tipo, capacidade, alcance) {
        this.codigo = codigo;
        this.modelo = modelo;
        this.tipo = tipo;
        this.capacidade = capacidade;
        this.alcance = alcance;
        this.etapas = [];
        this.pecas = [];
        this.funcionarios = [];
        this.testes = [];
    }
    return Aeronave;
}());
exports.Aeronave = Aeronave;
var Peca = /** @class */ (function () {
    function Peca(nome, tipo, fornecedor, status) {
        this.nome = nome;
        this.tipo = tipo;
        this.fornecedor = fornecedor;
        this.status = status;
    }
    return Peca;
}());
exports.Peca = Peca;
var Etapa = /** @class */ (function () {
    function Etapa(nome, prazo, status) {
        this.nome = nome;
        this.prazo = prazo;
        this.status = status;
        this.funcionarios = [];
    }
    return Etapa;
}());
exports.Etapa = Etapa;
var Funcionario = /** @class */ (function () {
    function Funcionario(nome, telefone, endereco, usuario, senha, permissao) {
        this.nome = nome;
        this.telefone = telefone;
        this.endereco = endereco;
        this.usuario = usuario;
        this.senha = senha;
        this.permissao = permissao;
    }
    return Funcionario;
}());
exports.Funcionario = Funcionario;
var Teste = /** @class */ (function () {
    function Teste(tipo, resultado) {
        this.tipo = tipo;
        this.resultado = resultado;
        this.testes = [];
    }
    return Teste;
}());
exports.Teste = Teste;
