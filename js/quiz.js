document.addEventListener("DOMContentLoaded", function () {
  var TOTAL_PERGUNTAS = 8;
  var PONTOS_MAXIMOS = 20;
  var LIMITE_CONSCIENTE = 80;
  var LIMITE_CAMINHO = 65;
  var MAX_MELHORIAS = 4;

  var PONTUACAO_IDEAL = {
    1: 3,
    2: 3,
    3: 3,
    4: 3,
    5: 2,
    6: 3,
    7: 2,
    8: 1
  };

  var ORDEM_PRIORIDADE = [1, 2, 3, 4, 6, 5, 7, 8];

  var DICAS_MELHORIA = {
    1: "Feche a torneira ao escovar os dentes — esse hábito diário evita dezenas de litros desperdiçados.",
    2: "Reduza o tempo no chuveiro para até 5 minutos. O banho é o maior consumidor de água na maioria das casas.",
    3: "Conserte vazamentos assim que perceber. Uma torneira pingando pode desperdiçar mais de 100 litros por mês.",
    4: "Use a descarga econômica quando possível. Cada descarga completa gasta cerca de 6 litros de água.",
    5: "Tente reutilizar água da chuva para regar plantas e limpar áreas externas.",
    6: "Ensaboe louça e dentes com a torneira fechada, abrindo só para enxaguar.",
    7: "Acumule roupas suficientes e use a máquina de lavar apenas com carga cheia.",
    8: "Prefira balde em vez de mangueira aberta para lavar calçada, quintal ou carro."
  };

  var btnResultado = document.querySelector("#btn-resultado");
  var quizMensagem = document.querySelector("#quiz-mensagem");
  var resultadoQuiz = document.querySelector("#resultado-quiz");
  var resultadoIcone = document.querySelector("#resultado-icone");
  var resultadoTitulo = document.querySelector("#resultado-titulo");
  var resultadoPontuacao = document.querySelector("#resultado-pontuacao");
  var resultadoTexto = document.querySelector("#resultado-texto");
  var melhoriasTitulo = document.querySelector("#melhorias-titulo");
  var listaMelhorias = document.querySelector("#lista-melhorias");

  if (!btnResultado) {
    return;
  }

  btnResultado.addEventListener("click", function () {
    if (!validarRespostas()) {
      return;
    }

    var pontuacao = calcularPontuacao();
    var percentual = (pontuacao / PONTOS_MAXIMOS) * 100;
    var classificacao = classificarResultado(percentual);
    var melhorias = obterMelhorias();

    exibirResultado(pontuacao, percentual, classificacao, melhorias);
    limparMensagem();
  });

  function validarRespostas() {
    for (var i = 1; i <= TOTAL_PERGUNTAS; i++) {
      var selecionada = document.querySelector('input[name="pergunta-' + i + '"]:checked');

      if (!selecionada) {
        exibirErro("Responda todas as perguntas antes de ver o resultado. Falta a pergunta " + i + ".");
        ocultarResultado();
        return false;
      }
    }

    return true;
  }

  function calcularPontuacao() {
    var total = 0;

    for (var i = 1; i <= TOTAL_PERGUNTAS; i++) {
      var selecionada = document.querySelector('input[name="pergunta-' + i + '"]:checked');
      total = total + Number(selecionada.value);
    }

    return total;
  }

  function obterMelhorias() {
    var melhorias = [];

    for (var i = 0; i < ORDEM_PRIORIDADE.length; i++) {
      var numero = ORDEM_PRIORIDADE[i];
      var selecionada = document.querySelector('input[name="pergunta-' + numero + '"]:checked');
      var pontos = Number(selecionada.value);
      var ideal = PONTUACAO_IDEAL[numero];

      if (pontos < ideal) {
        melhorias.push(DICAS_MELHORIA[numero]);
      }

      if (melhorias.length >= MAX_MELHORIAS) {
        break;
      }
    }

    return melhorias;
  }

  function classificarResultado(percentual) {
    if (percentual >= LIMITE_CONSCIENTE) {
      return {
        nivel: "consciente",
        icone: "🌊",
        titulo: "Economizador consciente",
        texto: "Parabéns! Seus hábitos diários demonstram respeito pela água. Continue assim e busque sempre pequenas melhorias."
      };
    }

    if (percentual >= LIMITE_CAMINHO) {
      return {
        nivel: "medio",
        icone: "💧",
        titulo: "No caminho certo",
        texto: "Você já adota boas práticas e está próximo de um consumo consciente. Foque nos hábitos diários — chuveiro, torneira e descarga — para evoluir ainda mais."
      };
    }

    return {
      nivel: "baixo",
      icone: "🚿",
      titulo: "Hora de mudar hábitos",
      texto: "Seus hábitos diários de consumo precisam de atenção. Comece fechando a torneira ao escovar os dentes e reduzindo o tempo no chuveiro — são ações repetidas todos os dias."
    };
  }

  function exibirResultado(pontuacao, percentual, classificacao, melhorias) {
    resultadoIcone.textContent = classificacao.icone;
    resultadoTitulo.textContent = classificacao.titulo;
    resultadoPontuacao.textContent =
      "Você obteve " + pontuacao + " de " + PONTOS_MAXIMOS + " pontos (" +
      percentual.toFixed(0) + "%)";
    resultadoTexto.textContent = classificacao.texto;

    exibirMelhorias(melhorias);

    resultadoQuiz.className = "quiz-resultado quiz-resultado--" + classificacao.nivel;
    resultadoQuiz.hidden = false;

    resultadoQuiz.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function exibirMelhorias(melhorias) {
    listaMelhorias.textContent = "";

    if (melhorias.length === 0) {
      melhoriasTitulo.textContent = "Seus hábitos";
      var item = document.createElement("li");
      item.className = "resultado-melhoria-item";
      item.textContent = "Você respondeu bem em todas as áreas. Continue mantendo esses bons hábitos no dia a dia.";
      listaMelhorias.appendChild(item);
      return;
    }

    melhoriasTitulo.textContent = "O que você pode melhorar";

    for (var i = 0; i < melhorias.length; i++) {
      var dica = document.createElement("li");
      dica.className = "resultado-melhoria-item";
      dica.textContent = melhorias[i];
      listaMelhorias.appendChild(dica);
    }
  }

  function ocultarResultado() {
    resultadoQuiz.hidden = true;
  }

  function exibirErro(mensagem) {
    quizMensagem.textContent = mensagem;
    quizMensagem.classList.add("quiz-mensagem--erro");
  }

  function limparMensagem() {
    quizMensagem.textContent = "";
    quizMensagem.classList.remove("quiz-mensagem--erro");
  }
});
