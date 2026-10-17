import { Cuenta } from './Cuenta.js';
import { Persona } from './Persona.js';
import { Validaciones } from '../utils/validaciones.js';

/**
 * Cliente del banco: es una Persona con datos personales y sus productos (relación 1..* con Cuenta).
 *
 * Herencia: usuario, contraseña y sus métodos vienen de Persona.
 * Encapsulamiento: todos los datos son privados y se cambian solo con métodos que validan.
 */
export class Cliente extends Persona {
  #tipoDocumento;
  #numeroDocumento;
  #nombres;
  #apellidos;
  #celular;
  #correo;
  #cuentas;

  constructor({ tipoDocumento, numeroDocumento, nombres, apellidos, celular, correo, usuario, contrasena }) {
    if (!Validaciones.documento(tipoDocumento, numeroDocumento)) {
      throw new Error('El número de documento no es válido para el tipo seleccionado.');
    }

    super(usuario, contrasena);

    this.#tipoDocumento = tipoDocumento;
    this.#numeroDocumento = numeroDocumento;
    this.#nombres = nombres.trim();
    this.#apellidos = apellidos.trim();
    this.#celular = celular;
    this.#correo = correo;
    this.#cuentas = [];
  }

  get tipoDocumento() {
    return this.#tipoDocumento;
  }

  get numeroDocumento() {
    return this.#numeroDocumento;
  }

  get nombres() {
    return this.#nombres;
  }

  get apellidos() {
    return this.#apellidos;
  }

  get nombreCompleto() {
    return `${this.#nombres} ${this.#apellidos}`;
  }

  get celular() {
    return this.#celular;
  }

  get correo() {
    return this.#correo;
  }

  get cuentas() {
    return [...this.#cuentas];
  }

  actualizarDatos({ nombres, apellidos, celular, correo }) {
    if (!Validaciones.nombre(nombres) || !Validaciones.nombre(apellidos)) {
      throw new Error('Nombres y apellidos deben tener al menos 2 letras.');
    }
    if (!Validaciones.celular(celular)) {
      throw new Error('El celular debe tener 10 dígitos y empezar por 3.');
    }
    if (!Validaciones.correo(correo)) {
      throw new Error('El correo electrónico no es válido.');
    }

    this.#nombres = nombres.trim();
    this.#apellidos = apellidos.trim();
    this.#celular = celular;
    this.#correo = correo;
  }

  agregarCuenta(cuenta) {
    if (!(cuenta instanceof Cuenta)) {
      throw new Error('Solo se pueden agregar productos bancarios.');
    }

    this.#cuentas.push(cuenta);
    return cuenta;
  }

  buscarCuenta(numero) {
    return this.#cuentas.find((cuenta) => cuenta.numero === numero) ?? null;
  }

  toJSON() {
    return {
      tipoDocumento: this.#tipoDocumento,
      numeroDocumento: this.#numeroDocumento,
      nombres: this.#nombres,
      apellidos: this.#apellidos,
      celular: this.#celular,
      correo: this.#correo,
      ...super.toJSON(),
      cuentas: this.#cuentas.map((cuenta) => cuenta.toJSON())
    };
  }
}