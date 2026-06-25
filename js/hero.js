/*
 * hero.js — Carrossel da página inicial (index.html)
 * Troca slides de curiosidades automaticamente e permite navegação manual.
 */

document.addEventListener("DOMContentLoaded", function () {
  var carousel = document.querySelector("#hero-carousel");

  /* Só roda na index; nas outras páginas o elemento não existe */
  if (!carousel) {
    return;
  }

  var slides = carousel.querySelectorAll(".hero-carousel-slide");
  var dots = carousel.querySelectorAll(".hero-carousel-dot");
  var btnPrev = carousel.querySelector(".hero-carousel-btn--prev");
  var btnNext = carousel.querySelector(".hero-carousel-btn--next");
  var totalSlides = slides.length;
  var indiceAtual = 0;
  var intervaloId = null;
  var INTERVALO_MS = 5000; /* troca de slide a cada 5 segundos */

  if (totalSlides === 0 || !btnPrev || !btnNext) {
    return;
  }

  /*
   * Troca o slide visível: remove classes do slide atual,
   * atualiza o índice e ativa o novo slide + bolinha correspondente.
   * Índices fora do range voltam ao início/fim (efeito carrossel infinito).
   */
  function irParaSlide(indice) {
    if (indice < 0) {
      indice = totalSlides - 1;
    }

    if (indice >= totalSlides) {
      indice = 0;
    }

    if (indice === indiceAtual) {
      return;
    }

    slides[indiceAtual].classList.remove("is-active");
    slides[indiceAtual].setAttribute("aria-hidden", "true");
    dots[indiceAtual].classList.remove("is-active");
    dots[indiceAtual].setAttribute("aria-selected", "false");

    indiceAtual = indice;

    slides[indiceAtual].classList.add("is-active");
    slides[indiceAtual].setAttribute("aria-hidden", "false");
    dots[indiceAtual].classList.add("is-active");
    dots[indiceAtual].setAttribute("aria-selected", "true");
  }

  function proximoSlide() {
    irParaSlide(indiceAtual + 1);
  }

  function slideAnterior() {
    irParaSlide(indiceAtual - 1);
  }

  /* Cancela o timer automático (usado ao passar o mouse ou focar no carrossel) */
  function pararAutoPlay() {
    if (intervaloId !== null) {
      clearInterval(intervaloId);
      intervaloId = null;
    }
  }

  /*
   * Inicia a troca automática de slides.
   * Respeita prefers-reduced-motion: usuários que pedem menos animação
   * não recebem auto-play.
   */
  function iniciarAutoPlay() {
    pararAutoPlay();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    intervaloId = setInterval(proximoSlide, INTERVALO_MS);
  }

  /* Reinicia o cronômetro após interação manual (setas ou bolinhas) */
  function reiniciarAutoPlay() {
    pararAutoPlay();
    iniciarAutoPlay();
  }

  btnNext.addEventListener("click", function () {
    proximoSlide();
    reiniciarAutoPlay();
  });

  btnPrev.addEventListener("click", function () {
    slideAnterior();
    reiniciarAutoPlay();
  });

  /* Cada bolinha leva direto ao slide correspondente */
  for (var i = 0; i < dots.length; i++) {
    (function (indice) {
      dots[indice].addEventListener("click", function () {
        irParaSlide(indice);
        reiniciarAutoPlay();
      });
    })(i);
  }

  /* Pausa no hover e retoma ao sair — melhor leitura do texto */
  carousel.addEventListener("mouseenter", pararAutoPlay);
  carousel.addEventListener("mouseleave", iniciarAutoPlay);

  /* Mesma lógica para navegação por teclado (acessibilidade) */
  carousel.addEventListener("focusin", pararAutoPlay);

  carousel.addEventListener("focusout", function (evento) {
    if (!carousel.contains(evento.relatedTarget)) {
      iniciarAutoPlay();
    }
  });

  iniciarAutoPlay();
});
