document.addEventListener("DOMContentLoaded", function () {
  var DIAS_NO_MES = 30;
  var SEMANAS_NO_MES = 4;
  var LITROS_POR_MINUTO_CHUVEIRO = 12;
  var LITROS_POR_DESCARGA = 6;
  var LITROS_POR_MINUTO_TORNEIRA = 6;
  var LITROS_POR_LAVAGEM = 50;

  var REDUCAO_CHUVEIRO = 0.2;
  var REDUCAO_TORNEIRA = 0.3;
  var REDUCAO_DESCARGA = 0.15;

  var btnCalcular = document.querySelector("#btn-calcular");
  var btnSimular = document.querySelector("#btn-simular");
  var formMensagem = document.querySelector("#form-mensagem");
  var totalLitrosEl = document.querySelector("#total-litros");
  var totalM3El = document.querySelector("#total-m3");
  var totalReaisEl = document.querySelector("#total-reais");
  var antesLitrosEl = document.querySelector("#antes-litros");
  var antesReaisEl = document.querySelector("#antes-reais");
  var depoisLitrosEl = document.querySelector("#depois-litros");
  var depoisReaisEl = document.querySelector("#depois-reais");
  var economiaTotalEl = document.querySelector("#economia-total");

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

    ultimoCalculo = {
      dados: dadosNormalizados,
      resultado: resultado
    };

    exibirResultado(resultado);
    exibirAntes(resultado);
    limparComparadorDepois();
    limparMensagem();
  });

  if (btnSimular) {
    btnSimular.addEventListener("click", function () {
      if (!ultimoCalculo) {
        exibirErro("Calcule o consumo antes de simular a economia.");
        return;
      }

      var dadosOtimizados = criarCenarioOtimizado(ultimoCalculo.dados);
      var resultadoDepois = calcularConsumo(dadosOtimizados);
      var resultadoAntes = ultimoCalculo.resultado;

      exibirComparador(resultadoAntes, resultadoDepois);
      limparMensagem();
    });
  }

  function lerCampos() {
    return {
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

  function criarCenarioOtimizado(dados) {
    return {
      pessoas: dados.pessoas,
      chuveiro: dados.chuveiro * (1 - REDUCAO_CHUVEIRO),
      descarga: dados.descarga * (1 - REDUCAO_DESCARGA),
      torneira: dados.torneira * (1 - REDUCAO_TORNEIRA),
      roupa: dados.roupa,
      rega: dados.rega,
      tarifa: dados.tarifa
    };
  }

  function exibirResultado(resultado) {
    totalLitrosEl.textContent = formatarLitros(resultado.litros);
    totalM3El.textContent = resultado.m3.toFixed(2).replace(".", ",") + " m³";
    totalReaisEl.textContent = formatarReais(resultado.reais);
  }

  function exibirAntes(resultado) {
    antesLitrosEl.textContent = formatarLitros(resultado.litros);
    antesReaisEl.textContent = formatarReais(resultado.reais) + " por mês";
  }

  function exibirComparador(antes, depois) {
    antesLitrosEl.textContent = formatarLitros(antes.litros);
    antesReaisEl.textContent = formatarReais(antes.reais) + " por mês";
    depoisLitrosEl.textContent = formatarLitros(depois.litros);
    depoisReaisEl.textContent = formatarReais(depois.reais) + " por mês";

    var litrosEconomizados = antes.litros - depois.litros;
    var reaisEconomizados = antes.reais - depois.reais;
    var percentual = 0;

    if (antes.litros > 0) {
      percentual = (litrosEconomizados / antes.litros) * 100;
    }

    economiaTotalEl.textContent =
      formatarLitros(litrosEconomizados) +
      " (" + percentual.toFixed(1).replace(".", ",") + "%) — " +
      formatarReais(reaisEconomizados) + "/mês";
  }

  function limparComparadorDepois() {
    depoisLitrosEl.textContent = "—";
    depoisReaisEl.textContent = "—";
    economiaTotalEl.textContent = "—";
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
