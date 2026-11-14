/* ============================================================
   HUELLITAS · script.js
   ============================================================ */

/* ---------- Normaliza texto (quita tildes, mayúsculas) ---------- */
function normalizar(texto) {
  return (texto || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/* ---------- CARRITO ---------- */
let carrito = [];

function agregarAlCarrito(nombre, precio) {
  const existente = carrito.find(p => p.nombre === nombre);
  if (existente) existente.cantidad++;
  else carrito.push({ nombre, precio, cantidad: 1 });

  actualizarCarrito();
  mostrarToast(`${nombre} añadido al carrito`);
}

/* ---------- TOAST DE NOTIFICACIÓN ---------- */
function mostrarToast(mensaje) {
  let contenedor = document.getElementById('toastContainer');
  if (!contenedor) {
    contenedor = document.createElement('div');
    contenedor.id = 'toastContainer';
    contenedor.style.cssText = `
      position: fixed; bottom: 90px; right: 22px; z-index: 1050;
      display: flex; flex-direction: column; gap: 8px; pointer-events: none;
    `;
    document.body.appendChild(contenedor);
  }

  const toast = document.createElement('div');
  toast.className = 'huellitas-toast';
  toast.innerHTML = `<i class="bi bi-check-circle-fill me-2"></i><span>${mensaje}</span>`;
  contenedor.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('visible'));
  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

function actualizarCarrito() {
  const lista = document.getElementById('carritoLista');
  const vacio = document.getElementById('carritoVacio');
  const footer = document.getElementById('carritoFooter');
  const contador = document.getElementById('carritoContador');
  const totalEl = document.getElementById('carritoTotal');
  if (!lista) return;

  const totalItems = carrito.reduce((a, p) => a + p.cantidad, 0);
  const totalPrecio = carrito.reduce((a, p) => a + p.precio * p.cantidad, 0);

  if (totalItems > 0) {
    contador.textContent = totalItems;
    contador.classList.remove('d-none');
  } else {
    contador.classList.add('d-none');
  }

  if (carrito.length === 0) {
    lista.innerHTML = '';
    vacio.classList.remove('d-none');
    footer.classList.add('d-none');
    return;
  }
  vacio.classList.add('d-none');
  footer.classList.remove('d-none');

  lista.innerHTML = carrito.map((p, i) => `
    <li class="carrito-item">
      <div class="carrito-item-info">
        <div class="carrito-item-nombre">${p.nombre}</div>
        <div class="carrito-item-precio">$${p.precio.toLocaleString('es-CO')}</div>
      </div>
      <div class="carrito-qty">
        <button type="button" onclick="cambiarCantidad(${i}, -1)" aria-label="Quitar uno"><i class="bi bi-dash"></i></button>
        <span>${p.cantidad}</span>
        <button type="button" onclick="cambiarCantidad(${i}, 1)" aria-label="Agregar uno"><i class="bi bi-plus"></i></button>
      </div>
    </li>
  `).join('');

  totalEl.textContent = '$' + totalPrecio.toLocaleString('es-CO');
}

function cambiarCantidad(index, delta) {
  carrito[index].cantidad += delta;
  if (carrito[index].cantidad <= 0) carrito.splice(index, 1);
  actualizarCarrito();
}

/* ---------- CHECKOUT: ABRIR MODAL DE PAGO ---------- */
function checkout() {
  if (carrito.length === 0) return;
  const total = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
  const totalFormateado = '$' + total.toLocaleString('es-CO');

  const modalHTML = `
    <div class="modal fade" id="modalPago" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content rounded-4 border-0">
          <div class="modal-header border-0">
            <h5 class="modal-title fw-bold"><i class="bi bi-credit-card-2-front-fill text-brand me-2"></i>Finalizar compra</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
          </div>
          <div class="modal-body">
            <div id="paso1-pago">
              <h6 class="fw-bold mb-3">Selecciona tu método de pago</h6>
              <div class="row g-3">
                <div class="col-md-6"><div class="card-soft p-3 h-100 opcion-pago" onclick="seleccionarMetodo('tarjeta')" style="cursor:pointer;"><div class="d-flex align-items-center gap-3"><div class="icon-circle" style="width:48px;height:48px;font-size:1.2rem;"><i class="bi bi-credit-card"></i></div><div><div class="fw-bold">Tarjeta débito/crédito</div><div class="text-secondary small">Visa, Mastercard, Amex</div></div></div></div></div>
                <div class="col-md-6"><div class="card-soft p-3 h-100 opcion-pago" onclick="seleccionarMetodo('pse')" style="cursor:pointer;"><div class="d-flex align-items-center gap-3"><div class="icon-circle" style="width:48px;height:48px;font-size:1.2rem;"><i class="bi bi-bank"></i></div><div><div class="fw-bold">PSE</div><div class="text-secondary small">Débito desde tu banco</div></div></div></div></div>
                <div class="col-md-6"><div class="card-soft p-3 h-100 opcion-pago" onclick="seleccionarMetodo('nequi')" style="cursor:pointer;"><div class="d-flex align-items-center gap-3"><div class="icon-circle" style="width:48px;height:48px;font-size:1.2rem;"><i class="bi bi-phone"></i></div><div><div class="fw-bold">Nequi</div><div class="text-secondary small">Pago con tu celular</div></div></div></div></div>
                <div class="col-md-6"><div class="card-soft p-3 h-100 opcion-pago" onclick="seleccionarMetodo('contraentrega')" style="cursor:pointer;"><div class="d-flex align-items-center gap-3"><div class="icon-circle" style="width:48px;height:48px;font-size:1.2rem;"><i class="bi bi-cash-coin"></i></div><div><div class="fw-bold">Contraentrega</div><div class="text-secondary small">Paga al recibir</div></div></div></div></div>
              </div>
            </div>
            <div id="paso2-pago" class="d-none">
              <button class="btn btn-link text-brand p-0 mb-3" onclick="volverPaso1()"><i class="bi bi-arrow-left me-1"></i> Volver a métodos de pago</button>
              <h6 class="fw-bold mb-3" id="tituloPaso2">Completa tus datos</h6>
              <div id="formularioPago"></div>
            </div>
          </div>
          <div class="modal-footer border-0 justify-content-between">
            <div><span class="text-secondary small">Total a pagar:</span><span class="fw-bold text-brand fs-4 ms-2">${totalFormateado}</span></div>
            <div id="botonPagarContainer"></div>
          </div>
        </div>
      </div>
    </div>
  `;

  const existente = document.getElementById('modalPago');
  if (existente) existente.remove();
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  new bootstrap.Modal(document.getElementById('modalPago')).show();
}

function seleccionarMetodo(metodo) {
  document.getElementById('paso1-pago').classList.add('d-none');
  document.getElementById('paso2-pago').classList.remove('d-none');
  const titulo = document.getElementById('tituloPaso2');
  const contenedorForm = document.getElementById('formularioPago');
  const botonPagar = document.getElementById('botonPagarContainer');
  contenedorForm.innerHTML = '';
  botonPagar.innerHTML = '';

  if (metodo === 'tarjeta') {
    titulo.textContent = 'Datos de tu tarjeta';
    contenedorForm.innerHTML = `
      <div class="mb-3"><label class="form-label small fw-semibold">Número de tarjeta</label><input type="text" class="form-control rounded-3" placeholder="0000 0000 0000 0000" maxlength="19"></div>
      <div class="row g-2">
        <div class="col-6"><label class="form-label small fw-semibold">Expiración</label><input type="text" class="form-control rounded-3" placeholder="MM/AA" maxlength="5"></div>
        <div class="col-6"><label class="form-label small fw-semibold">CVV</label><input type="text" class="form-control rounded-3" placeholder="123" maxlength="4"></div>
      </div>
      <div class="mt-3"><label class="form-label small fw-semibold">Titular</label><input type="text" class="form-control rounded-3" placeholder="Como aparece en la tarjeta"></div>
    `;
    botonPagar.innerHTML = `<button class="btn btn-brand btn-lg rounded-pill px-5" onclick="procesarPago('tarjeta')"><i class="bi bi-lock-fill me-2"></i>Pagar ahora</button>`;
  } else if (metodo === 'pse') {
    titulo.textContent = 'Pago con PSE';
    contenedorForm.innerHTML = `
      <div class="mb-3"><label class="form-label small fw-semibold">Banco</label><select class="form-select rounded-3"><option value="" selected disabled>Selecciona</option><option>Bancolombia</option><option>Banco de Bogotá</option><option>Davivienda</option><option>BBVA</option><option>Nequi</option><option>Daviplata</option></select></div>
      <div class="mb-3"><label class="form-label small fw-semibold">Cédula</label><input type="text" class="form-control rounded-3" placeholder="Número de documento"></div>
      <div class="alert alert-info rounded-3 small"><i class="bi bi-info-circle me-1"></i>Serás redirigido a tu banco.</div>
    `;
    botonPagar.innerHTML = `<button class="btn btn-brand btn-lg rounded-pill px-5" onclick="procesarPago('pse')"><i class="bi bi-box-arrow-up-right me-2"></i>Ir a pagar</button>`;
  } else if (metodo === 'nequi') {
    titulo.textContent = 'Pago con Nequi';
    contenedorForm.innerHTML = `
      <div class="mb-3"><label class="form-label small fw-semibold">Número de celular</label><input type="tel" class="form-control rounded-3" placeholder="300 000 0000"></div>
      <div class="alert alert-info rounded-3 small"><i class="bi bi-info-circle me-1"></i>Recibirás una notificación en tu app Nequi.</div>
    `;
    botonPagar.innerHTML = `<button class="btn btn-brand btn-lg rounded-pill px-5" onclick="procesarPago('nequi')"><i class="bi bi-send me-2"></i>Enviar solicitud</button>`;
  } else if (metodo === 'contraentrega') {
    titulo.textContent = 'Pago Contraentrega';
    contenedorForm.innerHTML = `
      <div class="alert alert-warning rounded-3"><i class="bi bi-exclamation-triangle-fill me-2"></i><strong>Importante:</strong> El pago se realiza al momento de la entrega.</div>
      <div class="mb-3"><label class="form-label small fw-semibold">Dirección de entrega</label><input type="text" class="form-control rounded-3" placeholder="Calle 123 #45-67"></div>
      <div class="mb-3"><label class="form-label small fw-semibold">Ciudad</label><select class="form-select rounded-3"><option value="" selected disabled>Selecciona</option><option>Bogotá</option><option>Medellín</option><option>Cali</option></select></div>
      <div class="mb-3"><label class="form-label small fw-semibold">Teléfono</label><input type="tel" class="form-control rounded-3" placeholder="300 000 0000"></div>
    `;
    botonPagar.innerHTML = `<button class="btn btn-brand btn-lg rounded-pill px-5" onclick="procesarPago('contraentrega')"><i class="bi bi-check-circle me-2"></i>Confirmar pedido</button>`;
  }
}

function volverPaso1() {
  document.getElementById('paso2-pago').classList.add('d-none');
  document.getElementById('paso1-pago').classList.remove('d-none');
}

function procesarPago(metodo) {
  const total = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
  const btn = document.querySelector('#botonPagarContainer button');
  btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Procesando...';
  btn.disabled = true;

  setTimeout(() => {
    const modalPago = bootstrap.Modal.getInstance(document.getElementById('modalPago'));
    modalPago.hide();
    setTimeout(() => {
      alert(`✅ ¡Pago simulado con éxito!\n\nMétodo: ${metodo.charAt(0).toUpperCase() + metodo.slice(1)}\nTotal: $${total.toLocaleString('es-CO')}\n\nEste es un mensaje de prueba.`);
      carrito = [];
      actualizarCarrito();
      const offcanvasCarrito = bootstrap.Offcanvas.getInstance(document.getElementById('carritoOffcanvas'));
      if (offcanvasCarrito) offcanvasCarrito.hide();
    }, 300);
  }, 1500);
}

/* ---------- FILTROS MASCOTAS PERDIDAS ---------- */
function filtrarMascotas(tipo, btn) {
  document.querySelectorAll('.btn-filtro[data-filtro]').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.mascota-item').forEach(item => {
    const coincide = tipo === 'todos' || item.dataset.tipo === tipo;
    item.style.display = coincide ? '' : 'none';
  });
}

