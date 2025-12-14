import { supabase } from "./supabaseClient";

// WARNING: Never store plain passwords in production! Use Supabase Auth or hash passwords.
export async function signUpUser({ full_name, email, password, role }) {
  const { data, error } = await supabase
    .from("users")
    .insert([
      { full_name, email, password_hash: password, role }
    ]);
  return { data, error };
}