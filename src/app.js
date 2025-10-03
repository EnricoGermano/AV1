"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var readline = require("readline");
var fs = require("fs");
var aeronave_1 = require("./aeronave");
var enums_1 = require("./enums");
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
var persistencia_1 = require("./persistencia");
var AERONAVES_FILE = 'aeronaves.json';
var aeronaves = (0, persistencia_1.carregarAeronaves)(AERONAVES_FILE);
var FUNCIONARIO_FILE = 'funcionarios.json';
var funcionarios = (0, persistencia_1.carregarFuncionarios)(FUNCIONARIO_FILE);
var usuarioLogado = null;
for (var _i = 0, aeronaves_1 = aeronaves; _i < aeronaves_1.length; _i++) {
    var a = aeronaves_1[_i];
    if (!a.etapas)
        a.etapas = [];
}
function menu() {
    console.log("\n--- MENU ---");
    console.log("1. Cadastrar aeronave");
    console.log("2. Listar aeronaves");
    console.log("3. Cadastrar peça em uma aeronave");
    console.log("4. Listar peças de uma aeronave");
    console.log("5. Atualizar status de peça");
    console.log("6. Cadastrar etapa em uma aeronave");
    console.log("7. Listar etapas de uma aeronave");
    console.log("8. Iniciar etapa");
    console.log("9. Finalizar etapa");
    console.log("10. Cadastrar funcionário");
    console.log("11. Listar funcionários");
    console.log("12. Associar funcionário a etapa");
    console.log("13. Listar funcionários de uma etapa");
    console.log("14. Cadastrar teste em uma aeronave");
    console.log("15. Listar testes de uma aeronave");
    console.log("16. Atualizar resultado de teste");
    console.log("17. Gerar relatório final da aeronave");
    console.log("0. Sair e trocar usuário");
    rl.question('Escolha uma opção: ', function (opcao) {
        if (opcao === "1")
            exigePermissao([enums_1.NivelPermissao.ADMINISTRADOR], cadastrarAeronave);
        else if (opcao === "2")
            exigePermissao([enums_1.NivelPermissao.ADMINISTRADOR, enums_1.NivelPermissao.ENGENHEIRO, enums_1.NivelPermissao.OPERADOR], listarAeronavesMenu);
        else if (opcao === "3")
            exigePermissao([enums_1.NivelPermissao.ADMINISTRADOR, enums_1.NivelPermissao.ENGENHEIRO], cadastrarPeca);
        else if (opcao === "4")
            exigePermissao([enums_1.NivelPermissao.ADMINISTRADOR, enums_1.NivelPermissao.ENGENHEIRO, enums_1.NivelPermissao.OPERADOR], listarPecas);
        else if (opcao === "5")
            exigePermissao([enums_1.NivelPermissao.ADMINISTRADOR, enums_1.NivelPermissao.ENGENHEIRO, enums_1.NivelPermissao.OPERADOR], atualizarStatusPeca);
        else if (opcao === "6")
            exigePermissao([enums_1.NivelPermissao.ADMINISTRADOR, enums_1.NivelPermissao.ENGENHEIRO], cadastrarEtapa);
        else if (opcao === "7")
            exigePermissao([enums_1.NivelPermissao.ADMINISTRADOR, enums_1.NivelPermissao.ENGENHEIRO, enums_1.NivelPermissao.OPERADOR], listarAeronavesMenu);
        else if (opcao === "8")
            exigePermissao([enums_1.NivelPermissao.ADMINISTRADOR, enums_1.NivelPermissao.ENGENHEIRO, enums_1.NivelPermissao.OPERADOR], iniciarEtapa);
        else if (opcao === "9")
            exigePermissao([enums_1.NivelPermissao.ADMINISTRADOR, enums_1.NivelPermissao.ENGENHEIRO, enums_1.NivelPermissao.OPERADOR], finalizarEtapa);
        else if (opcao === "10")
            exigePermissao([enums_1.NivelPermissao.ADMINISTRADOR], cadastrarFuncionario);
        else if (opcao === "11")
            exigePermissao([enums_1.NivelPermissao.ADMINISTRADOR, enums_1.NivelPermissao.ENGENHEIRO, enums_1.NivelPermissao.OPERADOR], listarFuncionariosMenu);
        else if (opcao === "12")
            exigePermissao([enums_1.NivelPermissao.ADMINISTRADOR, enums_1.NivelPermissao.ENGENHEIRO, enums_1.NivelPermissao.OPERADOR], associarFuncionarioEtapa);
        else if (opcao === "13")
            exigePermissao([enums_1.NivelPermissao.ADMINISTRADOR, enums_1.NivelPermissao.ENGENHEIRO, enums_1.NivelPermissao.OPERADOR], listarFuncionariosEtapa);
        else if (opcao === "14")
            exigePermissao([enums_1.NivelPermissao.ADMINISTRADOR, enums_1.NivelPermissao.ENGENHEIRO], cadastrarTeste);
        else if (opcao === "15")
            exigePermissao([enums_1.NivelPermissao.ADMINISTRADOR, enums_1.NivelPermissao.ENGENHEIRO, enums_1.NivelPermissao.OPERADOR], listarTestes);
        else if (opcao === "16")
            exigePermissao([enums_1.NivelPermissao.ADMINISTRADOR, enums_1.NivelPermissao.ENGENHEIRO, enums_1.NivelPermissao.OPERADOR], atualizarTeste);
        else if (opcao === "17")
            exigePermissao([enums_1.NivelPermissao.ADMINISTRADOR, enums_1.NivelPermissao.ENGENHEIRO], gerarRelatorioAeronave);
        else if (opcao === '0') {
            usuarioLogado = null;
            autenticarFuncionario(menu);
        }
        else
            rl.close();
    });
}
function gerarRelatorioAeronave() {
    listarAeronaves();
    rl.question("Escolha o número da aeronave: ", function (numA) {
        var aeronave = aeronaves[parseInt(numA) - 1];
        if (!aeronave) {
            console.log("Aeronave inválida.");
            menu();
            return;
        }
        if (!aeronave.testes ||
            aeronave.testes.length === 0 ||
            (aeronave.etapas && aeronave.etapas.some(function (e) { return e.status !== "Concluída" && e.status !== "CONCLUIDA"; }))) {
            console.log("Aeronave não pode ser finalizada: inclua ao menos um teste e conclua todas as etapas.");
            menu();
            return;
        }
        var relatorio = '';
        relatorio += "=== RELAT\u00D3RIO FINAL DA AERONAVE ===\n";
        relatorio += "C\u00F3digo......: ".concat(aeronave.codigo, "\n");
        relatorio += "Modelo......: ".concat(aeronave.modelo, "\n");
        relatorio += "Tipo........: ".concat(aeronave.tipo, "\n");
        relatorio += "Capacidade..: ".concat(aeronave.capacidade, "\n");
        relatorio += "Alcance.....: ".concat(aeronave.alcance, "\n\n");
        relatorio += "--- Pe\u00E7as ---\n";
        aeronave.pecas.forEach(function (p, i) {
            relatorio += "".concat(i + 1, ". ").concat(p.nome, " | ").concat(p.tipo, " | ").concat(p.fornecedor, " | Status: ").concat(p.status, "\n");
        });
        relatorio += "\n--- Etapas ---\n";
        aeronave.etapas.forEach(function (e, i) {
            relatorio += "".concat(i + 1, ". ").concat(e.nome, " | Prazo: ").concat(e.prazo, " | Status: ").concat(e.status, "\n");
            if (e.funcionarios && e.funcionarios.length > 0) {
                relatorio += "     Funcion\u00E1rios: ";
                relatorio += e.funcionarios.map(function (f) { return f.nome; }).join(', ') + '\n';
            }
        });
        relatorio += "\n--- Testes ---\n";
        aeronave.testes.forEach(function (t, i) {
            relatorio += "".concat(i + 1, ". Tipo: ").concat(t.tipo, " | Resultado: ").concat(t.resultado ? "Aprovado" : "Reprovado", "\n");
        });
        var arquivo = "relatorio_".concat(aeronave.codigo, ".txt");
        fs.writeFileSync(arquivo, relatorio);
        console.log("Relat\u00F3rio salvo em: ".concat(arquivo));
        menu();
    });
}
function cadastrarTeste() {
    listarAeronaves();
    rl.question("Escolha o número da aeronave: ", function (numA) {
        var aeronave = aeronaves[parseInt(numA) - 1];
        rl.question("Tipo de teste (eletrico/hidraulico/aerodinamico): ", function (tipoDigitado) {
            var tipo = enums_1.TipoTeste.ELETRICO;
            if (tipoDigitado === "hidraulico")
                tipo = enums_1.TipoTeste.HIDRAULICO;
            if (tipoDigitado === "aerodinamico")
                tipo = enums_1.TipoTeste.AERODINAMICO;
            rl.question("Resultado (aprovado/reprovado): ", function (resultadoDigitado) {
                var resultado = resultadoDigitado === "aprovado";
                var teste = new aeronave_1.Teste(tipo, resultado);
                aeronave.testes.push(teste);
                (0, persistencia_1.salvarAeronaves)(aeronaves, AERONAVES_FILE);
                console.log("Teste cadastrado!");
                menu();
            });
        });
    });
}
function listarTestes() {
    listarAeronaves();
    rl.question("Escolha o número da aeronave: ", function (numA) {
        var aeronave = aeronaves[parseInt(numA) - 1];
        console.log("--- Testes da Aeronave ---");
        aeronave.testes.forEach(function (t, i) {
            return console.log("".concat(i + 1, ". Tipo: ").concat(t.tipo, " | Resultado: ").concat(t.resultado ? "Aprovado" : "Reprovado"));
        });
        menu();
    });
}
function atualizarTeste() {
    listarAeronaves();
    rl.question("Escolha o número da aeronave: ", function (numA) {
        var aeronave = aeronaves[parseInt(numA) - 1];
        listarTestesSimples(aeronave);
        rl.question("Escolha o número do teste para atualizar: ", function (numT) {
            var teste = aeronave.testes[parseInt(numT) - 1];
            if (!teste) {
                console.log("Número de teste inválido.");
                menu();
                return;
            }
            rl.question("Resultado novo (aprovado/reprovado): ", function (resultadoNovo) {
                teste.resultado = resultadoNovo === "aprovado";
                (0, persistencia_1.salvarAeronaves)(aeronaves, AERONAVES_FILE);
                console.log("Teste atualizado!");
                menu();
            });
        });
    });
}
function listarTestesSimples(aeronave) {
    aeronave.testes.forEach(function (t, i) {
        return console.log("".concat(i + 1, ". Tipo: ").concat(t.tipo, " | Resultado: ").concat(t.resultado ? "Aprovado" : "Reprovado"));
    });
}
function cadastrarFuncionario() {
    rl.question("Nome: ", function (nome) {
        rl.question("Telefone: ", function (telefone) {
            rl.question("Endereço: ", function (endereco) {
                rl.question("Usuário: ", function (usuario) {
                    rl.question("Senha: ", function (senha) {
                        rl.question("Permissão (administrador/engenheiro/operador): ", function (permissaoDigitada) {
                            var permissao = enums_1.NivelPermissao.OPERADOR;
                            if (permissaoDigitada === "administrador")
                                permissao = enums_1.NivelPermissao.ADMINISTRADOR;
                            else if (permissaoDigitada === "engenheiro")
                                permissao = enums_1.NivelPermissao.ENGENHEIRO;
                            var f = new aeronave_1.Funcionario(nome, telefone, endereco, usuario, senha, permissao);
                            funcionarios.push(f);
                            (0, persistencia_1.salvarFuncionarios)(funcionarios, 'funcionarios.json');
                            console.log("Funcionário cadastrado!");
                            menu();
                        });
                    });
                });
            });
        });
    });
}
function listarFuncionarios() {
    console.log("--- Funcionários ---");
    funcionarios.forEach(function (f, i) {
        return console.log("".concat(i + 1, ". ").concat(f.nome, " | Tel: ").concat(f.telefone, " | Permiss\u00E3o: ").concat(f.permissao));
    });
}
function listarFuncionariosMenu() {
    listarFuncionarios();
    menu();
}
function listarAeronavesMenu() {
    listarAeronaves();
    menu();
}
function associarFuncionarioEtapa() {
    listarAeronaves();
    rl.question("Escolha o número da aeronave: ", function (numA) {
        var aeronave = aeronaves[parseInt(numA) - 1];
        listarEtapasEspecifica(aeronave);
        rl.question("Escolha o número da etapa: ", function (numE) {
            var etapa = aeronave.etapas[parseInt(numE) - 1];
            listarFuncionarios();
            rl.question("Escolha o número do funcionário: ", function (numF) {
                var funcionario = funcionarios[parseInt(numF) - 1];
                // etapa.funcionarios = etapa.funcionarios || [];
                if (etapa.funcionarios.find(function (f) { return f.usuario === funcionario.usuario; })) {
                    console.log("Funcionário já associado à etapa.");
                }
                else {
                    etapa.funcionarios.push(funcionario);
                    (0, persistencia_1.salvarAeronaves)(aeronaves, AERONAVES_FILE);
                    console.log("Funcionário associado à etapa!");
                }
                menu();
            });
        });
    });
}
function listarFuncionariosEtapa() {
    listarAeronaves();
    rl.question("Escolha o número da aeronave: ", function (numA) {
        var aeronave = aeronaves[parseInt(numA) - 1];
        listarEtapasEspecifica(aeronave);
        rl.question("Escolha o número da etapa: ", function (numE) {
            var etapa = aeronave.etapas[parseInt(numE) - 1];
            if (!etapa.funcionarios || etapa.funcionarios.length === 0) {
                console.log("Nenhum funcionário associado a esta etapa.");
            }
            else {
                etapa.funcionarios.forEach(function (f, i) {
                    return console.log("".concat(i + 1, ". ").concat(f.nome, " | Permiss\u00E3o: ").concat(f.permissao));
                });
            }
            menu();
        });
    });
}
function cadastrarEtapa() {
    listarAeronaves();
    rl.question("Escolha o número da aeronave: ", function (num) {
        var aeronave = aeronaves[parseInt(num) - 1];
        rl.question("Nome da etapa: ", function (nome) {
            rl.question("Prazo (ex: 10 dias): ", function (prazo) {
                var etapa = new aeronave_1.Etapa(nome, prazo, enums_1.StatusEtapa.PENDENTE);
                aeronave.etapas.push(etapa);
                (0, persistencia_1.salvarAeronaves)(aeronaves, AERONAVES_FILE);
                console.log("Etapa cadastrada!");
                menu();
            });
        });
    });
}
function listarEtapas() {
    listarAeronaves();
    rl.question("Escolha o número da aeronave: ", function (num) {
        var aeronave = aeronaves[parseInt(num) - 1];
        console.log("--- Etapas da Aeronave ---");
        aeronave.etapas.forEach(function (e, i) {
            console.log("".concat(i + 1, ". ").concat(e.nome, " | Prazo: ").concat(e.prazo, " | Status: ").concat(e.status));
        });
        menu();
    });
}
function iniciarEtapa() {
    listarAeronaves();
    rl.question("Escolha o número da aeronave: ", function (num) {
        var aeronave = aeronaves[parseInt(num) - 1];
        listarEtapasEspecifica(aeronave);
        rl.question("Escolha o número da etapa para iniciar: ", function (etapaNum) {
            var idx = parseInt(etapaNum) - 1;
            var etapa = aeronave.etapas[idx];
            if (!etapa) {
                console.log("Número de etapa inválido.");
                menu();
                return;
            }
            if (idx === 0 || aeronave.etapas[idx - 1].status === enums_1.StatusEtapa.CONCLUIDA) {
                etapa.status = enums_1.StatusEtapa.ANDAMENTO;
                (0, persistencia_1.salvarAeronaves)(aeronaves, AERONAVES_FILE);
                console.log("Etapa iniciada!");
            }
            else {
                console.log("Só é possível iniciar após concluir a etapa anterior.");
            }
            menu();
        });
    });
}
function listarEtapasEspecifica(aeronave) {
    console.log("--- Etapas da Aeronave ---");
    aeronave.etapas.forEach(function (etapa, i) {
        console.log("".concat(i + 1, ". ").concat(etapa.nome, " | Prazo: ").concat(etapa.prazo, " | Status: ").concat(etapa.status));
    });
}
function finalizarEtapa() {
    listarAeronaves();
    rl.question("Escolha o número da aeronave: ", function (num) {
        var aeronave = aeronaves[parseInt(num) - 1];
        listarEtapasEspecifica(aeronave);
        rl.question("Escolha o número da etapa para finalizar: ", function (etapaNum) {
            var idx = parseInt(etapaNum) - 1;
            var etapa = aeronave.etapas[idx];
            if (!etapa) {
                console.log("Etapa inválida.");
                menu();
                return;
            }
            if (idx > 0 && aeronave.etapas[idx - 1].status !== enums_1.StatusEtapa.CONCLUIDA) {
                console.log("Só é possível finalizar esta etapa após concluir a anterior.");
                menu();
                return;
            }
            if (etapa.status === enums_1.StatusEtapa.ANDAMENTO) {
                etapa.status = enums_1.StatusEtapa.CONCLUIDA;
                (0, persistencia_1.salvarAeronaves)(aeronaves, AERONAVES_FILE);
                console.log("Etapa finalizada!");
            }
            else {
                console.log("Só é possível finalizar uma etapa que está em andamento.");
            }
            menu();
        });
    });
}
function cadastrarAeronave() {
    rl.question('Código: ', function (codigo) {
        if (aeronaves.some(function (a) { return a.codigo === codigo; })) {
            console.log("Já existe uma aeronave com esse código!");
            menu();
            return;
        }
        rl.question('Modelo: ', function (modelo) {
            rl.question('Tipo (comercial/militar): ', function (tipo) {
                var tipoEnum = tipo.toLowerCase() === 'comercial' ? enums_1.TipoAeronave.COMERCIAL : enums_1.TipoAeronave.MILITAR;
                rl.question('Capacidade: ', function (capacidade) {
                    rl.question('Alcance: ', function (alcance) {
                        aeronaves.push(new aeronave_1.Aeronave(codigo, modelo, tipoEnum, Number(capacidade), Number(alcance)));
                        console.log("Aeronave cadastrada!");
                        (0, persistencia_1.salvarAeronaves)(aeronaves, AERONAVES_FILE);
                        menu();
                    });
                });
            });
        });
    });
}
function listarAeronaves() {
    console.log("--- Aeronaves Cadastradas ---");
    aeronaves.forEach(function (a, i) {
        return console.log("".concat(i + 1, ". ").concat(a.codigo, " | ").concat(a.modelo, " | ").concat(a.tipo, " | Capacidade: ").concat(a.capacidade, " | Alcance: ").concat(a.alcance));
    });
}
function cadastrarPeca() {
    listarAeronaves();
    rl.question("Escolha o número da aeronave: ", function (num) {
        var aeronave = aeronaves[parseInt(num) - 1];
        rl.question("Nome da peça: ", function (nome) {
            rl.question("Tipo (nacional/importada): ", function (tipo) {
                rl.question("Fornecedor: ", function (fornecedor) {
                    rl.question("Status (producao/transporte/pronta): ", function (statusDigitado) {
                        var status = enums_1.StatusPeca.PRODUCAO;
                        if (statusDigitado === "transporte")
                            status = enums_1.StatusPeca.TRANSPORTE;
                        if (statusDigitado === "pronta")
                            status = enums_1.StatusPeca.PRONTA;
                        var peca = new aeronave_1.Peca(nome, tipo, fornecedor, status);
                        aeronave.pecas.push(peca);
                        console.log("Peça cadastrada!");
                        (0, persistencia_1.salvarAeronaves)(aeronaves, AERONAVES_FILE);
                        menu();
                    });
                });
            });
        });
    });
}
function atualizarStatusPeca() {
    listarAeronaves();
    rl.question("Escolha o número da aeronave: ", function (numA) {
        var aeronave = aeronaves[parseInt(numA) - 1];
        if (!aeronave || !aeronave.pecas || aeronave.pecas.length === 0) {
            console.log("Aeronave ou lista de peças inválida.");
            menu();
            return;
        }
        aeronave.pecas.forEach(function (p, i) {
            return console.log("".concat(i + 1, ". ").concat(p.nome, " | Status: ").concat(p.status));
        });
        rl.question("Escolha o número da peça: ", function (numP) {
            var peca = aeronave.pecas[parseInt(numP) - 1];
            if (!peca) {
                console.log("Peça inválida.");
                menu();
                return;
            }
            rl.question("Novo status (producao/transporte/pronta): ", function (statusDigitado) {
                if (statusDigitado === "producao")
                    peca.status = enums_1.StatusPeca.PRODUCAO;
                else if (statusDigitado === "transporte")
                    peca.status = enums_1.StatusPeca.TRANSPORTE;
                else if (statusDigitado === "pronta")
                    peca.status = enums_1.StatusPeca.PRONTA;
                else {
                    console.log("Status inválido.");
                    menu();
                    return;
                }
                (0, persistencia_1.salvarAeronaves)(aeronaves, AERONAVES_FILE);
                console.log("Status da peça atualizado!");
                menu();
            });
        });
    });
}
function listarPecas() {
    listarAeronaves();
    rl.question("Escolha o número da aeronave: ", function (num) {
        var aeronave = aeronaves[parseInt(num) - 1];
        console.log("--- Peças da Aeronave ---");
        aeronave.pecas.forEach(function (p, i) {
            console.log("".concat(i + 1, ". ").concat(p.nome, " | ").concat(p.tipo, " | ").concat(p.fornecedor, " | ").concat(p.status));
        });
        (0, persistencia_1.salvarAeronaves)(aeronaves, AERONAVES_FILE);
        menu();
    });
}
function autenticarFuncionario(callback) {
    rl.question("Usuário: ", function (usuarioDigitado) {
        rl.question("Senha: ", function (senhaDigitada) {
            var funcionario = funcionarios.find(function (f) { return f.usuario === usuarioDigitado && f.senha === senhaDigitada; });
            if (!funcionario) {
                console.log("Usuário ou senha inválidos.");
                autenticarFuncionario(callback);
                return;
            }
            usuarioLogado = funcionario;
            console.log("Usu\u00E1rio autenticado como ".concat(funcionario.nome, " (").concat(funcionario.permissao, ")"));
            callback();
        });
    });
}
function exigePermissao(niveis, acao) {
    if (!usuarioLogado || !niveis.includes(usuarioLogado.permissao)) {
        console.log("Permissão insuficiente para esta ação.");
        menu();
        return;
    }
    acao();
}
if (funcionarios.length === 0) {
    console.log("Nenhum usuário cadastrado. Cadastre um administrador.");
    cadastrarFuncionario(); // apenas administrador pode ser o primeiro
}
else {
    autenticarFuncionario(menu);
}
