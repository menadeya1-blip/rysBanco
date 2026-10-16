import { BancoSistema } from './BancoSistema.js';
import { Cuenta } from '../models/Cuenta.js';
import { TarjetaCredito } from '../models/TarjetaCredito.js';
import { Transaccion } from '../models/Transaccion.js';

/**
 * Operaciones del panel del cajero: consignar, retirar, transferir, comprar a cuotas y consultar.
 * Cada operación valida, actualiza el modelo y guarda los cambios.
 */
export class TransaccionService {
  /** Tarifas de ejemplo para simular la compra del SOAT (no son valores oficiales). */
  static TARIFAS_SOAT = Object.freeze({
    moto: 350000,
    automovil: 600000,
    camioneta: 800000
  });

  static #obtenerCuenta(cliente, numeroCuenta) {
    const cuenta = cliente.buscarCuenta(numeroCuenta);
    if (!cuenta) {
      throw new Error('No encontramos ese producto en tu cuenta.');
    }
    return cuenta;
  }

  static consultarSaldo(cliente, numeroCuenta) {
    return TransaccionService.#obtenerCuenta(cliente, numeroCuenta).saldo;
  }

  static historial(cliente, numeroCuenta) {
    return TransaccionService.#obtenerCuenta(cliente, numeroCuenta).movimientos;
  }

  static consignar(cliente, numeroCuenta, monto) {
    const cuenta = TransaccionService.#obtenerCuenta(cliente, numeroCuenta);
    const saldo = cuenta.consignar(monto);
    BancoSistema.instancia.guardar();
    return saldo;
  }

  static retirar(cliente, numeroCuenta, monto) {
    const cuenta = TransaccionService.#obtenerCuenta(cliente, numeroCuenta);
    const saldo = cuenta.retirar(monto);
    BancoSistema.instancia.guardar();
    return saldo;
  }

  /**
   * Transfiere entre productos del mismo usuario (distinto tipo) o a cuentas de otros usuarios.
   * No se permite transferir al mismo producto.
   */
  static transferir(cliente, numeroOrigen, numeroDestino, monto) {
    const origen = TransaccionService.#obtenerCuenta(cliente, numeroOrigen);
    // Se ignoran los espacios: el número se muestra como "1234 5678 9012 3456" al copiarlo.
    const numeroLimpio = String(numeroDestino ?? '').replace(/\s/g, '');
    const destino = BancoSistema.instancia.buscarCuentaPorNumero(numeroLimpio);

    if (!destino) {
      throw new Error('La cuenta de destino no existe.');
    }
    if (destino.cuenta === origen) {
      throw new Error('No puedes transferir a la misma cuenta.');
    }
    if (destino.cliente === cliente && destino.cuenta.tipo === origen.tipo) {
      throw new Error('No se permiten transferencias al mismo producto. Elige un producto distinto.');
    }

    Cuenta.validarMonto(monto);

    if (destino.cuenta instanceof TarjetaCredito && monto > destino.cuenta.deuda) {
      throw new Error('El valor supera la deuda de la tarjeta de destino.');
    }

    // Primero se descuenta del origen (si falla, nada cambia); luego se abona al destino.
    origen.retirar(monto, Transaccion.TIPOS.TRANSFERENCIA, `Transferencia a ${destino.cliente.nombreCompleto}`);
    destino.cuenta.consignar(monto, Transaccion.TIPOS.TRANSFERENCIA, `Transferencia de ${cliente.nombreCompleto}`);

    BancoSistema.instancia.guardar();
    return origen.saldo;
  }

  /** Compra a cuotas con la tarjeta de crédito. Devuelve el resumen con la cuota mensual. */
  static comprarACuotas(cliente, numeroTarjeta, monto, cuotas, descripcion = 'Compra') {
    const tarjeta = TransaccionService.#obtenerCuenta(cliente, numeroTarjeta);

    if (!(tarjeta instanceof TarjetaCredito)) {
      throw new Error('Las compras a cuotas solo aplican a la tarjeta de crédito.');
    }

    const resumen = tarjeta.comprar(monto, cuotas, descripcion);
    BancoSistema.instancia.guardar();
    return resumen;
  }

  /** Cobra un valor: retiro en cuentas (polimorfismo) o una cuota en la tarjeta. */
  static #cobrar(cliente, numeroCuenta, monto, descripcion) {
    const cuenta = TransaccionService.#obtenerCuenta(cliente, numeroCuenta);
    Cuenta.validarMonto(monto);

    if (cuenta instanceof TarjetaCredito) {
      cuenta.comprar(monto, 1, descripcion);
    } else {
      cuenta.pagarServicio(monto, descripcion);
    }

    BancoSistema.instancia.guardar();
  }

  static pagarFactura(cliente, numeroCuenta, referencia, monto) {
    if (!referencia) {
      throw new Error('Escribe el número de referencia de la factura.');
    }

    TransaccionService.#cobrar(cliente, numeroCuenta, monto, `Pago factura ${referencia}`);
  }

  static comprarSoat(cliente, numeroCuenta, placa, tipoVehiculo) {
    const placaNormalizada = (placa ?? '').trim().toUpperCase();

    if (!/^[A-Z]{3}[0-9]{2}[0-9A-Z]$/.test(placaNormalizada)) {
      throw new Error('La placa no es válida. Ejemplo: ABC12D o ABC123.');
    }

    const valor = TransaccionService.TARIFAS_SOAT[tipoVehiculo];
    if (!valor) {
      throw new Error('Selecciona un tipo de vehículo válido.');
    }

    TransaccionService.#cobrar(cliente, numeroCuenta, valor, `SOAT ${tipoVehiculo} placa ${placaNormalizada}`);
    return valor;
  }
}