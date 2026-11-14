/* ============================================================
   HUELLITAS · sesion.js
   Manejo de sesión + mascotas por usuario + perdidas + adopciones + donaciones
   ============================================================ */

const KEY_USUARIO  = 'huellitas_usuario';
const KEY_SESION   = 'huellitas_sesion';
const KEY_MASCOTAS_LEGACY = 'huellitas_mascotas';
const KEY_PERDIDAS = 'huellitas_mascotas_perdidas';
const KEY_ADOPCIONES = 'huellitas_adopciones';
const KEY_DONACIONES = 'huellitas_donaciones';

/* ---------- HELPERS ---------- */
function estaLogueado() {
  return localStorage.getItem(KEY_SESION) === 'true';
}

function obtenerUsuario() {
  try {
    return JSON.parse(localStorage.getItem(KEY_USUARIO) || 'null');
  } catch (e) { return null; }
}

function guardarUsuario(usuario) {
  const anterior = obtenerUsuario();
  const correoAnterior = anterior && anterior.correo ? anterior.correo.toLowerCase() : null;
  const correoNuevo = usuario && usuario.correo ? usuario.correo.toLowerCase() : null;

  if (correoAnterior && correoNuevo && correoAnterior !== correoNuevo) {
    const claveVieja = `huellitas_mascotas_${correoAnterior}`;
    const claveNueva = `huellitas_mascotas_${correoNuevo}`;
    const mascotas = localStorage.getItem(claveVieja);
    if (mascotas) {
      localStorage.setItem(claveNueva, mascotas);
      localStorage.removeItem(claveVieja);
    }
  }

  localStorage.setItem(KEY_USUARIO, JSON.stringify(usuario));
}

function cerrarSesion(e) {
  if (e) e.preventDefault();
  if (!confirm('¿Cerrar sesión?')) return;
  localStorage.removeItem(KEY_SESION);
  window.location.href = 'index.html';
}

/* ---------- CLAVE ÚNICA DE MASCOTAS POR USUARIO ---------- */
function obtenerClaveMascotas() {
  const usuario = obtenerUsuario();
  if (usuario && usuario.correo) {
    return `huellitas_mascotas_${usuario.correo.toLowerCase()}`;
  }
  return KEY_MASCOTAS_LEGACY;
}

/* ---------- MASCOTAS DEL USUARIO ---------- */
function obtenerMascotas() {
  try {
    return JSON.parse(localStorage.getItem(obtenerClaveMascotas()) || '[]');
  } catch (e) { return []; }
}

function guardarMascotas(lista) {
  localStorage.setItem(obtenerClaveMascotas(), JSON.stringify(lista));
}

/* ---------- MASCOTAS PERDIDAS (GLOBAL) ---------- */
function obtenerMascotasPerdidas() {
  try {
    return JSON.parse(localStorage.getItem(KEY_PERDIDAS) || '[]');
  } catch (e) { return []; }
}

function guardarMascotasPerdidas(lista) {
  localStorage.setItem(KEY_PERDIDAS, JSON.stringify(lista));
}

/* ---------- MASCOTAS EN ADOPCIÓN (GLOBAL) ---------- */
function obtenerAdopciones() {
  try {
    return JSON.parse(localStorage.getItem(KEY_ADOPCIONES) || '[]');
  } catch (e) { return []; }
}

function guardarAdopciones(lista) {
  localStorage.setItem(KEY_ADOPCIONES, JSON.stringify(lista));
}

/* ---------- DONACIONES (GLOBAL) ---------- */
function obtenerDonaciones() {
  try {
    return JSON.parse(localStorage.getItem(KEY_DONACIONES) || '[]');
  } catch (e) { return []; }
}

function guardarDonaciones(lista) {
  localStorage.setItem(KEY_DONACIONES, JSON.stringify(lista));
}

/* ---------- COMPRIMIR IMAGEN ---------- */
function comprimirImagen(file, maxSize = 500, calidad = 0.8) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject('No es una imagen');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        if (width > height) {
          if (width > maxSize) { height = Math.round(height * maxSize / width); width = maxSize; }
        } else {
          if (height > maxSize) { width = Math.round(width * maxSize / height); height = maxSize; }
        }
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', calidad));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* ---------- ACTUALIZAR NAVBAR ---------- */
function actualizarNavbar() {
  const btnRegistrarse = document.getElementById('btnRegistrarse');
  const menuUsuario    = document.getElementById('menuUsuario');
  const nombreNavbar   = document.getElementById('nombreNavbar');
  const avatarNavbar   = document.getElementById('avatarNavbar');

  if (!btnRegistrarse || !menuUsuario) return;

  if (estaLogueado()) {
    const u = obtenerUsuario();
    const nombre = u && u.nombre ? u.nombre.split(' ')[0] : 'Usuario';

    btnRegistrarse.classList.add('d-none');
    menuUsuario.classList.remove('d-none');

    if (nombreNavbar) nombreNavbar.textContent = nombre;
    if (avatarNavbar) {
      if (u && u.foto) {
        avatarNavbar.src = u.foto;
        avatarNavbar.style.display = 'inline-block';
      } else {
        avatarNavbar.style.display = 'none';
      }
    }
  } else {
    btnRegistrarse.classList.remove('d-none');
    menuUsuario.classList.add('d-none');
  }
}

/* ---------- ACTUALIZAR ENLACES DE "REGISTRARSE" ---------- */
function actualizarEnlacesRegistro() {
  const logueado = estaLogueado();
  if (!logueado) return;

  document.querySelectorAll('a[href="registro.html"]').forEach(a => {
    if (a.closest('#menuUsuario') || a.closest('#btnRegistrarse')) return;

    if (!a.dataset.hrefOriginal) {
      a.dataset.hrefOriginal = 'registro.html';
    }

    const texto = (a.textContent || '').toLowerCase().trim();

    if (texto.includes('donaci')) {
      a.href = 'perfil.html#publicar-donacion';
      a.innerHTML = '<i class="bi bi-gift me-2"></i>Publicar desde mi perfil';
    } else if (texto.includes('adopci')) {
      a.href = 'perfil.html#publicar-adopcion';
      a.innerHTML = '<i class="bi bi-plus-circle me-2"></i>Publicar desde mi perfil';
    } else if (texto.includes('catálogo') || texto.includes('catalogo')) {
      a.href = '#productos';
      a.innerHTML = '<i class="bi bi-bag-heart me-2"></i>Ver productos';
    } else if (texto.includes('pedir ahora')) {
      a.href = '#productos';
      a.innerHTML = '<i class="bi bi-bag-heart me-2"></i>Ver productos';
    } else if (texto.includes('registrarme')) {
      a.href = 'perfil.html';
      a.innerHTML = '<i class="bi bi-person-circle me-2"></i>Ir a mi perfil';
    } else if (texto.includes('publicar')) {
      a.href = 'perfil.html#publicar-perdida';
      a.innerHTML = '<i class="bi bi-plus-circle me-2"></i>Publicar desde mi perfil';
    } else if (texto.includes('crear cuenta')) {
      a.href = '#productos';
      a.innerHTML = '<i class="bi bi-bag-heart me-2"></i>Ver productos';
    } else {
      a.href = '#productos';
    }
  });
}

/* ---------- AUTO-EJECUTAR AL CARGAR ---------- */
document.addEventListener('DOMContentLoaded', () => {
  actualizarNavbar();
  actualizarEnlacesRegistro();
});