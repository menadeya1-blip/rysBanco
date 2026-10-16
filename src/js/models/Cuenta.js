import { Transaccion } from './Transaccion.js';

/**
 * Clase base abstracta de todos los productos bancarios.
 *
 * Abstracción: define el comportamiento común (saldo, consignar, retirar, movimientos).
 * Encapsulamiento: el saldo y los movimientos son campos privados (#).
 * Polimorfismo: calcularLimiteRetiro() y _aplicarAntesDeRetirar() cambian según el producto.
 *
 * Los métodos con guion bajo (_registrar, _ajustarSaldo...) son "protegidos por convención":
 * solo deben usarlos las subclases. JavaScript no tiene protected.
 */
export class Cuenta {
  #numero;
  #saldo;
  #movimientos;

  constructor(numero, saldoInicial = 0, movimientos = []) {
    if (new.target === Cuenta) {
      throw new Error('Cuenta es abstracta: use CuentaAhorros, CuentaCorriente o TarjetaCredito.');
    }

    this.#numero = numero;
    this.#saldo = Cuenta.redondear(saldoInicial);
    this.#movimientos = movimientos.map((movimiento) =>
      movimiento instanceof Transaccion ? movimiento : Transaccion.desdeJSON(movimiento)
    );
  }

  get numero() {
    return this.#numero;
  }

  get saldo() {
    return this.#saldo;
  }

  /** Copia ordenada por fecha descendente (la más reciente primero). */
  get movimientos() {
    return [...this.#movimientos].sort((a, b) => b.fecha - a.fecha);
  }

  /** Cada subclase devuelve su nombre de producto. */
  get tipo() {
    return 'Cuenta';
  }

  consignar(monto, tipo = Transaccion.TIPOS.CONSIGNACION, descripcion = 'Consignación en efectivo') {
    Cuenta.validarMonto(monto);
    this.#saldo = Cuenta.redondear(this.#saldo + monto);
    this._registrar(tipo, monto, descripcion);
    return this.#saldo;
  }

  retirar(monto, tipo = Transaccion.TIPOS.RETIRO, descripcion = 'Retiro en cajero') {
    Cuenta.validarMonto(monto);

    const limite = this.calcularLimiteRetiro();
    if (monto > limite) {
      throw new Error(`Saldo insuficiente. El límite de retiro es ${Cuenta.formatear(limite)}.`);
    }

    this._aplicarAntesDeRetirar();
    this.#saldo = Cuenta.redondear(this.#saldo - monto);
    this._registrar(tipo, monto, descripcion);
    return this.#saldo;
  }

  /** Método abstracto: cada producto decide cuánto puede retirar. */
  calcularLimiteRetiro() {
    throw new Error('Método abstracto: debe implementarlo la subclase.');
  }

  /** Gancho para subclases (por ejemplo, aplicar intereses antes de retirar). */
  _aplicarAntesDeRetirar() {
    // Por defecto no hace nada.
  }

  /**
   * Pago de un servicio (factura, SOAT). No es un retiro: no aplica el interés
   * de ahorros, pero respeta el límite de cada producto (sobregiro incluido).
   */
  pagarServicio(monto, descripcion) {
    Cuenta.validarMonto(monto);

    const limite = this.calcularLimiteRetiro();
    if (monto > limite) {
      throw new Error(`Saldo insuficiente. Disponible para pagar: ${Cuenta.formatear(limite)}.`);
    }

    this._ajustarSaldo(-monto);
    this._registrar(Transaccion.TIPOS.RETIRO, monto, descripcion);
    return this.saldo;
  }

  _registrar(tipo, valor, descripcion = '') {
    this.#movimientos.push(new Transaccion(tipo, valor, descripcion));
  }

  _ajustarSaldo(delta) {
    this.#saldo = Cuenta.redondear(this.#saldo + delta);
  }

  toJSON() {
    return {
      tipo: this.tipo,
      numero: this.#numero,
      saldo: this.#saldo,
      movimientos: this.#movimientos.map((movimiento) => movimiento.toJSON())
    };
  }

  static validarMonto(monto) {
    if (typeof monto !== 'number' || Number.isNaN(monto) || monto <= 0) {
      throw new Error('El monto debe ser un número mayor que cero.');
    }
  }

  static redondear(valor) {
    return Math.round(valor * 100) / 100;
  }

  static formatear(valor) {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(valor);
  }
}