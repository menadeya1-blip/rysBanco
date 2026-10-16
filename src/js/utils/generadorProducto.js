/**
 * Genera el número de producto único de 16 dígitos que se asigna al abrir cada producto.
 */
export class GeneradorProducto {
  static generar() {
    let numero = '';
    for (let i = 0; i < 16; i++) {
      numero += Math.floor(Math.random() * 10);
    }
    return numero;
  }
}