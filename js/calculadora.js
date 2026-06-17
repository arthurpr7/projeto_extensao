document.addEventListener("DOMContentLoaded", function () {
  var DIAS_NO_MES = 30;
  var SEMANAS_NO_MES = 4;
  var LITROS_POR_MINUTO_CHUVEIRO = 12;
  var LITROS_POR_DESCARGA = 6;
  var LITROS_POR_MINUTO_TORNEIRA = 6;
  var LITROS_POR_LAVAGEM = 50;

  var btnCalcular = document.querySelector("#btn-calcular");
  var formMensagem = document.querySelector("#form-mensagem");
  var totalLitrosEl = document.querySelector("#total-litros");
  var totalM3El = document.querySelector("#total-m3");
  var totalReaisEl = document.querySelector("#total-reais");

  if (!btnCalcular) {
    return;
  }

  btnCalcular.addEventListener("click", function () {
    var dados = lerCampos();

    if (!validarCampos(dados)) {
      return;
    }

    var resultado = calcularConsumo(dados);
    exibirResultado(resultado);
    limparMensagem();
  });

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
    var pessoas = Number(dados.pessoas);
    var chuveiro = Number(dados.chuveiro);
    var descarga = Number(dados.descarga);
    var torneira = Number(dados.torneira);
    var roupa = Number(dados.roupa);
    var rega = Number(dados.rega);
    var tarifa = Number(dados.tarifa);

    var consumoChuveiro = chuveiro * LITROS_POR_MINUTO_CHUVEIRO * pessoas * DIAS_NO_MES;
    var consumoDescarga = descarga * LITROS_POR_DESCARGA * pessoas * DIAS_NO_MES;
    var consumoTorneira = torneira * LITROS_POR_MINUTO_TORNEIRA * pessoas * DIAS_NO_MES;
    var consumoRoupa = roupa * LITROS_POR_LAVAGEM * SEMANAS_NO_MES;
    var consumoRega = rega * SEMANAS_NO_MES;

    var litros = consumoChuveiro + consumoDescarga + consumoTorneira + consumoRoupa + consumoRega;
    var m3 = litros / 1000;
    var reais = m3 * tarifa;

    return {
      litros: litros,
      m3: m3,
      reais: reais
    };
  }

  function exibirResultado(resultado) {
    totalLitrosEl.textContent = formatarNumero(resultado.litros) + " L";
    totalM3El.textContent = resultado.m3.toFixed(2).replace(".", ",") + " m³";
    totalReaisEl.textContent = "R$ " + resultado.reais.toFixed(2).replace(".", ",");
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
