import Swal from "sweetalert2";

export const showSuccessDialog = (text: string) => Swal.fire({ icon: "success", title: "Berhasil", text, confirmButtonColor: "#4f46e5" });
export const showErrorDialog = (text: string) => Swal.fire({ icon: "error", title: "Gagal", text, confirmButtonColor: "#4f46e5" });
export const showConfirmDialog = async (text: string): Promise<boolean> => {
  const r = await Swal.fire({ icon: "warning", title: "Yakin?", text, showCancelButton: true, confirmButtonText: "Ya", cancelButtonText: "Batal", confirmButtonColor: "#dc2626" });
  return r.isConfirmed;
};

export const formatRupiah = (n: number | string): string =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(n) || 0);

export const formatDate = (d?: string | number | Date): string =>
  d ? new Date(d).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }) : "-";
