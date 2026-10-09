import { apiFetch, pickList } from "~/helpers/apiHelper";

export const getUsers = async () => pickList((await apiFetch("/users")).data, "users");
export const getMe = async () => {
  const d = (await apiFetch("/users/me")).data;
  return d?.user ?? d;
};
export const putMe = async (name: string, email: string) =>
  (await apiFetch("/users/me", { method: "PUT", body: { name, email } })).message;
export const postPhoto = async (file: File) => {
  const fd = new FormData();
  fd.append("photo", file);
  return (await apiFetch("/users/me/photo", { method: "POST", body: fd })).message;
};
export const putPassword = async (password: string, new_password: string) =>
  (await apiFetch("/users/me/password", { method: "PUT", body: { password, new_password } })).message;
