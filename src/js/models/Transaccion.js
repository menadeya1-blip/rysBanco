/**
 * Registro de un movimiento de una cuenta (consignación, retiro, transferencia, interés, pago).
 * Encapsulamiento: los datos solo se leen mediante getters.
 */
export class Transaccion {
  static TIPOS = Object.freeze({
    CONSIGNACION: 'Consignación',
    RETIRO: 'Retiro',
    TRANSFERENCIA: 'Transferencia',
    INTERES: 'Interés',
    PAGO_TARJETA: 'Pago de tarjeta',
    COMPRA_CUOTAS: 'Compra a cuotas'
  });

  #fecha;
  #tipo;
  #valor;
  #descripcion;

  constructor(tipo, valor, descripcion = '', fecha = new Date()) {
    if (!Object.values(Transaccion.TIPOS).includes(tipo)) {
      throw new Error(`Tipo de transacción no válido: ${tipo}`);
    }
    if (typeof valor !== 'number' || Number.isNaN(valor)) {
      throw new Error('El valor de la transacción debe ser un número.');
    }

    this.#tipo = tipo;
    this.#valor = valor;
    this.#descripcion = descripcion;
    this.#fecha = new Date(fecha);
  }

  get fecha() {
    return new Date(this.#fecha);
  }

  get tipo() {
    return this.#tipo;
  }

  get valor() {
    return this.#valor;
  }

  get descripcion() {
    return this.#descripcion;
  }

  toJSON() {
    return {
      fecha: this.#fecha.toISOString(),
      tipo: this.#tipo,
      valor: this.#valor,
      descripcion: this.#descripcion
    };
  }

  static desdeJSON(datos) {
    return new Transaccion(datos.tipo, datos.valor, datos.descripcion, new Date(datos.fecha));
  }
}