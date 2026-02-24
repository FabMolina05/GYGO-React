import Swal from "sweetalert2";

export async function fetchWithAuth(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    credentials: "include", // incluir cookies siempre
  });

    // Token expirado o no válido
  if (response.status === 401) {

    Swal.fire({
      icon: "warning",
      title: "Sesión expirada",
      text: "Por seguridad, debes iniciar sesión nuevamente.",
      showConfirmButton: false,
      timer: 3000,
    });

    // Redirige después de 3 segundos
    setTimeout(() => {
      window.location.href = "/inicio-sesion";
    }, 3000);

    return null;
  }

  return response;
}