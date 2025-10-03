import * as readline from 'readline';
import * as fs from 'fs';
import { Aeronave, Peca, Etapa, Funcionario, Teste } from './aeronave';
import { TipoAeronave, StatusPeca, StatusEtapa, NivelPermissao, TipoTeste } from './enums';


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

import { carregarAeronaves, salvarAeronaves, carregarFuncionarios, salvarFuncionarios } from './persistencia';

const AERONAVES_FILE = 'aeronaves.json';
const aeronaves: Aeronave[] = carregarAeronaves(AERONAVES_FILE);
const FUNCIONARIO_FILE = 'funcionarios.json';
const funcionarios = carregarFuncionarios(FUNCIONARIO_FILE);
let usuarioLogado: Funcionario | null = null;



for (let a of aeronaves) {
  if (!a.etapas) a.etapas = [];
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
  rl.question('Escolha uma opção: ', (opcao) => {
    if (opcao === "1")  exigePermissao([NivelPermissao.ADMINISTRADOR], cadastrarAeronave);
    else if (opcao === "2")  exigePermissao([NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO, NivelPermissao.OPERADOR], listarAeronavesMenu);
    else if (opcao === "3")  exigePermissao([NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO], cadastrarPeca);
    else if (opcao === "4")  exigePermissao([NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO, NivelPermissao.OPERADOR], listarPecas);
    else if (opcao === "5")  exigePermissao([NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO, NivelPermissao.OPERADOR], atualizarStatusPeca);
    else if (opcao === "6")  exigePermissao([NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO], cadastrarEtapa);
    else if (opcao === "7")  exigePermissao([NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO, NivelPermissao.OPERADOR], listarAeronavesMenu);
    else if (opcao === "8")  exigePermissao([NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO, NivelPermissao.OPERADOR], iniciarEtapa);
    else if (opcao === "9")  exigePermissao([NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO, NivelPermissao.OPERADOR], finalizarEtapa);
    else if (opcao === "10") exigePermissao([NivelPermissao.ADMINISTRADOR], cadastrarFuncionario);
    else if (opcao === "11") exigePermissao([NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO, NivelPermissao.OPERADOR], listarFuncionariosMenu);
    else if (opcao === "12") exigePermissao([NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO, NivelPermissao.OPERADOR], associarFuncionarioEtapa);
    else if (opcao === "13") exigePermissao([NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO, NivelPermissao.OPERADOR], listarFuncionariosEtapa);
    else if (opcao === "14") exigePermissao([NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO], cadastrarTeste);
    else if (opcao === "15") exigePermissao([NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO, NivelPermissao.OPERADOR], listarTestes);
    else if (opcao === "16") exigePermissao([NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO, NivelPermissao.OPERADOR], atualizarTeste);
    else if (opcao === "17") exigePermissao([NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO], gerarRelatorioAeronave);
    else if (opcao === '0') {
      usuarioLogado = null;
      autenticarFuncionario(menu);
    }
    else rl.close();
  });
}



function gerarRelatorioAeronave() {
  listarAeronaves();
  rl.question("Escolha o número da aeronave: ", (numA) => {
    const aeronave = aeronaves[parseInt(numA) - 1];
    if (!aeronave) {
      console.log("Aeronave inválida.");
      menu();
      return;
    }
    if (
      !aeronave.testes ||
      aeronave.testes.length === 0 ||
      (aeronave.etapas && aeronave.etapas.some((e: any) => e.status !== "Concluída" && e.status !== "CONCLUIDA"))
    ) {
      console.log("Aeronave não pode ser finalizada: inclua ao menos um teste e conclua todas as etapas.");
      menu();
      return;
    }

    let relatorio = '';
    relatorio += `=== RELATÓRIO FINAL DA AERONAVE ===\n`;
    relatorio += `Código......: ${aeronave.codigo}\n`;
    relatorio += `Modelo......: ${aeronave.modelo}\n`;
    relatorio += `Tipo........: ${aeronave.tipo}\n`;
    relatorio += `Capacidade..: ${aeronave.capacidade}\n`;
    relatorio += `Alcance.....: ${aeronave.alcance}\n\n`;

    relatorio += `--- Peças ---\n`;
    aeronave.pecas.forEach((p: any, i: number) => {
      relatorio += `${i + 1}. ${p.nome} | ${p.tipo} | ${p.fornecedor} | Status: ${p.status}\n`;
    });

    relatorio += `\n--- Etapas ---\n`;
    aeronave.etapas.forEach((e: any, i: number) => {
      relatorio += `${i + 1}. ${e.nome} | Prazo: ${e.prazo} | Status: ${e.status}\n`;
      if (e.funcionarios && e.funcionarios.length > 0) {
        relatorio += `     Funcionários: `;
        relatorio += e.funcionarios.map((f: any) => f.nome).join(', ') + '\n';
      }
    });

    relatorio += `\n--- Testes ---\n`;
    aeronave.testes.forEach((t: any, i: number) => {
      relatorio += `${i + 1}. Tipo: ${t.tipo} | Resultado: ${t.resultado ? "Aprovado" : "Reprovado"}\n`;
    });

    const arquivo = `relatorio_${aeronave.codigo}.txt`;
    fs.writeFileSync(arquivo, relatorio);
    console.log(`Relatório salvo em: ${arquivo}`);
    menu();
  });
}


