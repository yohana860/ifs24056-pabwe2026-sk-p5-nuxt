import { ref } from "vue";

export function useInput(initial = "") {
  const value = ref(initial);
  const onChange = (e: Event) => {
    value.value = (e.target as HTMLInputElement).value;
  };
  return { value, onChange };
}