/* ---------- FILTROS ADOPCIONES ---------- */
function filtrarAdopciones(tipo, btn) {
  document.querySelectorAll('[data-filtro-adopcion]').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.adopcion-item').forEach(item => {
    const coincide = tipo === 'todos' || item.dataset.tipo === tipo;
    item.style.display = coincide ? '' : 'none';
  });
}

/* ---------- FILTROS DONACIONES ---------- */
function filtrarDonaciones(tipo, btn) {
  document.querySelectorAll('[data-filtro-donacion]').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.donacion-item').forEach(item => {
    const coincide = tipo === 'todos' || item.dataset.modalidad === tipo;
    item.style.display = coincide ? '' : 'none';
  });
}

/* ---------- FILTROS PRODUCTOS ---------- */
function filtrarProductos(categoria, btn) {
  document.querySelectorAll('.btn-filtro-producto').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const inputBusqueda = document.getElementById('inputBusqueda');
  if (inputBusqueda) inputBusqueda.value = '';
  const aviso = document.getElementById('sinResultados');
  if (aviso) aviso.remove();
  
  document.querySelectorAll('.producto-item').forEach(item => {
    const coincide = categoria === 'todos' || item.dataset.categoria === categoria;
    item.style.display = coincide ? '' : 'none';
  });

  // Auto-abrir el catálogo completo si se elige una categoría diferente a "todos"
  const collapseEl = document.getElementById('catalogoCompleto');
  if (collapseEl) {
    const bsCollapse = bootstrap.Collapse.getInstance(collapseEl) || new bootstrap.Collapse(collapseEl, { toggle: false });
    if (categoria !== 'todos') {
      bsCollapse.show();
    } else {
      bsCollapse.hide();
    }
  }
}

