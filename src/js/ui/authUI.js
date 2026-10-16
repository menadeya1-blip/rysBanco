import { Validaciones } from '../utils/validaciones.js';

/**
 * Mejoras visuales de los formularios de registro e inicio de sesión:
 * botón para ver la contraseña, medidor de fortaleza y avisos mientras se escribe.
 */
export class AuthUI {
  static iniciar() {
    this.agregarBotonesOjo();
    this.activarValidacionEnVivo();
    this.activarMedidor();
  }

  static agregarBotonesOjo() {
    document.querySelectorAll('input[type="password"]').forEach((campo) => {
      campo.classList.add('tiene-ojo');

      const boton = document.createElement('button');
      boton.type = 'button';
      boton.className = 'boton-ojo';
      boton.textContent = 'Ver';
      boton.setAttribute('aria-label', 'Mostrar contraseña');

      boton.addEventListener('click', () => {
        const mostrar = campo.type === 'password';
        campo.type = mostrar ? 'text' : 'password';
        boton.textContent = mostrar ? 'Ocultar' : 'Ver';
        boton.setAttribute('aria-label', mostrar ? 'Ocultar contraseña' : 'Mostrar contraseña');
      });

      campo.insertAdjacentElement('afterend', boton);
    });
  }

  static activarValidacionEnVivo() {
    document.querySelectorAll('[data-validar]').forEach((campo) => {
      campo.addEventListener('blur', () => {
        this.validarCampo(campo);
      });

      campo.addEventListener('input', () => {
        if (campo.classList.contains('campo-valido') || campo.classList.contains('campo-invalido')) {
          this.validarCampo(campo);
        }
      });
    });
  }

  static validarCampo(campo) {
    const tipo = campo.dataset.validar;
    const valor = campo.value;

    if (valor.trim() === '') {
      this.marcar(campo, false, 'Este campo es obligatorio.');
      return;
    }

    let valido = false;
    let mensaje = 'Revisa este campo.';

    switch (tipo) {
      case 'nombre':
        valido = Validaciones.nombre(valor);
        mensaje = 'Escribe al menos 2 letras.';
        break;

      case 'documento': {
        const tipoDocumento = document.getElementById('tipo-documento').value;
        valido = Validaciones.documento(tipoDocumento, valor);
        mensaje = 'Revisa el número según el tipo de documento.';
        break;
      }

      case 'correo':
        valido = Validaciones.correo(valor);
        mensaje = 'Escribe un correo válido, por ejemplo nombre@correo.com.';
        break;

      case 'celular':
        valido = Validaciones.celular(valor);
        mensaje = 'Escribe un celular de 10 dígitos que empiece por 3.';
        break;

      case 'confirmar': {
        const original = document.getElementById(campo.dataset.compara).value;
        valido = valor === original;
        mensaje = 'Las contraseñas no coinciden.';
        break;
      }

      default:
        return;
    }

    this.marcar(campo, valido, mensaje);
  }

  static marcar(campo, valido, mensaje) {
    campo.classList.toggle('campo-valido', valido);
    campo.classList.toggle('campo-invalido', !valido);

    const idAviso = `aviso-${campo.id}`;
    let aviso = document.getElementById(idAviso);

    if (!aviso) {
      aviso = document.createElement('p');
      aviso.id = idAviso;
      aviso.className = 'mensaje-campo';
      campo.parentElement.appendChild(aviso);
    }

    aviso.textContent = valido ? '✓ Correcto' : mensaje;
    aviso.classList.toggle('ok', valido);
    aviso.classList.toggle('error', !valido);
  }

  static activarMedidor() {
    const campo = document.querySelector('[data-medidor]');

    if (!campo) {
      return;
    }

    const contenedor = campo.parentElement;

    const medidor = document.createElement('div');
    medidor.className = 'medidor';

    const barra = document.createElement('div');
    barra.className = 'medidor-barra';
    medidor.appendChild(barra);

    const texto = document.createElement('p');
    texto.className = 'medidor-texto';

    contenedor.appendChild(medidor);
    contenedor.appendChild(texto);

    campo.addEventListener('input', () => {
      if (campo.value === '') {
        barra.style.width = '0%';
        texto.textContent = '';
        return;
      }

      const fortaleza = Validaciones.fortaleza(campo.value);
      barra.style.width = `${fortaleza.porcentaje}%`;
      barra.style.backgroundColor = fortaleza.color;
      texto.textContent = `Seguridad: ${fortaleza.texto}`;
    });
  }
}