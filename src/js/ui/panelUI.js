/**
 * Muestra un saludo según la hora del día en el panel del cliente.
 */
export class PanelUI {
  static iniciar() {
    const saludo = document.getElementById('saludo');

    if (!saludo) {
      return;
    }

    saludo.textContent = this.obtenerSaludo(new Date().getHours());
  }

  static obtenerSaludo(hora) {
    if (hora < 12) {
      return 'Buenos días';
    }
    if (hora < 18) {
      return 'Buenas tardes';
    }
    return 'Buenas noches';
  }
}