/* ---------- BÚSQUEDA ---------- */
function buscarProducto(e) {
  e.preventDefault();
  const q = normalizar(document.getElementById('inputBusqueda').value);
  if (!q) return;

  document.querySelectorAll('.btn-filtro-producto').forEach(b => b.classList.remove('active'));
  const btnTodos = document.querySelector('.btn-filtro-producto[data-categoria="todos"]');
  if (btnTodos) btnTodos.classList.add('active');

  let encontrados = 0;
  document.querySelectorAll('.producto-item').forEach(item => {
    const nombre = normalizar(item.dataset.nombre || '');
    const coincide = nombre.includes(q);
    item.style.display = coincide ? '' : 'none';
    if (coincide) encontrados++;
  });

  let aviso = document.getElementById('sinResultados');
  if (aviso) aviso.remove();

  // Auto-abrir el catálogo completo si hay resultados
  const collapseEl = document.getElementById('catalogoCompleto');
  if (collapseEl && encontrados > 0) {
    const bsCollapse = bootstrap.Collapse.getInstance(collapseEl) || new bootstrap.Collapse(collapseEl, { toggle: false });
    bsCollapse.show();
  }

  document.getElementById('productos').scrollIntoView({ behavior: 'smooth' });

  if (encontrados === 0) {
    const div = document.createElement('div');
    div.id = 'sinResultados';
    div.className = 'alert alert-warning text-center rounded-3 mt-4 mx-auto';
    div.style.maxWidth = '600px';
    div.innerHTML = `<i class="bi bi-search me-2"></i>No encontramos productos para "<strong>${q}</strong>". <a href="#" class="text-brand fw-semibold ms-2" onclick="limpiarBusqueda(event)">Ver todos</a>`;
    document.getElementById('gridProductos').after(div);
  }

  const buscador = document.getElementById('buscadorTop');
  const bsCollapse = bootstrap.Collapse.getInstance(buscador);
  if (bsCollapse) bsCollapse.hide();
}

