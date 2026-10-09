import { apiFetch } from "~/helpers/apiHelper";

export const postLogin = async (email: string, password: string): Promise<string> => {
  const json = await apiFetch("/auth/login", { method: "POST", body: { email, password }, auth: false });
  return json.data?.token;
};

export const postRegister = async (name: string, email: string, password: string): Promise<string> => {
  const json = await apiFetch("/auth/register", { method: "POST", body: { name, email, password }, auth: false });
  return json.message;
};
