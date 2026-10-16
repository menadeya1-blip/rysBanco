/**
 * Acceso al almacenamiento del navegador (localStorage).
 * Puede fallar en modo privado o con datos bloqueados, por eso cada operación usa try/catch.
 */
export class Almacenamiento {
  static leer(clave) {
    try {
      return localStorage.getItem(clave);
    } catch (error) {
      return null;
    }
  }

  static guardar(clave, valor) {
    try {
      localStorage.setItem(clave, valor);
    } catch (error) {
      // Sin acción: el navegador no permite guardar
    }
  }

  static borrar(clave) {
    try {
      localStorage.removeItem(clave);
    } catch (error) {
      // Sin acción: el navegador no permite borrar
    }
  }

  static leerJSON(clave) {
    try {
      return JSON.parse(this.leer(clave));
    } catch (error) {
      return null;
    }
  }

  static guardarJSON(clave, objeto) {
    this.guardar(clave, JSON.stringify(objeto));
  }
}