function limpiarBusqueda(e) {
  e.preventDefault();
  document.querySelectorAll('.producto-item').forEach(i => i.style.display = '');
  document.getElementById('inputBusqueda').value = '';
  const aviso = document.getElementById('sinResultados');
  if (aviso) aviso.remove();
  const btnTodos = document.querySelector('.btn-filtro-producto[data-categoria="todos"]');
  if (btnTodos) {
    document.querySelectorAll('.btn-filtro-producto').forEach(b => b.classList.remove('active'));
    btnTodos.classList.add('active');
  }
  
  const collapseEl = document.getElementById('catalogoCompleto');
  if (collapseEl) {
    const bsCollapse = bootstrap.Collapse.getInstance(collapseEl);
    if (bsCollapse) bsCollapse.hide();
  }
}

/* ---------- RENDERIZAR MASCOTAS PERDIDAS EN EL INDEX ---------- */
function renderizarMascotasPerdidasIndex() {
  const grid = document.getElementById('gridMascotas');
  if (!grid) return;

  const todas = obtenerMascotasPerdidas();

  if (todas.length === 0) {
    grid.innerHTML = `
      <div class="col-12 text-center py-5">
        <div class="icon-circle mx-auto mb-3"><i class="bi bi-search-heart"></i></div>
        <p class="text-secondary mb-0">Aún no hay mascotas perdidas publicadas. ¡Sé el primero en publicar!</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = todas.map(p => {
    const fecha = new Date(p.fechaPerdida + 'T00:00:00');
    const diasPerdido = Math.floor((Date.now() - fecha.getTime()) / (1000 * 60 * 60 * 24));
    let tiempoTexto = diasPerdido <= 0 ? 'hoy' : diasPerdido === 1 ? 'ayer' : `hace ${diasPerdido} días`;

    const tipoLower = (p.tipo || '').toLowerCase();
    const sexoIcon = p.sexo === 'Hembra' ? 'bi-gender-female' : 'bi-gender-male';
    const foto = p.foto || 'https://placehold.co/400x300/e85535/ffffff?text=' + encodeURIComponent(p.nombre);
    const telLimpio = (p.telefono || '').replace(/\D/g, '');

    return `
      <div class="col-md-6 col-lg-4 mascota-item" data-tipo="${tipoLower}">
        <div class="card-soft h-100 p-4 d-flex flex-column">
          <div class="lost-img mb-3">
            <img src="${foto}" alt="${p.nombre}" onerror="this.src='https://placehold.co/400x300/e85535/ffffff?text=${encodeURIComponent(p.nombre)}'">
            <span class="lost-badge bg-danger text-white rounded-pill">PERDIDO</span>
          </div>
          <div class="d-flex align-items-center gap-3 mb-3">
            <div class="lost-icon"><i class="bi ${sexoIcon}"></i></div>
            <h3 class="h5 fw-bold mb-0">${p.nombre}</h3>
          </div>
          <ul class="list-unstyled small text-secondary mb-3">
            <li class="mb-1"><i class="bi bi-tag-fill text-brand me-2"></i>${p.tipo}${p.raza ? ' ' + p.raza : ''}${p.sexo ? ' · ' + p.sexo : ''}${p.edad ? ' · ' + p.edad : ''}</li>
            <li class="mb-1"><i class="bi bi-geo-alt-fill text-brand me-2"></i>${p.lugar}</li>
            <li class="mb-1"><i class="bi bi-calendar-event text-brand me-2"></i>Perdido ${tiempoTexto}</li>
            <li class="mb-1"><i class="bi bi-telephone-fill text-brand me-2"></i>${p.telefono}</li>
          </ul>
          ${p.descripcion ? `<p class="text-secondary small fst-italic mb-3">"${p.descripcion}"</p>` : ''}
          <a href="https://wa.me/${telLimpio}?text=Hola,%20tengo%20informaci%C3%B3n%20sobre%20${encodeURIComponent(p.nombre)}"
             target="_blank" rel="noopener" class="btn btn-outline-brand rounded-pill mt-auto">
            <i class="bi bi-whatsapp me-2"></i>Tengo información
          </a>
        </div>
      </div>
    `;
  }).join('');
}

/* ---------- RENDERIZAR ADOPCIONES EN EL INDEX ---------- */
function renderizarAdopcionesIndex() {
  const grid = document.getElementById('gridAdopciones');
  if (!grid) return;

  grid.querySelectorAll('.adopcion-item:not([data-demo])').forEach(el => el.remove());

  const todas = obtenerAdopciones();
  if (todas.length === 0) return;

  const html = todas.map(a => {
    const tipoLower = (a.tipo || '').toLowerCase();
    const sexoIcon = a.sexo === 'Hembra' ? 'bi-gender-female'
                   : a.sexo === 'Macho'  ? 'bi-gender-male'
                   : 'bi-question';
    const foto = a.foto || 'https://placehold.co/400x300/25a35a/ffffff?text=' + encodeURIComponent(a.nombre);
    const telLimpio = (a.telefono || '').replace(/\D/g, '');

    return `
      <div class="col-md-6 col-lg-4 adopcion-item" data-tipo="${tipoLower}">
        <div class="card-soft h-100 p-4 d-flex flex-column">
          <div class="adopcion-img mb-3">
            <img src="${foto}" alt="${a.nombre}"
                 onerror="this.src='https://placehold.co/400x300/25a35a/ffffff?text=${encodeURIComponent(a.nombre)}'">
            <span class="adopcion-badge bg-success text-white rounded-pill">EN ADOPCIÓN</span>
          </div>
          <div class="d-flex align-items-center gap-3 mb-3">
            <div class="lost-icon"><i class="bi ${sexoIcon}"></i></div>
            <h3 class="h5 fw-bold mb-0">${a.nombre}</h3>
          </div>
          <ul class="list-unstyled small text-secondary mb-3">
            <li class="mb-1"><i class="bi bi-tag-fill text-brand me-2"></i>${a.tipo}${a.raza ? ' ' + a.raza : ''}${a.sexo ? ' · ' + a.sexo : ''}${a.edad ? ' · ' + a.edad : ''}</li>
            <li class="mb-1"><i class="bi bi-geo-alt-fill text-brand me-2"></i>${a.ciudad}</li>
            ${a.esterilizado ? `<li class="mb-1"><i class="bi bi-heart-pulse text-brand me-2"></i>Esterilizado: ${a.esterilizado}</li>` : ''}
            ${a.vacunas ? `<li class="mb-1"><i class="bi bi-shield-check text-brand me-2"></i>Vacunas: ${a.vacunas}</li>` : ''}
            <li class="mb-1"><i class="bi bi-telephone-fill text-brand me-2"></i>${a.telefono}</li>
          </ul>
          ${a.descripcion ? `<p class="text-secondary small fst-italic mb-3">"${a.descripcion}"</p>` : ''}
          <a href="https://wa.me/${telLimpio}?text=Hola,%20me%20interesa%20adoptar%20a%20${encodeURIComponent(a.nombre)}"
             target="_blank" rel="noopener" class="btn btn-brand rounded-pill mt-auto">
            <i class="bi bi-whatsapp me-2"></i>Quiero adoptarlo
          </a>
        </div>
      </div>
    `;
  }).join('');

  grid.insertAdjacentHTML('beforeend', html);
}

/* ---------- RENDERIZAR DONACIONES EN EL INDEX ---------- */
function renderizarDonacionesIndex() {
  const grid = document.getElementById('gridDonaciones');
  if (!grid) return;

  const todas = obtenerDonaciones();

  if (todas.length === 0) {
    grid.innerHTML = `
      <div class="col-12 text-center py-5">
        <div class="icon-circle mx-auto mb-3"><i class="bi bi-gift"></i></div>
        <p class="text-secondary mb-0">Aún no hay donaciones publicadas. ¡Sé el primero en ayudar!</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = todas.map(d => {
    const modalidad = d.modalidad || 'ofrezco';
    const esOfrece = modalidad === 'ofrezco';
    const badgeClase = esOfrece ? 'bg-success' : 'bg-warning text-dark';
    const badgeTexto = esOfrece ? 'OFRECE' : 'NECESITA';
    const iconoModalidad = esOfrece ? 'bi-gift-fill' : 'bi-hand-thumbs-up-fill';
    const foto = d.foto || 'https://placehold.co/400x300/ff6b4a/ffffff?text=' + encodeURIComponent(d.titulo || 'Donación');
    const telLimpio = (d.telefono || '').replace(/\D/g, '');
    
    return `
      <div class="col-md-6 col-lg-4 donacion-item" data-modalidad="${modalidad}">
        <div class="card-soft h-100 p-4 d-flex flex-column">
          <div class="lost-img mb-3">
            <img src="${foto}" alt="${d.titulo}"
                 onerror="this.src='https://placehold.co/400x300/ff6b4a/ffffff?text=Donaci%C3%B3n'">
            <span class="lost-badge ${badgeClase} rounded-pill">
              <i class="bi ${iconoModalidad} me-1"></i>${badgeTexto}
            </span>
          </div>
          <div class="d-flex align-items-center gap-3 mb-2">
            <div class="lost-icon"><i class="bi bi-gift"></i></div>
            <h3 class="h5 fw-bold mb-0">${d.titulo}</h3>
          </div>
          <span class="badge badge-soft rounded-pill align-self-start mb-2">${d.tipoDonacion}</span>
          <ul class="list-unstyled small text-secondary mb-3">
            ${d.beneficiario ? `<li class="mb-1"><i class="bi bi-person-heart text-brand me-2"></i>Para: ${d.beneficiario}</li>` : ''}
            <li class="mb-1"><i class="bi bi-geo-alt-fill text-brand me-2"></i>${d.ciudad}</li>
            <li class="mb-1"><i class="bi bi-telephone-fill text-brand me-2"></i>${d.telefono}</li>
          </ul>
          ${d.descripcion ? `<p class="text-secondary small fst-italic mb-3">"${d.descripcion}"</p>` : ''}
          <a href="https://wa.me/${telLimpio}?text=Hola,%20vi%20tu%20publicaci%C3%B3n%20de%20donaci%C3%B3n%20${encodeURIComponent(d.titulo)}%20en%20Huellitas"
             target="_blank" rel="noopener" class="btn btn-outline-brand rounded-pill mt-auto">
            <i class="bi bi-whatsapp me-2"></i>Contactar
          </a>
        </div>
      </div>
    `;
  }).join('');
}

/* ---------- VALIDACIÓN FORM CONTACTO ---------- */
const formContacto = document.getElementById('formContacto');
if (formContacto) {
  formContacto.addEventListener('submit', function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (formContacto.checkValidity()) {
      document.getElementById('formExito').classList.remove('d-none');
      formContacto.reset();
      formContacto.classList.remove('was-validated');
      setTimeout(() => document.getElementById('formExito').classList.add('d-none'), 6000);
    } else {
      formContacto.classList.add('was-validated');
    }
  });
}

/* ---------- INICIALIZAR ---------- */
document.addEventListener('DOMContentLoaded', () => {
  actualizarCarrito();
  renderizarMascotasPerdidasIndex();
  renderizarAdopcionesIndex();
  renderizarDonacionesIndex();

  // Cambiar el texto del botón "Ver catálogo completo" al abrir/cerrar
  const collapseEl = document.getElementById('catalogoCompleto');
  if (collapseEl) {
    collapseEl.addEventListener('show.bs.collapse', function () {
      const btn = document.getElementById('btnVerCatalogo');
      if (btn) btn.innerHTML = 'Ocultar catálogo <i class="bi bi-arrow-up ms-2"></i>';
    });
    collapseEl.addEventListener('hide.bs.collapse', function () {
      const btn = document.getElementById('btnVerCatalogo');
      if (btn) btn.innerHTML = 'Ver catálogo completo <i class="bi bi-arrow-down ms-2"></i>';
    });
  }
});