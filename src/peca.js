"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Peca = void 0;
var Peca = /** @class */ (function () {
    function Peca(nome, tipo, // nacional/importada
    fornecedor, status) {
        this.nome = nome;
        this.tipo = tipo;
        this.fornecedor = fornecedor;
        this.status = status;
    }
    return Peca;
}());
exports.Peca = Peca;
