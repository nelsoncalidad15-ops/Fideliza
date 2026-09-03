/**
 * ==============================================================================
 * AUTOSOL VOLKSWAGEN - GOOGLE APPS SCRIPT BACKEND (FIDELIZA)
 * ==============================================================================
 * 
 * INSTRUCCIONES DE INSTALACIÓN:
 * 1. Creá una nueva hoja de cálculo en Google Sheets (ejemplo: 'Autosol - Base Clientes Fideliza').
 * 2. En el menú superior, andá a: Extensiones > Apps Script.
 * 3. Borrá todo lo que haya en el editor y pegá este código completo.
 * 4. Hacé clic en 'Guardar' (ícono de disquete).
 * 5. Si la hoja está vacía, ejecutá la función 'crearEstructuraInicial' desde el selector
 *    superior de funciones para crear las columnas formateadas automáticamente.
 * 6. Hacé clic en: Implementar > Nueva implementación.
 * 7. En tipo, seleccioná 'Aplicación web' (ícono de engranaje).
 * 8. Configurá:
 *    - Descripción: 'API Autosol Fideliza'
 *    - Ejecutar como: 'Yo' (tu cuenta de Google)
 *    - Quién tiene acceso: 'Cualquier usuario' (Anyone)  <--- ¡IMPORTANTE!
 * 9. Hacé clic en 'Implementar', autorizá los permisos y copiá la 'URL de la aplicación web'.
 * 10. Pegá esa URL en la plataforma Autosol Fideliza (en la opción 'Conectar Google Sheets').
 * ==============================================================================
 */

const HOJA_CLIENTES = 'Clientes';
const HOJA_GESTIONES = 'Gestiones';

// ==============================================================================
// SEGURIDAD: TOKEN PRIVADO DE AUTORIZACIÓN
// Nadie puede consultar datos sin esta clave secreta.
// Podés cambiar este valor por la contraseña que prefieras.
// ==============================================================================
const API_SECRET_TOKEN = 'AUTOSOL_SECURE_TOKEN_2026';

/**
 * Endpoint GET: Devuelve clientes en formato JSON
 * SEGURIDAD ANTI-ROBO:
 * 1. Exige el token secreto API_SECRET_TOKEN.
 * 2. Si la petición proviene de un Asesor, solo devuelve su cartera asignada.
 */
