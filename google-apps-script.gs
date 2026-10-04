/**
 * Backend para guardar confirmaciones en Google Sheets.
 * 1. Crea una hoja de cálculo y abre Extensiones > Apps Script.
 * 2. Pega este código, guarda y despliega como aplicación web.
 */
function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents || '{}');
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Confirmaciones') || ss.insertSheet('Confirmaciones');
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Fecha de registro', 'Nombre completo', 'Confirma asistencia', 'Acompañantes']);
      sheet.getRange(1, 1, 1, 4).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }
    var companions = Array.isArray(payload.acompanantes) ? payload.acompanantes : [];
    sheet.appendRow([
      new Date(),
      String(payload.nombre || '').trim(),
      payload.confirmado === true ? 'Sí' : 'No',
      companions.map(function (name) { return String(name).trim(); }).filter(Boolean).join(', ')
    ]);
    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(error) })).setMimeType(ContentService.MimeType.JSON);
  }
}
