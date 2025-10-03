"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TipoTeste = exports.NivelPermissao = exports.StatusEtapa = exports.StatusPeca = exports.TipoAeronave = void 0;
// src/enums.ts
var TipoAeronave;
(function (TipoAeronave) {
    TipoAeronave["COMERCIAL"] = "Comercial";
    TipoAeronave["MILITAR"] = "Militar";
})(TipoAeronave || (exports.TipoAeronave = TipoAeronave = {}));
var StatusPeca;
(function (StatusPeca) {
    StatusPeca["PRODUCAO"] = "Em Produ\u00E7\u00E3o";
    StatusPeca["TRANSPORTE"] = "Em Transporte";
    StatusPeca["PRONTA"] = "Pronta";
})(StatusPeca || (exports.StatusPeca = StatusPeca = {}));
var StatusEtapa;
(function (StatusEtapa) {
    StatusEtapa["PENDENTE"] = "Pendente";
    StatusEtapa["ANDAMENTO"] = "Em Andamento";
    StatusEtapa["CONCLUIDA"] = "Conclu\u00EDda";
})(StatusEtapa || (exports.StatusEtapa = StatusEtapa = {}));
var NivelPermissao;
(function (NivelPermissao) {
    NivelPermissao["ADMINISTRADOR"] = "Administrador";
    NivelPermissao["ENGENHEIRO"] = "Engenheiro";
    NivelPermissao["OPERADOR"] = "Operador";
})(NivelPermissao || (exports.NivelPermissao = NivelPermissao = {}));
var TipoTeste;
(function (TipoTeste) {
    TipoTeste["ELETRICO"] = "El\u00E9trico";
    TipoTeste["HIDRAULICO"] = "Hidr\u00E1ulico";
    TipoTeste["AERODINAMICO"] = "Aerodin\u00E2mico";
})(TipoTeste || (exports.TipoTeste = TipoTeste = {}));
