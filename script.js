// CONFIGURACIÓN: reemplaza estos valores antes de compartir la invitación.
const CONFIG = {
  photoUrl: "foto1.jpg", // URL de la foto de quien celebra su cumpleaños (opcional)
  locationName: "Iglesia Cruzada Cristiana El Shaddai",
  locationAddress: "Colombia",
  googleMapsUrl: "https://maps.app.goo.gl/ZbEUD2f4iXf7aCHy5",
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3982.6746257345417!2d-76.4834984!3d3.4291567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e30a7138b9c9a35%3A0xe3c13d789816090d!2sIglesia%20Cruzada%20Cristiana%20El%20Shaddai!5e0!3m2!1ses-419!2sco!4v1776660819431!5m2!1ses-419!2sco",
  googleAppsScriptUrl: "https://script.google.com/macros/s/AKfycbxApPTf8-HVSdIm5BeEMkFww7qZcjy7UkBq2rlYsiyuVKhqupkXclUdE3rs1mpv3nmK/exec", // URL de implementación de Apps Script (ver INTEGRACION_GOOGLE_SHEETS.md)
};
const photoFrame = document.getElementById("photoFrame");
if (CONFIG.photoUrl && !CONFIG.photoUrl.startsWith("PEGA_AQUI")) {
  const img = document.createElement("img");
  img.src = CONFIG.photoUrl;
  img.alt = "Foto de quien celebra su cumpleaños";
  img.onerror = () => img.remove();
  photoFrame.prepend(img);
}
const place = [CONFIG.locationName, CONFIG.locationAddress]
  .filter(Boolean)
  .join(", ");
document.getElementById("placeName").textContent = CONFIG.locationName;
document.getElementById("placeAddress").textContent = CONFIG.locationAddress;
document.getElementById("mapCaption").textContent = place;
document.getElementById("mapsButton").href = CONFIG.googleMapsUrl;
document.getElementById("mapFrame").innerHTML =
  `<iframe title="Mapa de Iglesia Cruzada Cristiana El Shaddai" loading="lazy" allowfullscreen referrerpolicy="no-referrer-when-downgrade" src="${CONFIG.mapEmbedUrl}"></iframe>`;
const guestList = document.getElementById("guestList");
let guestCount = 0;
function addGuest() {
  guestCount++;
  const row = document.createElement("div");
  row.className = "guest";
  const input = document.createElement("input");
  input.type = "text";
  input.name = "acompanantes[]";
  input.maxLength = 120;
  input.placeholder = `Nombre del acompañante ${guestCount}`;
  input.setAttribute("aria-label", input.placeholder);
  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "remove";
  remove.textContent = "Quitar";
  remove.setAttribute("aria-label", "Quitar acompañante");
  remove.onclick = () => row.remove();
  row.append(input, remove);
  guestList.append(row);
  input.focus();
}
document.getElementById("addGuest").addEventListener("click", addGuest);
const form = document.getElementById("rsvpForm"),
  status = document.getElementById("formStatus");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  status.className = "status";
  status.textContent = "";
  const confirmed = document.getElementById("attending").checked;
  if (!confirmed) {
    status.classList.add("error");
    status.textContent = "Marca la casilla para confirmar tu asistencia.";
    return;
  }
  if (!CONFIG.googleAppsScriptUrl) {
    status.classList.add("error");
    status.textContent =
      "Falta conectar Google Sheets. Configura la URL indicada en la página.";
    return;
  }
  const data = {
    nombre: form.elements.nombre.value.trim(),
    confirmado: true,
    acompanantes: [...form.querySelectorAll('[name="acompanantes[]"]')]
      .map((x) => x.value.trim())
      .filter(Boolean),
    fechaEnvio: new Date().toISOString(),
  };
  const button = form.querySelector('[type="submit"]');
  button.disabled = true;
  button.style.opacity = ".65";
  status.textContent = "Enviando…";
  try {
    await fetch(CONFIG.googleAppsScriptUrl, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(data),
    });
    status.textContent = "¡Gracias! Tu confirmación fue enviada 💙";
    form.reset();
    guestList.innerHTML = "";
  } catch (err) {
    status.classList.add("error");
    status.textContent =
      "No se pudo enviar. Revisa tu conexión e inténtalo otra vez.";
  } finally {
    button.disabled = false;
    button.style.opacity = "1";
  }
});
const observer = new IntersectionObserver(
  (entries) =>
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    }),
  { threshold: 0.12 },
);
document
  .querySelectorAll(".reveal:not(.visible)")
  .forEach((el) => observer.observe(el));