function cadastrarTeste() {
  listarAeronaves();
  rl.question("Escolha o número da aeronave: ", (numA) => {
    const aeronave = aeronaves[parseInt(numA) - 1];
    rl.question("Tipo de teste (eletrico/hidraulico/aerodinamico): ", (tipoDigitado) => {
      let tipo: TipoTeste = TipoTeste.ELETRICO;
      if (tipoDigitado === "hidraulico") tipo = TipoTeste.HIDRAULICO;
      if (tipoDigitado === "aerodinamico") tipo = TipoTeste.AERODINAMICO;
      rl.question("Resultado (aprovado/reprovado): ", (resultadoDigitado) => {
        const resultado = resultadoDigitado === "aprovado";
        const teste = new Teste(tipo, resultado);
        aeronave.testes.push(teste);
        salvarAeronaves(aeronaves, AERONAVES_FILE);
        console.log("Teste cadastrado!");
        menu();
      });
    });
  });
}

function listarTestes() {
  listarAeronaves();
  rl.question("Escolha o número da aeronave: ", (numA) => {
    const aeronave = aeronaves[parseInt(numA) - 1];
    console.log("--- Testes da Aeronave ---");
    aeronave.testes.forEach((t: Teste, i: number) =>
      console.log(`${i+1}. Tipo: ${t.tipo} | Resultado: ${t.resultado ? "Aprovado" : "Reprovado"}`)
    );
    menu();
  });
}

function atualizarTeste() {
  listarAeronaves();
  rl.question("Escolha o número da aeronave: ", (numA) => {
    const aeronave = aeronaves[parseInt(numA) - 1];
    listarTestesSimples(aeronave);
    rl.question("Escolha o número do teste para atualizar: ", (numT) => {
      const teste = aeronave.testes[parseInt(numT) - 1];
      if (!teste) {
        console.log("Número de teste inválido.");
        menu();
        return;
      }
      rl.question("Resultado novo (aprovado/reprovado): ", (resultadoNovo) => {
        teste.resultado = resultadoNovo === "aprovado";
        salvarAeronaves(aeronaves, AERONAVES_FILE);
        console.log("Teste atualizado!");
        menu();
      });
    });
  });
}
function listarTestesSimples(aeronave: Aeronave) {
  aeronave.testes.forEach((t: Teste, i: number) =>
    console.log(`${i+1}. Tipo: ${t.tipo} | Resultado: ${t.resultado ? "Aprovado" : "Reprovado"}`)
  );
}


