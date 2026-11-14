

document.getElementById('formulario').addEventListener('submit', function (e) {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    let   peso   = parseFloat(document.getElementById('peso').value);
    let   altura = parseFloat(document.getElementById('altura').value);

    if (!nombre || isNaN(peso) || isNaN(altura)) {
        alert('Por favor complete todos los campos correctamente.');
        return;
    }

    if (altura > 3) altura = altura / 100;

    if (peso <= 0 || altura <= 0 || altura > 2.5) {
        alert('Verifique los valores. Peso > 0 y altura realista (menor a 2.5 m).');
        return;
    }

    const imc = peso / (altura * altura);
    const clasificacion = clasificar(imc);
    const claseColor    = colorClase(imc);
    const recomendacion = obtenerRecomendacion(imc);

    document.getElementById('res-nombre').textContent = nombre;
    document.getElementById('res-peso').textContent   = peso.toFixed(2) + ' kg';
    document.getElementById('res-altura').textContent = altura.toFixed(2) + ' m';
    document.getElementById('res-imc').textContent    = imc.toFixed(2) + ' kg/m²';

    const divClas = document.getElementById('res-clasificacion');
    divClas.textContent = clasificacion;
    divClas.className = 'clasificacion ' + claseColor;

    document.getElementById('res-recomendacion').innerHTML = recomendacion;

    // ===== Posicionar el marcador en el gráfico =====
    const posicion = calcularPosicionEscala(imc);
    document.getElementById('marcador-imc').style.left = posicion + '%';
    document.getElementById('valor-pin').textContent = imc.toFixed(1);

    document.getElementById('vista-formulario').style.display = 'none';
    document.getElementById('vista-resultado').style.display  = 'block';
    window.scrollTo(0, 0);
});

document.getElementById('btn-volver').addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('vista-formulario').style.display = 'block';
    document.getElementById('vista-resultado').style.display  = 'none';
    document.getElementById('formulario').reset();
    window.scrollTo(0, 0);
});

// ===== Clasificación =====
function clasificar(imc) {
    if (imc < 18.5)      return 'Bajo peso';
    else if (imc < 25)   return 'Normopeso';
    else if (imc < 27)   return 'Sobrepeso grado I';
    else if (imc < 30)   return 'Sobrepeso grado II';
    else if (imc < 35)   return 'Obesidad de tipo I';
    else if (imc < 40)   return 'Obesidad de tipo II';
    else if (imc < 50)   return 'Obesidad de tipo III (mórbida)';
    else                 return 'Obesidad de tipo IV (extrema)';
}

function colorClase(imc) {
    if (imc < 18.5)      return 'bajo-peso';
    else if (imc < 25)   return 'normopeso';
    else if (imc < 27)   return 'sobrepeso-1';
    else if (imc < 30)   return 'sobrepeso-2';
    else if (imc < 35)   return 'obesidad-1';
    else if (imc < 40)   return 'obesidad-2';
    else if (imc < 50)   return 'obesidad-3';
    else                 return 'obesidad-4';
}

// ===== Calcula la posición del marcador en la escala (0-100%) =====
function calcularPosicionEscala(imc) {
    const MIN = 10;
    const MAX = 55;
    const valor = Math.max(MIN, Math.min(MAX, imc));
    return ((valor - MIN) / (MAX - MIN)) * 100;
}

