import { Cuenta } from './Cuenta.js';

/**
 * Herencia: CuentaCorriente es una Cuenta.
 * Polimorfismo: no genera intereses y permite sobregirarse hasta un 20 % adicional sobre el saldo actual.
 * Ejemplo: con $1.000.000 de saldo, el límite de retiro es $1.200.000.
 */
export class CuentaCorriente extends Cuenta {
  static PORCENTAJE_SOBREGIRO = 0.2;

  get tipo() {
    return 'Cuenta corriente';
  }

  calcularLimiteRetiro() {
    return Cuenta.redondear(this.saldo * (1 + CuentaCorriente.PORCENTAJE_SOBREGIRO));
  }
}