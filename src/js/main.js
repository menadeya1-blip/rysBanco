/**
 * Punto de entrada de la aplicación.
 * Aquí se activan los comportamientos comunes de todas las páginas.
 */
import { AuthUI } from './ui/authUI.js';
import { LandingUI } from './ui/landingUI.js';
import { PanelUI } from './ui/panelUI.js';
import { Mensajes } from './ui/mensajes.js';

function iniciarMenuHamburguesa() {
  const botonMenu = document.querySelector('.menu-hamburguesa');
  const menuNavegacion = document.querySelector('.menu-navegacion');

  if (!botonMenu || !menuNavegacion) {
    return;
  }

  botonMenu.addEventListener('click', () => {
    menuNavegacion.classList.toggle('abierto');
  });
}

function iniciarEventos() {
  document.addEventListener('cuenta-creada', () => {
    Mensajes.mostrar('Cuenta creada con éxito.', 'exito');
  });
}

iniciarMenuHamburguesa();
iniciarEventos();
AuthUI.iniciar();
LandingUI.iniciar();
PanelUI.iniciar();