// ===== Recomendaciones detalladas =====
function obtenerRecomendacion(imc) {

    if (imc < 18.5) {
        return `
            <div class="titulo-recom">Plan de mejora — Recuperar peso saludable</div>

            <h4>Alimentos recomendados</h4>
            <ul>
                <li>Frutos secos: almendras, nueces, maní, avellanas</li>
                <li>Aguacate y aceite de oliva (grasas saludables)</li>
                <li>Lácteos enteros: leche, yogur griego, quesos</li>
                <li>Proteínas: huevos, pollo, carne magra, pescado azul (salmón, atún)</li>
                <li>Carbohidratos complejos: avena, arroz integral, plátano, papa</li>
                <li>Legumbres: lentejas, garbanzos, fríjoles</li>
                <li>Batidos caseros con fruta + leche + avena</li>
            </ul>

            <h4>Ejercicios sugeridos</h4>
            <ul>
                <li>Entrenamiento de fuerza 3 veces por semana (pesas ligeras, sentadillas, flexiones)</li>
                <li>Yoga o pilates para tonificar sin gastar demasiadas calorías</li>
                <li>Caminatas suaves de 20-30 minutos</li>
                <li>Evitar cardio excesivo que aumente el gasto calórico</li>
            </ul>

            <h4>Hábitos</h4>
            <ul>
                <li>Realizar 5-6 comidas al día en porciones pequeñas</li>
                <li>No saltarse el desayuno</li>
                <li>Consumir snacks entre comidas (frutos secos, yogur, fruta)</li>
                <li>Dormir al menos 7-8 horas</li>
            </ul>

            <div class="nota-importante">
                ⚠️ Consulte a un nutricionista para descartar causas metabólicas (tiroides, anemia, celiaquía).
            </div>
        `;
    }

    else if (imc < 25) {
        return `
            <div class="titulo-recom">¡Excelente! Mantener peso saludable</div>

            <h4>Alimentos recomendados</h4>
            <ul>
                <li>Frutas y verduras variadas (5 porciones al día)</li>
                <li>Cereales integrales: arroz, avena, quinoa, trigo</li>
                <li>Proteínas magras: pollo sin piel, pescado, huevo, tofu</li>
                <li>Grasas saludables: aceite de oliva, frutos secos, aguacate</li>
                <li>Lácteos bajos en grasa</li>
                <li>2 litros de agua al día</li>
            </ul>

            <h4>Ejercicios sugeridos</h4>
            <ul>
                <li>150 minutos de actividad aeróbica semanal (caminar, correr, nadar, bicicleta)</li>
                <li>Entrenamiento de fuerza 2 veces por semana</li>
                <li>Deportes recreativos: fútbol, baloncesto, tenis</li>
                <li>Subir escaleras en vez de usar el ascensor</li>
            </ul>

            <h4>Hábitos</h4>
            <ul>
                <li>Mantener horarios regulares de comida</li>
                <li>Evitar el sedentarismo prolongado</li>
                <li>Controlar el IMC cada 6 meses</li>
            </ul>

            <div class="nota-importante">
                ¡Felicidades! Su peso está en el rango ideal. Mantenga estos hábitos para conservar la salud.
            </div>
        `;
    }

    else if (imc < 27) {
        return `
            <div class="titulo-recom">Plan de mejora — Sobrepeso grado I</div>

            <h4>Alimentos a reducir</h4>
            <ul>
                <li>Bebidas azucaradas (gaseosas, jugos en caja)</li>
                <li>Frituras y comida rápida</li>
                <li>Dulces, postres y panadería industrial</li>
                <li>Salsas cremosas y aderezos procesados</li>
            </ul>

            <h4>Alimentos a aumentar</h4>
            <ul>
                <li>Verduras: espinaca, brócoli, zanahoria, lechuga</li>
                <li>Frutas: manzana, pera, papaya, sandía</li>
                <li>Proteínas magras: pechuga de pollo, pescado, claras de huevo</li>
                <li>Cereales integrales: avena, arroz integral, pan integral</li>
                <li>Legumbres: lentejas, garbanzos, fríjoles</li>
            </ul>

            <h4>Ejercicios sugeridos</h4>
            <ul>
                <li>Caminata rápida de 30-45 minutos, 5 veces por semana</li>
                <li>Bicicleta estática o al aire libre: 30 minutos</li>
                <li>Natación: excelente para bajo impacto articular</li>
                <li>Saltar la cuerda: 10 minutos al día</li>
                <li>Ejercicios de fuerza con peso corporal (sentadillas, planchas)</li>
            </ul>

            <h4>Hábitos</h4>
            <ul>
                <li>Comer despacio y masticar bien los alimentos</li>
                <li>Servir porciones más pequeñas en platos pequeños</li>
                <li>Beber un vaso de agua antes de cada comida</li>
                <li>Evitar comer frente al televisor o celular</li>
            </ul>

            <div class="nota-importante">
                ⚠️ Perder entre 3 y 5 kg puede devolverlo al rango ideal. ¡Está a tiempo!
            </div>
        `;
    }

    else if (imc < 30) {
        return `
            <div class="titulo-recom"> Plan de mejora — Sobrepeso grado II</div>

            <h4>Alimentos a eliminar</h4>
            <ul>
                <li>Bebidas azucaradas y energizantes</li>
                <li>Comida rápida y frituras</li>
                <li>Embutidos y carnes procesadas</li>
                <li>Snacks de paquete (papas, chitos, galletas)</li>
                <li>Alcohol en exceso</li>
            </ul>

            <h4>Alimentos recomendados</h4>
            <ul>
                <li>Proteínas magras en cada comida principal</li>
                <li>Vegetales verdes ilimitados</li>
                <li>Frutas con moderación (2-3 porciones al día)</li>
                <li>Grasas saludables: aceite de oliva, aguacate, nueces</li>
                <li>Consumir agua: mínimo 2.5 litros al día</li>
            </ul>

            <h4>Ejercicios sugeridos</h4>
            <ul>
                <li>Cardio 45 minutos, 5 veces por semana (caminar rápido, trotar, bici)</li>
                <li>Entrenamiento de fuerza 3 veces por semana</li>
                <li>Clases grupales: spinning, zumba, aeróbicos</li>
                <li>Aumentar la actividad diaria: usar escaleras, caminar al trabajo</li>
            </ul>

            <h4>Hábitos</h4>
            <ul>
                <li>Planear las comidas de la semana</li>
                <li>No saltarse comidas (genera más hambre)</li>
                <li>Llevar un registro de lo que come cada día</li>
                <li>Dormir mínimo 7 horas (el mal sueño engorda)</li>
            </ul>

            <div class="nota-importante">
                ⚠️ Consulte a un nutricionista para un plan alimentario personalizado.
            </div>
        `;
    }

    else if (imc < 35) {
        return `
            <div class="titulo-recom">⚠️ Plan de mejora — Obesidad de tipo I</div>

            <h4>Alimentos a eliminar</h4>
            <ul>
                <li>Todas las bebidas azucaradas y alcohólicas</li>
                <li>Frituras, empanizados y comida rápida</li>
                <li>Harinas refinadas (pan blanco, pasta blanca, arroz blanco)</li>
                <li>Azúcares añadidos: dulces, postres, gaseosas</li>
                <li>Embutidos y carnes procesadas</li>
            </ul>

            <h4>Alimentos recomendados</h4>
            <ul>
                <li>Verduras al vapor o crudas en grandes cantidades</li>
                <li>Proteínas magras: pollo, pavo, pescado, huevo, tofu</li>
                <li>Cereales integrales con moderación</li>
                <li>Frutas bajas en azúcar: manzana, pera, fresas, kiwi</li>
                <li>Agua: 2.5 a 3 litros al día</li>
            </ul>

            <h4>Ejercicios sugeridos</h4>
            <ul>
                <li>Caminata 45-60 minutos, 5-6 veces por semana</li>
                <li>Natación o aeróbicos acuáticos (bajo impacto articular)</li>
                <li>Bicicleta estática: 30 minutos</li>
                <li>Ejercicios de fuerza con bandas elásticas</li>
                <li>Evitar: correr, saltar, deportes de alto impacto</li>
            </ul>

            <h4>Hábitos</h4>
            <ul>
                <li>Comer cada 3-4 horas para evitar ansiedad</li>
                <li>Registrar todo lo que se consume</li>
                <li>Pesarse una vez por semana (no diario)</li>
                <li>Buscar apoyo familiar o grupos de apoyo</li>
            </ul>

            <div class="nota-importante">
                ⚠️ Consulte a médico y nutricionista. Se recomienda evaluación de presión arterial, glucosa y colesterol.
            </div>
        `;
    }

    else if (imc < 40) {
        return `
            <div class="titulo-recom">⚠️ Plan de mejora — Obesidad de tipo II</div>

            <h4>Alimentación supervisada</h4>
            <ul>
                <li>Plan nutricional diseñado por especialista</li>
                <li>Comidas caseras, sin procesados</li>
                <li>Eliminar completamente azúcares y frituras</li>
                <li>Vegetales en cada comida (50% del plato)</li>
                <li>Proteínas magras en porciones controladas</li>
                <li>Carbohidratos integrales solo en el almuerzo</li>
                <li>Cena ligera antes de las 7:00 pm</li>
            </ul>

            <h4>Ejercicios con supervisión</h4>
            <ul>
                <li>Caminata progresiva: comenzar con 15 min, aumentar 5 min por semana</li>
                <li>Natación o hidroterapia 3 veces por semana</li>
                <li>Ejercicios de movilidad articular diarios</li>
                <li>Evitar ejercicios de alto impacto (correr, saltar)</li>
                <li>Considerar apoyo de fisioterapeuta</li>
            </ul>

            <h4>Hábitos</h4>
            <ul>
                <li>Control médico mensual</li>
                <li>Exámenes de laboratorio: glucosa, perfil lipídico, tiroides</li>
                <li>Apoyo psicológico si hay ansiedad por comer</li>
                <li>Registrar peso, medidas y alimentos</li>
            </ul>

            <div class="nota-importante">
                ⚠️ Importante: la obesidad grado II requiere acompañamiento médico. No inicie dietas extremas sin supervisión.
            </div>
        `;
    }

    else if (imc < 50) {
        return `
            <div class="titulo-recom">Plan de mejora — Obesidad de tipo III (mórbida)</div>

            <h4>Alimentación clínica</h4>
            <ul>
                <li>Plan nutricional hospitalario personalizado</li>
                <li>Comidas fraccionadas: 6 veces al día</li>
                <li>Eliminar 100% azúcares, frituras y procesados</li>
                <li>Vegetales al vapor ilimitados</li>
                <li>Proteínas magras en cada comida</li>
                <li>Control estricto de porciones</li>
                <li>Suplementación si el médico lo indica</li>
            </ul>

            <h4>Ejercicios terapéuticos</h4>
            <ul>
                <li>Hidroterapia (ejercicios en piscina) supervisados</li>
                <li>Caminatas muy cortas: 5-10 min, 3 veces al día</li>
                <li>Ejercicios de movilidad en silla</li>
                <li>Fisioterapia para articulaciones</li>
                <li>Prohibido: correr, saltar, ejercicios de alto impacto</li>
            </ul>

            <h4> Hábitos y seguimiento</h4>
            <ul>
                <li>Control médico mensual obligatorio</li>
                <li>Exámenes completos: cardiovascular, metabólico, respiratorio</li>
                <li>Evaluación por endocrinología</li>
                <li>Posible evaluación para cirugía bariátrica</li>
                <li>Apoyo psicológico y nutricional continuo</li>
            </ul>

            <div class="nota-importante">
                Consulte de inmediato a un equipo multidisciplinario (médico, nutricionista, psicólogo, fisioterapeuta).
            </div>
        `;
    }

    else {
        return `
            <div class="titulo-recom">Plan de mejora — Obesidad de tipo IV (extrema)</div>

            <h4>Atención médica prioritaria</h4>
            <ul>
                <li>Manejo hospitalario multidisciplinario inmediato</li>
                <li>Evaluación por endocrinología, cardiología y nutrición clínica</li>
                <li>Exámenes completos: glucosa, lípidos, función hepática, renal, respiratoria</li>
                <li>Evaluación para cirugía bariátrica</li>
                <li>Monitoreo de presión arterial y riesgo cardiovascular</li>
            </ul>

            <h4> Alimentación clínica estricta</h4>
            <ul>
                <li>Plan nutricional hospitalario individualizado</li>
                <li>Comidas muy fraccionadas y controladas</li>
                <li>Sin azúcares, frituras ni procesados</li>
                <li>Vegetales y proteínas magras como base</li>
                <li>Hidratación constante (2.5-3 litros de agua)</li>
                <li>Suplementos según indicación médica</li>
            </ul>

            <h4> Movilidad supervisada</h4>
            <ul>
                <li>Ejercicios en cama o silla según capacidad</li>
                <li>Hidroterapia con fisioterapeuta</li>
                <li>Movilidad articular asistida</li>
                <li>No realizar esfuerzos sin supervisión médica</li>
            </ul>

            <div class="nota-importante">
                URGENTE: no inicie dietas ni ejercicios sin supervisión médica. Su caso requiere manejo clínico especializado e inmediato.
            </div>
        `;
    }
}