function doGet(e) {
  try {
    const params = e ? e.parameter : {};

    // Verificación de seguridad por Token
    const token = (params.token || '').trim();
    if (token !== API_SECRET_TOKEN) {
      return jsonResponse({
        status: 'error',
        message: 'Acceso denegado: Token de seguridad no válido o ausente.'
      });
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    // Toma la hoja 'Clientes' o la primera hoja del documento (donde están tus datos)
    const sheetClientes = ss.getSheetByName(HOJA_CLIENTES) || ss.getSheets()[0];

    if (!sheetClientes) {
      return jsonResponse({
        status: 'error',
        message: 'No se encontró ninguna hoja con datos en el documento.'
      });
    }

    const data = sheetClientes.getDataRange().getValues();
    if (data.length <= 1) {
      return jsonResponse({ status: 'success', count: 0, data: [] });
    }

    const headers = data[0].map(h => String(h).trim().toLowerCase());
    const rows = data.slice(1);

    // Mapeo dinámico exacto para la planilla de Autosol
    const colIdx = {
      id: findCol(headers, ['id', 'código', 'codigo', 'chasis', 'dominio']),
      fullName: findCol(headers, ['cliente', 'nombre', 'razon social', 'razón social', 'titular', 'nombre completo']),
      docNumber: findCol(headers, ['cuil/t', 'cuit', 'cuil', 'dni', 'documento']),
      phone: findCol(headers, ['teléfono', 'telefono', 'celular', 'tel', 'whatsapp']),
      email: findCol(headers, ['email', 'correo', 'mail', 'teléfono del contacto', 'telefono del contacto']),
      address: findCol(headers, ['direccion', 'domicilio', 'calle']),
      city: findCol(headers, ['ciudad', 'localidad']),
      branch: findCol(headers, ['suc.', 'sucursal']),
      vehicleModel: findCol(headers, ['modelo', 'vehiculo', 'unidad', 'versión', 'version']),
      modelFamily: findCol(headers, ['familia', 'gama', 'modelo']),
      chassisNumber: findCol(headers, ['chasis', 'vin', 'cuadro']),
      licensePlate: findCol(headers, ['dominio', 'patente']),
      deliveryDate: findCol(headers, ['fecha entrega', 'remito', 'entrega', 'fecha remito']),
      registrationDate: findCol(headers, ['fecha patentamiento', 'fecha patentam', 'patentamiento']),
      birthDate: findCol(headers, ['fec.nac. cli.', 'fec.nac', 'fecha nacimiento', 'nacimiento', 'cumpleaños']),
      advisor: findCol(headers, ['detalle de ventas', 'detalle de venta', 'asesor', 'vendedor', 'responsable']),
      state: findCol(headers, ['estado', 'status']),
      contactReason: findCol(headers, ['motivo', 'motivo contacto']),
      priority: findCol(headers, ['prioridad']),
      category: findCol(headers, ['categoria', 'área', 'area']),
      notes: findCol(headers, ['notas', 'observaciones']),
      lastContactDate: findCol(headers, ['ultimo contacto', 'último contacto']),
      nextScheduledContact: findCol(headers, ['proximo contacto', 'próximo contacto'])
    };

    // Parámetros de seguridad
    const userRole = (params.role || '').toLowerCase();
    const userAdvisor = (params.advisor || '').toLowerCase();

    const result = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const licensePlateVal = String(row[colIdx.licensePlate] || '').trim();
      const fullNameVal = String(row[colIdx.fullName] || '').trim();
      const docVal = String(row[colIdx.docNumber] || '').trim();

      if (!fullNameVal && !licensePlateVal && !docVal) continue; // Fila vacía

      const advisorAssigned = String(row[colIdx.advisor] || '').trim();

      // Regla de seguridad anti-robo para asesores
      if (userRole === 'asesor' && userAdvisor) {
        const normAssigned = normalizarTexto(advisorAssigned);
        const normUser = normalizarTexto(userAdvisor);
        if (!normAssigned.includes(normUser) && !normUser.includes(normAssigned)) {
          continue; // Oculta clientes de otros asesores
        }
      }

      // Detección inteligente de email en cualquier columna de la fila que contenga '@'
      let emailVal = String(row[colIdx.email] || '').trim();
      if (!emailVal.includes('@')) {
        for (let j = 0; j < row.length; j++) {
          const cellStr = String(row[j] || '').trim();
          if (cellStr.includes('@') && cellStr.includes('.')) {
            emailVal = cellStr;
            break;
          }
        }
      }

      // Detección inteligente de teléfono
      let phoneVal = String(row[colIdx.phone] || '').trim();
      if (phoneVal.includes('@')) phoneVal = '';
      if (!phoneVal) {
        for (let j = 0; j < row.length; j++) {
          const cellStr = String(row[j] || '').trim();
          if (/[\d-]{7,}/.test(cellStr) && !cellStr.includes('@') && j !== colIdx.docNumber && j !== colIdx.chassisNumber && j !== colIdx.licensePlate) {
            phoneVal = cellStr;
            break;
          }
        }
      }

      const vehicleModelVal = String(row[colIdx.vehicleModel] || 'Volkswagen 0km');

      result.push({
        id: String(row[colIdx.id] || ('cli_' + (i + 1))),
        fullName: fullNameVal || 'Cliente Autosol',
        docNumber: docVal,
        phone: phoneVal,
        email: emailVal,
        address: String(row[colIdx.address] || ''),
        city: String(row[colIdx.city] || 'San Salvador de Jujuy'),
        branch: String(row[colIdx.branch] || 'San Salvador de Jujuy'),
        vehicleModel: vehicleModelVal,
        modelFamily: inferirFamilia(vehicleModelVal),
        chassisNumber: String(row[colIdx.chassisNumber] || ''),
        licensePlate: licensePlateVal,
        deliveryDate: formatearFecha(row[colIdx.deliveryDate]),
        registrationDate: formatearFecha(row[colIdx.registrationDate]),
        birthDate: formatearFecha(row[colIdx.birthDate]),
        advisor: advisorAssigned || 'Sin Asignar',
        state: String(row[colIdx.state] || 'Pendiente'),
        contactReason: String(row[colIdx.contactReason] || 'Renovación preferencial'),
        priority: String(row[colIdx.priority] || 'Media'),
        category: String(row[colIdx.category] || 'Ventas'),
        notes: String(row[colIdx.notes] || ''),
        lastContactDate: formatearFecha(row[colIdx.lastContactDate]),
        nextScheduledContact: formatearFecha(row[colIdx.nextScheduledContact])
      });
    }

    return jsonResponse({
      status: 'success',
      count: result.length,
      data: result,
      source: 'Autosol Google Sheet'
    });

  } catch (error) {
    return jsonResponse({
      status: 'error',
      message: error.toString()
    });
  }
}