function cadastrarFuncionario() {
  rl.question("Nome: ", (nome) => {
    rl.question("Telefone: ", (telefone) => {
      rl.question("Endereço: ", (endereco) => {
        rl.question("Usuário: ", (usuario) => {
          rl.question("Senha: ", (senha) => {
            rl.question("Permissão (administrador/engenheiro/operador): ", (permissaoDigitada) => {
              let permissao: NivelPermissao = NivelPermissao.OPERADOR;
              if (permissaoDigitada === "administrador") permissao = NivelPermissao.ADMINISTRADOR;
              else if (permissaoDigitada === "engenheiro") permissao = NivelPermissao.ENGENHEIRO;
              const f = new Funcionario(nome, telefone, endereco, usuario, senha, permissao);
              funcionarios.push(f);
              salvarFuncionarios(funcionarios, 'funcionarios.json');
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
  funcionarios.forEach((f: Funcionario, i: number) =>
    console.log(`${i + 1}. ${f.nome} | Tel: ${f.telefone} | Permissão: ${f.permissao}`)
  );
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
  rl.question("Escolha o número da aeronave: ", (numA) => {
    const aeronave = aeronaves[parseInt(numA) - 1];
    listarEtapasEspecifica(aeronave);
    rl.question("Escolha o número da etapa: ", (numE) => {
      const etapa = aeronave.etapas[parseInt(numE) - 1];
      listarFuncionarios();
      rl.question("Escolha o número do funcionário: ", (numF) => {
        const funcionario = funcionarios[parseInt(numF) - 1];
        // etapa.funcionarios = etapa.funcionarios || [];
        if (etapa.funcionarios.find((f: Funcionario) => f.usuario === funcionario.usuario)) {
          console.log("Funcionário já associado à etapa.");
        } else {
          etapa.funcionarios.push(funcionario);
          salvarAeronaves(aeronaves, AERONAVES_FILE);
          console.log("Funcionário associado à etapa!");
        }
        menu();
      });
    });
  });
}

function listarFuncionariosEtapa() {
  listarAeronaves();
  rl.question("Escolha o número da aeronave: ", (numA) => {
    const aeronave = aeronaves[parseInt(numA) - 1];
    listarEtapasEspecifica(aeronave);
    rl.question("Escolha o número da etapa: ", (numE) => {
      const etapa = aeronave.etapas[parseInt(numE) - 1];
      if (!etapa.funcionarios || etapa.funcionarios.length === 0) {
        console.log("Nenhum funcionário associado a esta etapa.");
      } else {
        etapa.funcionarios.forEach((f: Funcionario, i: number) =>
          console.log(`${i + 1}. ${f.nome} | Permissão: ${f.permissao}`)
        );
      }
      menu()
    });
  });
}


function cadastrarEtapa() {
  listarAeronaves();
  rl.question("Escolha o número da aeronave: ", (num) => {
    const aeronave = aeronaves[parseInt(num) - 1];
    rl.question("Nome da etapa: ", (nome) => {
      rl.question("Prazo (ex: 10 dias): ", (prazo) => {
        const etapa = new Etapa(nome, prazo, StatusEtapa.PENDENTE); 
        aeronave.etapas.push(etapa);
        salvarAeronaves(aeronaves, AERONAVES_FILE);
        console.log("Etapa cadastrada!");
        menu();
      });
    });
  });
}


function listarEtapas() {
  listarAeronaves();
  rl.question("Escolha o número da aeronave: ", (num) => {
    const aeronave = aeronaves[parseInt(num) - 1];
    console.log("--- Etapas da Aeronave ---");  
    aeronave.etapas.forEach((e, i) => {
      console.log(`${i + 1}. ${e.nome} | Prazo: ${e.prazo} | Status: ${e.status}`);
    });
    menu();
  } );
}

function iniciarEtapa() {
  listarAeronaves();
  rl.question("Escolha o número da aeronave: ", (num) => {
    const aeronave = aeronaves[parseInt(num) - 1];
    listarEtapasEspecifica(aeronave);
    rl.question("Escolha o número da etapa para iniciar: ", (etapaNum) => {
      const idx = parseInt(etapaNum) - 1;
      const etapa = aeronave.etapas[idx];
      if (!etapa) {
        console.log("Número de etapa inválido.");
        menu();
        return;
      }
      if (idx === 0 || aeronave.etapas[idx - 1].status === StatusEtapa.CONCLUIDA) {
        etapa.status = StatusEtapa.ANDAMENTO;
        salvarAeronaves(aeronaves, AERONAVES_FILE);
        console.log("Etapa iniciada!");
      } else {
        console.log("Só é possível iniciar após concluir a etapa anterior.");
      }
      menu();
    });
  });
}

function listarEtapasEspecifica(aeronave: Aeronave) {
  console.log("--- Etapas da Aeronave ---");
  aeronave.etapas.forEach((etapa: Etapa, i: number) => {
    console.log(`${i + 1}. ${etapa.nome} | Prazo: ${etapa.prazo} | Status: ${etapa.status}`);
  });
}

function finalizarEtapa() {
  listarAeronaves();
  rl.question("Escolha o número da aeronave: ", (num) => {
    const aeronave = aeronaves[parseInt(num) - 1];
    listarEtapasEspecifica(aeronave);
    rl.question("Escolha o número da etapa para finalizar: ", (etapaNum) => {
      const idx = parseInt(etapaNum) - 1;
      const etapa = aeronave.etapas[idx];
      if (!etapa) {
        console.log("Etapa inválida.");
        menu();
        return;
      }
      if (idx > 0 && aeronave.etapas[idx - 1].status !== StatusEtapa.CONCLUIDA) {
        console.log("Só é possível finalizar esta etapa após concluir a anterior.");
        menu();
        return;
      }
      if (etapa.status === StatusEtapa.ANDAMENTO) {
        etapa.status = StatusEtapa.CONCLUIDA;
        salvarAeronaves(aeronaves, AERONAVES_FILE);
        console.log("Etapa finalizada!");
      } else {
        console.log("Só é possível finalizar uma etapa que está em andamento.");
      }
      menu();
    });
  });
}




function cadastrarAeronave() {
  rl.question('Código: ', (codigo) => {
    if (aeronaves.some((a: Aeronave) => a.codigo === codigo)) {
    console.log("Já existe uma aeronave com esse código!");
    menu();
    return;
    }
    rl.question('Modelo: ', (modelo) => {
      rl.question('Tipo (comercial/militar): ', (tipo) => {
        const tipoEnum = tipo.toLowerCase() === 'comercial' ? TipoAeronave.COMERCIAL : TipoAeronave.MILITAR;
        rl.question('Capacidade: ', (capacidade) => {
          rl.question('Alcance: ', (alcance) => {
            aeronaves.push(new Aeronave(codigo, modelo, tipoEnum, Number(capacidade), Number(alcance)));
            console.log("Aeronave cadastrada!");
            salvarAeronaves(aeronaves, AERONAVES_FILE);
            menu();
          });
        });
      });
    });
  });
}

function listarAeronaves() {
  console.log("--- Aeronaves Cadastradas ---");
  aeronaves.forEach((a, i) =>
    console.log(`${i + 1}. ${a.codigo} | ${a.modelo} | ${a.tipo} | Capacidade: ${a.capacidade} | Alcance: ${a.alcance}`));
}

function cadastrarPeca() {
  listarAeronaves();
    rl.question("Escolha o número da aeronave: ", (num) => {
      const aeronave = aeronaves[parseInt(num) - 1];
      rl.question("Nome da peça: ", (nome) => {
        rl.question("Tipo (nacional/importada): ", (tipo) => {
          rl.question("Fornecedor: ", (fornecedor) => {
            rl.question("Status (producao/transporte/pronta): ", (statusDigitado) => {
              let status: StatusPeca = StatusPeca.PRODUCAO;
              if (statusDigitado === "transporte") status = StatusPeca.TRANSPORTE;
              if (statusDigitado === "pronta") status = StatusPeca.PRONTA;
              const peca = new Peca(nome, tipo, fornecedor, status);
              aeronave.pecas.push(peca);
              console.log("Peça cadastrada!");
              salvarAeronaves(aeronaves, AERONAVES_FILE);
              menu();
            });
          });
        });
      });
    });
  }
  function atualizarStatusPeca() {
    listarAeronaves();
    rl.question("Escolha o número da aeronave: ", (numA) => {
      const aeronave = aeronaves[parseInt(numA) - 1];
      if (!aeronave || !aeronave.pecas || aeronave.pecas.length === 0) {
        console.log("Aeronave ou lista de peças inválida.");
        menu();
        return;
      }
      aeronave.pecas.forEach((p: Peca, i: number) =>
        console.log(`${i + 1}. ${p.nome} | Status: ${p.status}`)
      );
      rl.question("Escolha o número da peça: ", (numP) => {
        const peca = aeronave.pecas[parseInt(numP) - 1];
        if (!peca) {
          console.log("Peça inválida.");
          menu();
          return;
        }
        rl.question("Novo status (producao/transporte/pronta): ", (statusDigitado) => {
          if (statusDigitado === "producao") peca.status = StatusPeca.PRODUCAO;
          else if (statusDigitado === "transporte") peca.status = StatusPeca.TRANSPORTE;
          else if (statusDigitado === "pronta") peca.status = StatusPeca.PRONTA;
          else {
            console.log("Status inválido.");
            menu();
            return;
          }
          salvarAeronaves(aeronaves, AERONAVES_FILE);
          console.log("Status da peça atualizado!");
          menu();
        });
      });
    });
  }

  function listarPecas() {
    listarAeronaves();
    rl.question("Escolha o número da aeronave: ", (num) => {
      const aeronave = aeronaves[parseInt(num) - 1];
      console.log("--- Peças da Aeronave ---");
      aeronave.pecas.forEach((p, i) => {
        console.log(`${i+1}. ${p.nome} | ${p.tipo} | ${p.fornecedor} | ${p.status}`);
      });
      salvarAeronaves(aeronaves, AERONAVES_FILE);
      menu();
    });
  }

  
function autenticarFuncionario(callback: () => void) {
  rl.question("Usuário: ", (usuarioDigitado) => {
    rl.question("Senha: ", (senhaDigitada) => {
      const funcionario = funcionarios.find((f: Funcionario) => f.usuario === usuarioDigitado && f.senha === senhaDigitada);
      if (!funcionario) {
        console.log("Usuário ou senha inválidos.");
        autenticarFuncionario(callback);
        return;
      }
      usuarioLogado = funcionario;
      console.log(`Usuário autenticado como ${funcionario.nome} (${funcionario.permissao})`);
      callback();
    });
  });
}

function exigePermissao(niveis: NivelPermissao[], acao: () => void) {
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
} else {
  autenticarFuncionario(menu);
}

