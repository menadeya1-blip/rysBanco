/**
 * Hace que las secciones con la clase "revelar" aparezcan suavemente al hacer scroll.
 * Revisa la posición de cada sección directamente, sin depender de IntersectionObserver.
 * Si JavaScript no carga, las secciones se muestran normalmente (nunca quedan ocultas).
 */
export class LandingUI {
  static iniciar() {
    const elementos = Array.from(document.querySelectorAll('.revelar'));

    if (elementos.length === 0) {
      return;
    }

    elementos.forEach((elemento) => elemento.classList.add('oculto'));

    const revisar = () => {
      const alturaVentana = window.innerHeight;

      elementos.forEach((elemento) => {
        if (!elemento.classList.contains('oculto')) {
          return;
        }

        const posicion = elemento.getBoundingClientRect();

        if (posicion.top < alturaVentana * 0.9) {
          elemento.classList.remove('oculto');
        }
      });
    };

    window.addEventListener('scroll', revisar, { passive: true });
    window.addEventListener('resize', revisar);
    window.addEventListener('load', revisar);
    revisar();
  }
}