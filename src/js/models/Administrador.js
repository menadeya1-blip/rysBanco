import { Persona } from './Persona.js';

/**
 * Administrador del banco: es una Persona que gestiona usuarios.
 * No tiene cuentas bancarias, por eso no hereda de Cliente ni de Cuenta.
 */
export class Administrador extends Persona {
  constructor(usuario, contrasena) {
    super(usuario, contrasena);
  }
}