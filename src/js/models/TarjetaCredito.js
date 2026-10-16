import { Cuenta } from './Cuenta.js';
import { Transaccion } from './Transaccion.js';

/**
 * Herencia: TarjetaCredito es una Cuenta.
 * En esta clase, "saldo" representa el cupo disponible.
 *
 * Polimorfismo:
 *  - consignar() significa pagar la deuda, no depositar.
 *  - retirar() no está permitido: la tarjeta no entrega efectivo.
 *  - comprar() financia en cuotas con las tasas del documento.
 */
export class TarjetaCredito extends Cuenta {
  #cupoTotal;

  constructor(numero, cupoTotal, cupoDisponible = cupoTotal, movimientos = []) {
    if (typeof cupoTotal !== 'number' || cupoTotal <= 0) {
      throw new Error('El cupo de la tarjeta debe ser mayor que cero.');
    }
    if (cupoDisponible < 0 || cupoDisponible > cupoTotal) {
      throw new Error('El cupo disponible no es válido.');
    }

    super(numero, cupoDisponible, movimientos);
    this.#cupoTotal = cupoTotal;
  }

  get tipo() {
    return 'Tarjeta de crédito';
  }

  get cupoTotal() {
    return this.#cupoTotal;
  }

  get cupoDisponible() {
    return this.saldo;
  }

  get deuda() {
    return Cuenta.redondear(this.#cupoTotal - this.saldo);
  }

  /** Tasa mensual según el número de cuotas (tabla del documento). */
  static tasaParaCuotas(cuotas) {
    if (!Number.isInteger(cuotas) || cuotas < 1) {
      throw new Error('El número de cuotas debe ser un entero mayor que cero.');
    }
    if (cuotas <= 2) {
      return 0;
    }
    if (cuotas <= 6) {
      return 0.019;
    }
    return 0.023;
  }

  /** Cuota mensual = (Capital × tasa) / (1 − (1 + tasa)^(−n)) */
  static calcularCuota(capital, cuotas) {
    const tasa = TarjetaCredito.tasaParaCuotas(cuotas);
    const cuota = tasa === 0
      ? capital / cuotas
      : (capital * tasa) / (1 - (1 + tasa) ** -cuotas);

    return Cuenta.redondear(cuota);
  }

  /** Compra a cuotas. Devuelve el resumen que se muestra al usuario. */
  comprar(monto, cuotas, descripcion = 'Compra') {
    Cuenta.validarMonto(monto);

    if (monto > this.cupoDisponible) {
      throw new Error(`La compra supera el cupo disponible (${Cuenta.formatear(this.cupoDisponible)}).`);
    }

    const tasa = TarjetaCredito.tasaParaCuotas(cuotas);
    const cuotaMensual = TarjetaCredito.calcularCuota(monto, cuotas);
    const totalPagar = Cuenta.redondear(cuotaMensual * cuotas);

    this._ajustarSaldo(-monto);
    this._registrar(
      Transaccion.TIPOS.COMPRA_CUOTAS,
      monto,
      `${descripcion} en ${cuotas} cuota(s) de ${Cuenta.formatear(cuotaMensual)}`
    );

    return {
      monto,
      cuotas,
      tasa,
      cuotaMensual,
      totalPagar,
      interesTotal: Cuenta.redondear(totalPagar - monto)
    };
  }

  /** Pagar la tarjeta reduce la deuda. */
  consignar(monto, tipo = Transaccion.TIPOS.PAGO_TARJETA, descripcion = 'Pago a la tarjeta') {
    Cuenta.validarMonto(monto);

    if (monto > this.deuda) {
      throw new Error(`El pago supera la deuda actual (${Cuenta.formatear(this.deuda)}).`);
    }

    this._ajustarSaldo(monto);
    this._registrar(tipo, monto, descripcion);
    return this.cupoDisponible;
  }

  retirar() {
    throw new Error('La tarjeta de crédito no permite retiros en efectivo.');
  }

  toJSON() {
    return { ...super.toJSON(), cupoTotal: this.#cupoTotal };
  }
}