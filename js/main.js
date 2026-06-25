/*
 * main.js — Menu de navegação mobile
 * Carregado em todas as páginas. Controla o botão hambúrguer e o menu lateral.
 */

document.addEventListener("DOMContentLoaded", function () {
  var navToggle = document.querySelector(".nav-toggle");
  var siteNav = document.querySelector(".site-nav");

  /* Se a página não tiver menu (ex.: erro de HTML), o script para aqui */
  if (!navToggle || !siteNav) {
    return;
  }

  /* Alterna abrir/fechar o menu ao clicar no botão hambúrguer */
  navToggle.addEventListener("click", function () {
    var isExpanded = navToggle.getAttribute("aria-expanded") === "true";

    navToggle.setAttribute("aria-expanded", String(!isExpanded));
    siteNav.classList.toggle("is-open", !isExpanded);
  });

  /* Fecha o menu automaticamente quando o usuário clica em um link */
  var navLinks = siteNav.querySelectorAll(".nav-link");

  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      navToggle.setAttribute("aria-expanded", "false");
      siteNav.classList.remove("is-open");
    });
  });
});