/**
 * Endpoint POST: Registra una nueva gestión y actualiza el cliente en la hoja
 */
function doPost(e) {
  try {
    const postData = e && e.postData && e.postData.contents ? JSON.parse(e.postData.contents) : {};

    // Verificación de seguridad por Token
    if ((postData.token || '').trim() !== API_SECRET_TOKEN) {
      return jsonResponse({
        status: 'error',
        message: 'Acceso denegado: Token de seguridad no válido.'
      });
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // 1. Guardar en pestaña 'Gestiones' (Auditoría e historial)
    let sheetGestiones = ss.getSheetByName(HOJA_GESTIONES);
    if (!sheetGestiones) {
      sheetGestiones = ss.insertSheet(HOJA_GESTIONES);
      sheetGestiones.appendRow([
        'ID Gestión',
        'ID Cliente',
        'Fecha y Hora',
        'Canal',
        'Resultado',
        'Observación / Notas',
        'Interés Detectado',
        'Próximo Contacto',
        'Asesor'
      ]);
      sheetGestiones.getRange(1, 1, 1, 9).setBackground('#001e50').setFontColor('#ffffff').setFontWeight('bold');
    }

    sheetGestiones.appendRow([
      'gst_' + Date.now(),
      postData.customerId || '',
      postData.date || new Date().toLocaleString('es-AR'),
      postData.channel || 'WhatsApp',
      postData.result || 'Contactado',
      postData.notes || '',
      postData.detectedInterest || '',
      postData.nextFollowUpDate || '',
      postData.advisorName || ''
    ]);

    // 2. Actualizar estado y fecha en la pestaña 'Clientes'
    const sheetClientes = ss.getSheetByName(HOJA_CLIENTES);
    if (sheetClientes && postData.customerId) {
      const data = sheetClientes.getDataRange().getValues();
      const headers = data[0].map(h => String(h).trim().toLowerCase());
      const colId = findCol(headers, ['id', 'código', 'codigo']);
      const colState = findCol(headers, ['estado', 'status']);
      const colLastContact = findCol(headers, ['ultimo contacto', 'último contacto']);
      const colNextContact = findCol(headers, ['proximo contacto', 'próximo contacto']);

      for (let i = 1; i < data.length; i++) {
        const rowId = String(data[i][colId] || ('cli_' + i));
        if (rowId === String(postData.customerId)) {
          if (colState !== -1 && postData.result) {
            let nuevoEstado = 'Contactado';
            if (postData.result === 'Renovado') nuevoEstado = 'Renovado';
            else if (['Interesado', 'Quiere cotización', 'Quiere entregar usado'].includes(postData.result)) nuevoEstado = 'Interesado';
            else if (postData.result === 'No respondió') nuevoEstado = 'No respondió';
            sheetClientes.getRange(i + 1, colState + 1).setValue(nuevoEstado);
          }
          if (colLastContact !== -1) {
            sheetClientes.getRange(i + 1, colLastContact + 1).setValue(postData.date || new Date().toLocaleDateString('es-AR'));
          }
          if (colNextContact !== -1 && postData.nextFollowUpDate) {
            sheetClientes.getRange(i + 1, colNextContact + 1).setValue(postData.nextFollowUpDate);
          }
          break;
        }
      }
    }

    return jsonResponse({
      status: 'success',
      message: 'Gestión guardada exitosamente en Google Sheets'
    });

  } catch (error) {
    return jsonResponse({
      status: 'error',
      message: error.toString()
    });
  }
}

/**
 * Función auxiliar para crear la estructura inicial y datos de muestra en la hoja
 */
function crearEstructuraInicial() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Hoja Clientes
  let sheet = ss.getSheetByName(HOJA_CLIENTES);
  if (!sheet) {
    sheet = ss.insertSheet(HOJA_CLIENTES);
  } else {
    sheet.clear();
  }

  const encabezados = [
    'ID', 'Nombre Completo', 'DNI o CUIT', 'Teléfono', 'Email', 
    'Dirección', 'Ciudad', 'Sucursal', 'Modelo', 'Familia', 
    'Chasis', 'Patente', 'Fecha Entrega', 'Fecha Patentamiento', 
    'Fecha Nacimiento', 'Asesor Asignado', 'Estado', 'Motivo Contacto', 
    'Prioridad', 'Categoría', 'Último Contacto', 'Próximo Contacto', 'Observaciones'
  ];

  sheet.appendRow(encabezados);

  // Estilo cabecera Autosol Volkswagen
  const headerRange = sheet.getRange(1, 1, 1, encabezados.length);
  headerRange.setBackground('#001e50'); // Azul Volkswagen
  headerRange.setFontColor('#ffffff');
  headerRange.setFontWeight('bold');
  headerRange.setHorizontalAlignment('center');

  // Datos de ejemplo
  sheet.appendRow([
    'cli_001', 'CIRO AUTOMOTORES', '24729298', '03878-15401661', 'ciroautomotores@hotmail.com',
    'SENADOR PEREZ 162', 'Ledesma', 'Ledesma', 'VOLKSWAGEN Tera 1.6 MSI Trendline MY 26', 'Tera',
    '9BWBL6DF7TT332057', 'AH831BM', '11/02/2026', '15/01/2026',
    '14/09/1975', 'M. OLMOS', 'Pendiente', 'Seguimiento satisfacción 48hs',
    'Alta', 'Ventas', '12/02/2026', 'Hoy', 'Flota Comercial Ledesma'
  ]);

  sheet.appendRow([
    'cli_002', 'LEDESMA SOCIEDAD ANONIMA AGRICOLA', '30-50125030-5', '0388-156412190', 'hgonzalez@ledesma.com.ar',
    'CORRIENTES AV 415', 'San Salvador de Jujuy', 'San Salvador de Jujuy', 'VOLKSWAGEN TAOS Highline 250TSI AT MY26', 'Taos',
    '3VVJP6B22TM009948', 'AI464QL', '27/08/2024', '27/08/2024',
    '03/09/1968', 'GUSTAVO MAURICIO CABEZAS', 'Potencial renovación', 'Renovación 24 meses',
    'Alta', 'Ventas', '15/07/2026', 'Hoy 10:00', 'Cliente Corporativo - Oportunidad Flota'
  ]);

  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, encabezados.length);

  // Hoja Gestiones
  let sheetGestiones = ss.getSheetByName(HOJA_GESTIONES);
  if (!sheetGestiones) {
    sheetGestiones = ss.insertSheet(HOJA_GESTIONES);
  } else {
    sheetGestiones.clear();
  }

  const encGestiones = [
    'ID Gestión', 'ID Cliente', 'Fecha y Hora', 'Canal', 'Resultado',
    'Observación / Notas', 'Interés Detectado', 'Próximo Contacto', 'Asesor'
  ];
  sheetGestiones.appendRow(encGestiones);
  const gRange = sheetGestiones.getRange(1, 1, 1, encGestiones.length);
  gRange.setBackground('#0050d8').setFontColor('#ffffff').setFontWeight('bold');
  sheetGestiones.setFrozenRows(1);
}

