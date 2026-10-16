import { Cuenta } from './Cuenta.js';
import { Transaccion } from './Transaccion.js';

/**
 * Cuenta de ahorros: guardar dinero a mediano y largo plazo.
 *
 * - Interés mensual del 1,5 %, calculado y aplicado en el momento del retiro.
 * - El monto a retirar no puede superar el saldo disponible.
 *
 * Herencia: reutiliza consignar() y retirar() de Cuenta.
 * Polimorfismo: redefine calcularLimiteRetiro() y _aplicarAntesDeRetirar().
 */
export class CuentaAhorros extends Cuenta {
  static TASA_MENSUAL = 0.015;

  get tipo() {
    return 'Cuenta de ahorros';
  }

  /** El límite de retiro es el saldo disponible. */
  calcularLimiteRetiro() {
    return this.saldo;
  }

  /** Antes de retirar, calcula el interés sobre el saldo y lo abona a la cuenta. */
  _aplicarAntesDeRetirar() {
    const interes = this.#calcularInteres();

    if (interes > 0) {
      this._ajustarSaldo(interes);
      this._registrar(Transaccion.TIPOS.INTERES, interes, 'Interés del 1,5 % aplicado al retiro');
    }
  }

  #calcularInteres() {
    return Cuenta.redondear(this.saldo * CuentaAhorros.TASA_MENSUAL);
  }
}