/* =========================================================
   MARKXCOLLECTIONS — customize.js
   ========================================================= */

const customizeState = {
  tshirt: "Round Neck",
  color: "Black",
  printing: "DTF Printing",
  text: "",
  imageDataUrl: null,
  quantity: 1,
  size: "M",
  notes: ""
};

const TEE_COLOR_HEX = {
  Black: "#2B241C",
  White: "#F3ECDD",
  Red: "#B4502F",
  Navy: "#3C4F63",
  Grey: "#ABA089",
  Custom: "#C9BB98"
};

function teeMockSvg(colorHex) {
  return `
  <svg viewBox="0 0 260 300" xmlns="http://www.w3.org/2000/svg">
    <path d="M 40,60 L 5,105 L 35,140 L 62,120 L 62,270 L 198,270 L 198,120 L 225,140 L 255,105 L 220,60
             C 200,30 160,14 130,14 C 100,14 60,30 40,60 Z"
          fill="${colorHex}" stroke="#241E17" stroke-width="3"/>
    <path d="M 100,16 C 112,40 148,40 160,16" fill="none" stroke="#241E17" stroke-width="3"/>
  </svg>`;
}

function paintTeePreview() {
  const mockEl = document.getElementById("teeMock");
  const textEl = document.getElementById("teeMockText");
  const imgEl = document.getElementById("teeMockImg");
  if (!mockEl) return;
  const hex = TEE_COLOR_HEX[customizeState.color] || "#2B241C";
  mockEl.innerHTML = teeMockSvg(hex);

  const isDark = ["Black", "Navy"].includes(customizeState.color);
  textEl.style.color = isDark ? "#FCF9F1" : "#241E17";
  textEl.textContent = customizeState.text || "";

  if (customizeState.imageDataUrl) {
    imgEl.src = customizeState.imageDataUrl;
    imgEl.style.display = "block";
  } else {
    imgEl.style.display = "none";
  }

  document.getElementById("previewMeta").textContent =
    `${customizeState.tshirt} · ${customizeState.color} · ${customizeState.printing}`;
}

function wireChipGroup(containerId, stateKey, cb) {
  const container = document.getElementById(containerId);
  container?.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      container.querySelectorAll(".chip").forEach((c) => c.classList.remove("selected"));
      chip.classList.add("selected");
      customizeState[stateKey] = chip.dataset.value;
      if (cb) cb();
      paintTeePreview();
    });
  });
}

function wireUploadZone() {
  const zone = document.getElementById("uploadZone");
  const input = document.getElementById("uploadInput");
  const preview = document.getElementById("uploadPreview");
  if (!zone) return;

  const handleFiles = (files) => {
    const file = files[0];
    if (!file) return;
    if (!["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(file.type)) {
      showToast("Please upload a PNG, JPG or WEBP file", "fa-solid fa-triangle-exclamation");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      customizeState.imageDataUrl = e.target.result;
      preview.innerHTML = `<img src="${e.target.result}" alt="Uploaded design">`;
      paintTeePreview();
    };
    reader.readAsDataURL(file);
  };

  zone.addEventListener("click", () => input.click());
  input.addEventListener("change", (e) => handleFiles(e.target.files));

  ["dragenter", "dragover"].forEach((evt) =>
    zone.addEventListener(evt, (e) => {
      e.preventDefault();
      zone.classList.add("dragover");
    })
  );
  ["dragleave", "drop"].forEach((evt) =>
    zone.addEventListener(evt, (e) => {
      e.preventDefault();
      zone.classList.remove("dragover");
    })
  );
  zone.addEventListener("drop", (e) => handleFiles(e.dataTransfer.files));
}

function initCustomizePage() {
  const form = document.getElementById("customizeForm");
  if (!form) return;

  wireChipGroup("tshirtChips", "tshirt");
  wireChipGroup("colorChips", "color");
  wireChipGroup("printingChips", "printing");
  wireChipGroup("sizeChips", "size");

  wireUploadZone();
  paintTeePreview();

  const textInput = document.getElementById("customText");
  textInput.addEventListener("input", () => {
    customizeState.text = textInput.value.slice(0, 24);
    paintTeePreview();
  });

  const qtyStepper = document.getElementById("cQtyStepper");
  qtyStepper.querySelectorAll("[data-c-qty]").forEach((btn) =>
    btn.addEventListener("click", () => {
      customizeState.quantity = Math.max(1, customizeState.quantity + Number(btn.dataset.cQty));
      document.getElementById("cQty").textContent = customizeState.quantity;
    })
  );

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const notesEl = document.getElementById("customNotes");
    const nameEl = document.getElementById("customContactName");
    const phoneEl = document.getElementById("customContactPhone");

    let valid = true;
    [nameEl, phoneEl].forEach((el) => {
      const errorEl = el.parentElement.querySelector(".field-error");
      if (!el.value.trim()) {
        el.parentElement.classList.add("has-error");
        if (errorEl) errorEl.textContent = "This field is required.";
        valid = false;
      } else {
        el.parentElement.classList.remove("has-error");
        if (errorEl) errorEl.textContent = "";
      }
    });
    if (!valid) return;

    customizeState.notes = notesEl.value;
    const request = {
      id: "CST-" + Date.now(),
      date: new Date().toISOString(),
      contactName: nameEl.value,
      contactPhone: phoneEl.value,
      ...customizeState
    };
    const list = storeGet(MARKX_KEYS.customRequests, []);
    list.push(request);
    storeSet(MARKX_KEYS.customRequests, list);

    openModal("customSuccessModal");
    showToast("Customization request submitted", "fa-solid fa-circle-check");
  });
}

document.addEventListener("DOMContentLoaded", initCustomizePage);