// Utilidades internas
function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function findCol(headers, candidates) {
  for (let i = 0; i < headers.length; i++) {
    const h = headers[i];
    for (let c = 0; c < candidates.length; c++) {
      if (h === candidates[c] || h.includes(candidates[c])) return i;
    }
  }
  return -1;
}

function normalizarTexto(txt) {
  return String(txt || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/direccion\s*-|lic\./gi, '').trim();
}

function formatearFecha(valor) {
  if (!valor) return '';
  if (valor instanceof Date) {
    const d = ('0' + valor.getDate()).slice(-2);
    const m = ('0' + (valor.getMonth() + 1)).slice(-2);
    const y = valor.getFullYear();
    return d + '/' + m + '/' + y;
  }
  return String(valor).trim();
}

function inferirFamilia(modelo) {
  const m = modelo.toUpperCase();
  if (m.includes('TAOS')) return 'Taos';
  if (m.includes('AMAROK')) return 'Amarok';
  if (m.includes('NIVUS')) return 'Nivus';
  if (m.includes('T-CROSS') || m.includes('TCROSS')) return 'T-Cross';
  if (m.includes('POLO')) return 'Polo';
  if (m.includes('VIRTUS')) return 'Virtus';
  if (m.includes('TERA')) return 'Tera';
  if (m.includes('TIGUAN')) return 'Tiguan';
  return 'Otro';
}
