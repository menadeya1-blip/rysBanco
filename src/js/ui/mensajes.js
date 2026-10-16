/**
 * Notificaciones tipo toast que aparecen en la esquina de la pantalla.
 */
export class Mensajes {
  static mostrar(texto, tipo = 'exito', duracion = 3500) {
    let contenedor = document.querySelector('.toasts');

    if (!contenedor) {
      contenedor = document.createElement('div');
      contenedor.className = 'toasts';
      document.body.appendChild(contenedor);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${tipo}`;
    toast.setAttribute('role', 'status');
    toast.textContent = texto;
    contenedor.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('visible');
    });

    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 400);
    }, duracion);
  }
}