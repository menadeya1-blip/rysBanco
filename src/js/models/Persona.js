/**
 * Clase base abstracta de las personas que inician sesión en el banco (clientes y administrador).
 *
 * Herencia: Cliente y Administrador son Persona y reutilizan usuario, contraseña y sus métodos.
 * Encapsulamiento: la contraseña es privada; solo se cambia con cambiarContrasena(), que valida.
 */
export class Persona {
  #usuario;
  #contrasena;

  constructor(usuario, contrasena) {
    if (new.target === Persona) {
      throw new Error('Persona es abstracta: use Cliente o Administrador.');
    }

    this.#usuario = usuario;
    this.#contrasena = contrasena;
  }

  get usuario() {
    return this.#usuario;
  }

  verificarContrasena(clave) {
    return this.#contrasena === clave;
  }

  cambiarContrasena(claveActual, claveNueva, confirmacion) {
    if (!this.verificarContrasena(claveActual)) {
      throw new Error('La clave actual no es correcta.');
    }
    if (claveNueva.length < 8) {
      throw new Error('La nueva clave debe tener mínimo 8 caracteres.');
    }
    if (claveNueva !== confirmacion) {
      throw new Error('La confirmación no coincide con la nueva clave.');
    }

    this.#contrasena = claveNueva;
  }

  toJSON() {
    return {
      usuario: this.#usuario,
      contrasena: this.#contrasena
    };
  }
}