import { Cliente } from '../models/Cliente.js';
import { CuentaAhorros } from '../models/CuentaAhorros.js';
import { CuentaCorriente } from '../models/CuentaCorriente.js';
import { TarjetaCredito } from '../models/TarjetaCredito.js';
import { Almacenamiento } from '../utils/almacenamiento.js';

const CLAVE_DATOS = 'rys_banco_datos';

/**
 * Único punto que guarda y lee los clientes del banco (patrón singleton).
 * Usa BancoSistema.instancia para obtenerlo.
 */
export class BancoSistema {
  static CUPO_TARJETA_INICIAL = 5000000;
  static #instancia = null;

  #clientes = [];

  constructor() {
    this.#cargar();
  }

  static get instancia() {
    if (BancoSistema.#instancia === null) {
      BancoSistema.#instancia = new BancoSistema();
    }
    return BancoSistema.#instancia;
  }

  get clientes() {
    return [...this.#clientes];
  }

  buscarPorUsuario(usuario) {
    const buscado = (usuario ?? '').trim().toLowerCase();
    return this.#clientes.find((cliente) => cliente.usuario.toLowerCase() === buscado) ?? null;
  }

  buscarPorDocumento(tipoDocumento, numeroDocumento) {
    return this.#clientes.find(
      (cliente) => cliente.tipoDocumento === tipoDocumento && cliente.numeroDocumento === numeroDocumento
    ) ?? null;
  }

  /** Busca un producto por su número en todos los clientes. Devuelve { cliente, cuenta } o null. */
  buscarCuentaPorNumero(numero) {
    for (const cliente of this.#clientes) {
      const cuenta = cliente.buscarCuenta(numero);
      if (cuenta) {
        return { cliente, cuenta };
      }
    }
    return null;
  }

  agregarCliente(cliente) {
    if (this.buscarPorUsuario(cliente.usuario)) {
      throw new Error('Ese nombre de usuario ya existe. Elige otro.');
    }
    if (this.buscarPorDocumento(cliente.tipoDocumento, cliente.numeroDocumento)) {
      throw new Error('Ya existe un cliente con ese documento.');
    }

    this.#clientes.push(cliente);
    this.guardar();
    return cliente;
  }

  eliminarCliente(usuario) {
    const cliente = this.buscarPorUsuario(usuario);
    if (!cliente) {
      throw new Error('El usuario no existe.');
    }

    this.#clientes = this.#clientes.filter((actual) => actual !== cliente);
    this.guardar();
  }

  guardar() {
    Almacenamiento.guardarJSON(CLAVE_DATOS, {
      clientes: this.#clientes.map((cliente) => cliente.toJSON())
    });
  }

  /** Fábrica: crea el producto según la opción elegida en el registro. */
  static crearProducto(tipoProducto, numero) {
    switch (tipoProducto) {
      case 'ahorros':
        return new CuentaAhorros(numero);
      case 'corriente':
        return new CuentaCorriente(numero);
      case 'tarjeta':
        return new TarjetaCredito(numero, BancoSistema.CUPO_TARJETA_INICIAL);
      default:
        throw new Error(`Tipo de producto desconocido: ${tipoProducto}`);
    }
  }

  /** Fábrica: reconstruye un producto a partir del JSON guardado (polimorfismo al cargar). */
  static reconstruirCuenta(datos) {
    switch (datos.tipo) {
      case 'Cuenta de ahorros':
        return new CuentaAhorros(datos.numero, datos.saldo, datos.movimientos);
      case 'Cuenta corriente':
        return new CuentaCorriente(datos.numero, datos.saldo, datos.movimientos);
      case 'Tarjeta de crédito':
        return new TarjetaCredito(datos.numero, datos.cupoTotal, datos.saldo, datos.movimientos);
      default:
        throw new Error(`Tipo de producto guardado no reconocido: ${datos.tipo}`);
    }
  }

  #cargar() {
    const datos = Almacenamiento.leerJSON(CLAVE_DATOS);

    if (!datos?.clientes) {
      return;
    }

    this.#clientes = datos.clientes.map((datosCliente) => {
      const cliente = new Cliente(datosCliente);
      datosCliente.cuentas.forEach((datosCuenta) => {
        cliente.agregarCuenta(BancoSistema.reconstruirCuenta(datosCuenta));
      });
      return cliente;
    });
  }
}