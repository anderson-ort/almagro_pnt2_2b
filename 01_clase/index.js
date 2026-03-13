const colorPicker = document.getElementById("colorPicker");

// Cargar color guardado
const colorGuardado = localStorage.getItem("bgColor");

if (colorGuardado) {
    document.body.style.background = colorGuardado;
    colorPicker.value = colorGuardado;
}

colorPicker.addEventListener("input", (e) => {
    const color = e.target.value;

    document.body.style.background = color;

    localStorage.setItem("bgColor", color);
});