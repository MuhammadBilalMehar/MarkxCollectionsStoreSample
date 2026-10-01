/* =========================================================
   MARKXCOLLECTIONS — bulk-order.js
   ========================================================= */

function initBulkOrderPage() {
  const form = document.getElementById("bulkForm");
  if (!form) return;

  let selectedTshirt = "Round Neck";
  let selectedPrinting = "DTF";
  let selectedQuantity = "10–25";
  let uploadDataUrl = null;

  document.getElementById("bulkTshirtChips")?.querySelectorAll(".chip").forEach((chip) =>
    chip.addEventListener("click", () => {
      document.querySelectorAll("#bulkTshirtChips .chip").forEach((c) => c.classList.remove("selected"));
      chip.classList.add("selected");
      selectedTshirt = chip.dataset.value;
    })
  );
  document.getElementById("bulkPrintingChips")?.querySelectorAll(".chip").forEach((chip) =>
    chip.addEventListener("click", () => {
      document.querySelectorAll("#bulkPrintingChips .chip").forEach((c) => c.classList.remove("selected"));
      chip.classList.add("selected");
      selectedPrinting = chip.dataset.value;
    })
  );
  document.getElementById("bulkQtyChips")?.querySelectorAll(".chip").forEach((chip) =>
    chip.addEventListener("click", () => {
      document.querySelectorAll("#bulkQtyChips .chip").forEach((c) => c.classList.remove("selected"));
      chip.classList.add("selected");
      selectedQuantity = chip.dataset.value;
      const customQtyField = document.getElementById("customQtyField");
      if (customQtyField) customQtyField.style.display = selectedQuantity === "Custom" ? "block" : "none";
    })
  );

  const zone = document.getElementById("bulkUploadZone");
  const input = document.getElementById("bulkUploadInput");
  const preview = document.getElementById("bulkUploadPreview");
  if (zone) {
    const handleFiles = (files) => {
      const file = files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        uploadDataUrl = e.target.result;
        preview.innerHTML = `<img src="${e.target.result}" alt="Uploaded logo">`;
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

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const requiredFields = [
      "bulkOrgName",
      "bulkContactPerson",
      "bulkPhone",
      "bulkEmail",
      "bulkOrderType"
    ];
    let valid = true;
    requiredFields.forEach((id) => {
      const el = document.getElementById(id);
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
    if (!valid) {
      showToast("Please complete the required fields", "fa-solid fa-triangle-exclamation");
      return;
    }

    const request = {
      id: "BLK-" + Date.now(),
      date: new Date().toISOString(),
      organization: document.getElementById("bulkOrgName").value,
      contactPerson: document.getElementById("bulkContactPerson").value,
      phone: document.getElementById("bulkPhone").value,
      email: document.getElementById("bulkEmail").value,
      orderType: document.getElementById("bulkOrderType").value,
      tshirtType: selectedTshirt,
      printing: selectedPrinting,
      quantity: selectedQuantity === "Custom" ? document.getElementById("bulkCustomQty").value : selectedQuantity,
      requirements: document.getElementById("bulkRequirements").value,
      hasUpload: !!uploadDataUrl
    };
    const list = storeGet(MARKX_KEYS.bulkRequests, []);
    list.push(request);
    storeSet(MARKX_KEYS.bulkRequests, list);

    openModal("bulkSuccessModal");
    showToast("Bulk quote request submitted", "fa-solid fa-circle-check");
    form.reset();
  });
}

document.addEventListener("DOMContentLoaded", initBulkOrderPage);
