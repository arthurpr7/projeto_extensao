document.addEventListener("DOMContentLoaded", function () {
  var DIAS_NO_MES = 30;
  var SEMANAS_NO_MES = 4;
  var LITROS_POR_MINUTO_CHUVEIRO = 12;
  var LITROS_POR_DESCARGA = 6;
  var LITROS_POR_MINUTO_TORNEIRA = 6;
  var LITROS_POR_LAVAGEM = 50;

  var REFERENCIA_CHUVEIRO = 8;
  var REFERENCIA_DESCARGA = 4;
  var REFERENCIA_TORNEIRA = 5;
  var REFERENCIA_ROUPA = 2;

  var LIMITE_CONSUMO_BAIXO = 3000;
  var LIMITE_CONSUMO_MEDIO = 6000;

  var btnCalcular = document.querySelector("#btn-calcular");
  var formMensagem = document.querySelector("#form-mensagem");
  var painelComparador = document.querySelector("#painel-comparador");
  var painelResultado = document.querySelector("#painel-resultado");
  var totalLitrosEl = document.querySelector("#total-litros");
  var totalM3El = document.querySelector("#total-m3");
  var totalReaisEl = document.querySelector("#total-reais");
  var antesLitrosEl = document.querySelector("#antes-litros");
  var antesReaisEl = document.querySelector("#antes-reais");
  var depoisLitrosEl = document.querySelector("#depois-litros");
  var depoisReaisEl = document.querySelector("#depois-reais");
  var economiaTotalEl = document.querySelector("#economia-total");
  var economiaTituloEl = document.querySelector("#economia-titulo");
  var comparadorTituloEl = document.querySelector("#comparador-titulo");
  var comparadorSubtituloEl = document.querySelector("#comparador-subtitulo");
  var comparadorTagAntesEl = document.querySelector("#comparador-tag-antes");
  var comparadorTagDepoisEl = document.querySelector("#comparador-tag-depois");
  var listaDicasEl = document.querySelector("#lista-dicas");

  var ultimoCalculo = null;

  if (!btnCalcular) {
    return;
  }

  btnCalcular.addEventListener("click", function () {
    var dados = lerCampos();

    if (!validarCampos(dados)) {
      return;
    }

    var dadosNormalizados = normalizarDados(dados);
    var resultado = calcularConsumo(dadosNormalizados);
    var modo = lerModoCalculo();

    exibirResultado(resultado);
    atualizarDicas(resultado.litros, dadosNormalizados.pessoas);

    if (modo === "comparar") {
      var dadosConscientes = criarCenarioConsciente(dadosNormalizados);
      var resultadoConsciente = calcularConsumo(dadosConscientes);
      configurarComparador("consciente");
      exibirComparador(resultado, resultadoConsciente, "consciente");
      mostrarComparador();
    } else if (ultimoCalculo !== null) {
      configurarComparador("pessoal", dados.nome, ultimoCalculo.nome);
      exibirComparador(ultimoCalculo.resultado, resultado, "pessoal");
      mostrarComparador();
    } else {
      ocultarComparador();
    }

    ultimoCalculo = {
      dados: dadosNormalizados,
      resultado: resultado,
      nome: dados.nome
    };

    limparMensagem();
    rolarParaResultados();
  });

  function lerModoCalculo() {
    var selecionado = document.querySelector('input[name="modo-calculo"]:checked');

    if (!selecionado) {
      return "consumo";
    }

    return selecionado.value;
  }

  function lerCampos() {
    return {
      nome: document.querySelector("#nome-usuario").value.trim(),
      pessoas: document.querySelector("#pessoas").value,
      chuveiro: document.querySelector("#chuveiro").value,
      descarga: document.querySelector("#descarga").value,
      torneira: document.querySelector("#torneira").value,
      roupa: document.querySelector("#roupa").value,
      rega: document.querySelector("#rega").value,
      tarifa: document.querySelector("#tarifa").value
    };
  }

  function normalizarDados(dados) {
    return {
      pessoas: Number(dados.pessoas),
      chuveiro: Number(dados.chuveiro),
      descarga: Number(dados.descarga),
      torneira: Number(dados.torneira),
      roupa: Number(dados.roupa),
      rega: Number(dados.rega),
      tarifa: Number(dados.tarifa)
    };
  }

  function validarCampos(dados) {
    var campos = [
      { valor: dados.pessoas, nome: "Número de pessoas" },
      { valor: dados.chuveiro, nome: "Minutos de chuveiro" },
      { valor: dados.descarga, nome: "Descargas por dia" },
      { valor: dados.torneira, nome: "Minutos de torneira" },
      { valor: dados.roupa, nome: "Lavagens de roupa" },
      { valor: dados.rega, nome: "Rega de plantas" },
      { valor: dados.tarifa, nome: "Tarifa de água" }
    ];

    for (var i = 0; i < campos.length; i++) {
      var campo = campos[i];

      if (campo.valor === "" || campo.valor === null) {
        exibirErro("Preencha o campo: " + campo.nome + ".");
        return false;
      }

      var numero = Number(campo.valor);

      if (isNaN(numero)) {
        exibirErro("O campo \"" + campo.nome + "\" deve conter um número válido.");
        return false;
      }

      if (numero < 0) {
        exibirErro("O campo \"" + campo.nome + "\" não pode ser negativo.");
        return false;
      }
    }

    if (Number(dados.pessoas) < 1) {
      exibirErro("A casa deve ter pelo menos 1 pessoa.");
      return false;
    }

    return true;
  }

  function calcularConsumo(dados) {
    var consumoChuveiro = dados.chuveiro * LITROS_POR_MINUTO_CHUVEIRO * dados.pessoas * DIAS_NO_MES;
    var consumoDescarga = dados.descarga * LITROS_POR_DESCARGA * dados.pessoas * DIAS_NO_MES;
    var consumoTorneira = dados.torneira * LITROS_POR_MINUTO_TORNEIRA * dados.pessoas * DIAS_NO_MES;
    var consumoRoupa = dados.roupa * LITROS_POR_LAVAGEM * SEMANAS_NO_MES;
    var consumoRega = dados.rega * SEMANAS_NO_MES;

    var litros = consumoChuveiro + consumoDescarga + consumoTorneira + consumoRoupa + consumoRega;
    var m3 = litros / 1000;
    var reais = m3 * dados.tarifa;

    return {
      litros: litros,
      m3: m3,
      reais: reais
    };
  }

  function criarCenarioConsciente(dados) {
    return {
      pessoas: dados.pessoas,
      chuveiro: REFERENCIA_CHUVEIRO,
      descarga: REFERENCIA_DESCARGA,
      torneira: REFERENCIA_TORNEIRA,
      roupa: REFERENCIA_ROUPA,
      rega: dados.rega,
      tarifa: dados.tarifa
    };
  }

  function exibirResultado(resultado) {
    totalLitrosEl.textContent = formatarLitros(resultado.litros);
    totalM3El.textContent = resultado.m3.toFixed(2).replace(".", ",") + " m³";
    totalReaisEl.textContent = formatarReais(resultado.reais);
  }

  function configurarComparador(tipo, nomeAtual, nomeAnterior) {
    if (tipo === "pessoal") {
      comparadorTituloEl.textContent = "Comparador: evolução do seu consumo";
      comparadorSubtituloEl.textContent =
        "Veja a diferença entre o cálculo anterior e os hábitos que você acabou de informar.";
      comparadorTagAntesEl.textContent = formatarEtapaComparacao(nomeAnterior, "anterior");
      comparadorTagDepoisEl.textContent = formatarEtapaComparacao(nomeAtual, "atual");
      economiaTituloEl.textContent = "Variação";
      return;
    }

    comparadorTituloEl.textContent = "Comparador: seu consumo × uso consciente";
    comparadorSubtituloEl.textContent =
      "Veja a diferença entre os hábitos informados e uma referência de uso racional da água.";
    comparadorTagAntesEl.textContent = "Seu consumo";
    comparadorTagDepoisEl.textContent = "Uso consciente";
    economiaTituloEl.textContent = "Economia possível";
  }

  function formatarEtapaComparacao(nome, etapa) {
    if (nome) {
      return "Cálculo de " + nome + " — " + etapa;
    }

    return "Cálculo " + etapa;
  }

  function exibirComparador(resultadoAntes, resultadoDepois, tipo) {
    antesLitrosEl.textContent = formatarLitros(resultadoAntes.litros);
    antesReaisEl.textContent = formatarReais(resultadoAntes.reais) + " por mês";
    depoisLitrosEl.textContent = formatarLitros(resultadoDepois.litros);
    depoisReaisEl.textContent = formatarReais(resultadoDepois.reais) + " por mês";

    var litrosDiferenca = resultadoAntes.litros - resultadoDepois.litros;
    var reaisDiferenca = resultadoAntes.reais - resultadoDepois.reais;

    if (tipo === "pessoal") {
      if (litrosDiferenca === 0) {
        economiaTotalEl.textContent = "Seu consumo permaneceu igual ao cálculo anterior.";
        return;
      }

      if (litrosDiferenca > 0) {
        var percentualPessoal = (litrosDiferenca / resultadoAntes.litros) * 100;
        economiaTotalEl.textContent =
          "Você reduziu " + formatarLitros(litrosDiferenca) +
          " (" + percentualPessoal.toFixed(1).replace(".", ",") + "%) — " +
          formatarReais(reaisDiferenca) + "/mês em relação ao cálculo anterior.";
        return;
      }

      var litrosAumento = Math.abs(litrosDiferenca);
      var reaisAumento = Math.abs(reaisDiferenca);
      economiaTotalEl.textContent =
        "Seu consumo aumentou " + formatarLitros(litrosAumento) +
        " — " + formatarReais(reaisAumento) + "/mês em relação ao cálculo anterior.";
      return;
    }

    if (litrosDiferenca <= 0) {
      economiaTotalEl.textContent =
        "Você já consome menos ou igual à referência de uso consciente. Parabéns!";
      return;
    }

    var percentual = (litrosDiferenca / resultadoAntes.litros) * 100;

    economiaTotalEl.textContent =
      formatarLitros(litrosDiferenca) +
      " (" + percentual.toFixed(1).replace(".", ",") + "%) — " +
      formatarReais(reaisDiferenca) + "/mês";
  }

  function mostrarComparador() {
    if (painelComparador) {
      painelComparador.classList.remove("calc-panel--oculto");
    }
  }

  function ocultarComparador() {
    if (painelComparador) {
      painelComparador.classList.add("calc-panel--oculto");
    }
  }

  function rolarParaResultados() {
    if (painelResultado) {
      painelResultado.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function atualizarDicas(litrosTotais, pessoas) {
    if (!listaDicasEl) {
      return;
    }

    var litrosPorPessoa = litrosTotais / pessoas;
    var faixa = classificarConsumo(litrosPorPessoa);
    var dicas = obterDicasPorFaixa(faixa, litrosPorPessoa);

    listaDicasEl.textContent = "";

    for (var i = 0; i < dicas.length; i++) {
      var dica = dicas[i];
      var item = document.createElement("li");
      item.className = "tip-item";

      var icone = document.createElement("span");
      icone.className = "tip-icon";
      icone.setAttribute("aria-hidden", "true");
      icone.textContent = dica.icone;

      var texto = document.createElement("p");
      texto.className = "tip-text";
      texto.textContent = dica.texto;

      item.appendChild(icone);
      item.appendChild(texto);
      listaDicasEl.appendChild(item);
    }
  }

  function classificarConsumo(litrosPorPessoa) {
    if (litrosPorPessoa <= LIMITE_CONSUMO_BAIXO) {
      return "baixo";
    }

    if (litrosPorPessoa <= LIMITE_CONSUMO_MEDIO) {
      return "medio";
    }

    return "alto";
  }

  function obterDicasPorFaixa(faixa, litrosPorPessoa) {
    var litrosFormatados = formatarNumero(litrosPorPessoa);

    if (faixa === "baixo") {
      return [
        {
          icone: "✅",
          texto: "Consumo consciente! Sua média é de " + litrosFormatados + " L por pessoa/mês — abaixo de 3.000 L."
        },
        {
          icone: "💧",
          texto: "Continue fechando a torneira ao escovar os dentes e ensaboar a louça."
        },
        {
          icone: "🔧",
          texto: "Mantenha o hábito de verificar torneiras e descargas com vazamento."
        }
      ];
    }

    if (faixa === "medio") {
      return [
        {
          icone: "📊",
          texto: "Sua média é de " + litrosFormatados + " L por pessoa/mês — há espaço para melhorar."
        },
        {
          icone: "🚿",
          texto: "Reduza alguns minutos no banho. Cada minuto a menos no chuveiro economiza cerca de 12 litros."
        },
        {
          icone: "🪥",
          texto: "Feche a torneira ao escovar os dentes e ao ensaboar as mãos."
        },
        {
          icone: "🚽",
          texto: "Prefira a descarga econômica quando possível e evite usá-la como lixeira."
        }
      ];
    }

    return [
      {
        icone: "⚠️",
        texto: "Consumo elevado: " + litrosFormatados + " L por pessoa/mês — acima de 6.000 L."
      },
      {
        icone: "🚿",
        texto: "Priorize banhos mais curtos. O chuveiro é o maior vilão do consumo doméstico."
      },
      {
        icone: "🔧",
        texto: "Conserte vazamentos o quanto antes — uma torneira pingando desperdiça mais de 100 L por mês."
      },
      {
        icone: "👕",
        texto: "Use a máquina de lavar apenas com carga cheia e reutilize água da chuva para regar plantas."
      }
    ];
  }

  function formatarLitros(litros) {
    return formatarNumero(litros) + " L";
  }

  function formatarReais(valor) {
    return "R$ " + valor.toFixed(2).replace(".", ",");
  }

  function formatarNumero(numero) {
    return Math.round(numero).toLocaleString("pt-BR");
  }

  function exibirErro(mensagem) {
    formMensagem.textContent = mensagem;
    formMensagem.classList.add("form-message--error");
  }

  function limparMensagem() {
    formMensagem.textContent = "";
    formMensagem.classList.remove("form-message--error");
  }
});
