document.addEventListener("DOMContentLoaded", function () {
  var carousel = document.querySelector("#hero-carousel");

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
  var INTERVALO_MS = 5000;

  if (totalSlides === 0 || !btnPrev || !btnNext) {
    return;
  }

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

  function pararAutoPlay() {
    if (intervaloId !== null) {
      clearInterval(intervaloId);
      intervaloId = null;
    }
  }

  function iniciarAutoPlay() {
    pararAutoPlay();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    intervaloId = setInterval(proximoSlide, INTERVALO_MS);
  }

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

  for (var i = 0; i < dots.length; i++) {
    (function (indice) {
      dots[indice].addEventListener("click", function () {
        irParaSlide(indice);
        reiniciarAutoPlay();
      });
    })(i);
  }

  carousel.addEventListener("mouseenter", pararAutoPlay);
  carousel.addEventListener("mouseleave", iniciarAutoPlay);

  carousel.addEventListener("focusin", pararAutoPlay);

  carousel.addEventListener("focusout", function (evento) {
    if (!carousel.contains(evento.relatedTarget)) {
      iniciarAutoPlay();
    }
  });

  iniciarAutoPlay();
});
