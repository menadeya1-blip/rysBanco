/**
 * Reglas de validación de los formularios.
 * Se usan tanto para mostrar avisos mientras se escribe como al enviar el formulario.
 */

const REGLAS_DOCUMENTO = {
  CC: /^[0-9]{6,10}$/,
  CE: /^[0-9]{6,10}$/,
  PA: /^[A-Z0-9]{6,12}$/
};

export class Validaciones {
  static documento(tipo, numero) {
    const regla = REGLAS_DOCUMENTO[tipo];
    return regla !== undefined && regla.test(numero);
  }

  static correo(correo) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(correo);
  }

  static celular(celular) {
    return /^3[0-9]{9}$/.test(celular);
  }

  static nombre(texto) {
    return texto.trim().length >= 2;
  }

  static fortaleza(contrasena) {
    let puntos = 0;

    if (contrasena.length >= 8) {
      puntos++;
    }
    if (/[A-Z]/.test(contrasena) && /[a-z]/.test(contrasena)) {
      puntos++;
    }
    if (/[0-9]/.test(contrasena)) {
      puntos++;
    }
    if (/[^A-Za-z0-9]/.test(contrasena)) {
      puntos++;
    }
    if (contrasena.length >= 12) {
      puntos++;
    }

    if (puntos <= 1) {
      return { texto: 'Débil', porcentaje: 25, color: '#C62828' };
    }
    if (puntos <= 3) {
      return { texto: 'Media', porcentaje: 60, color: '#F9A825' };
    }
    return { texto: 'Fuerte', porcentaje: 100, color: '#2E7D32' };
  }
}