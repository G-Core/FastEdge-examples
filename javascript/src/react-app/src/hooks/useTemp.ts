import { useAppState } from "@/provider/AppStateContext";

function useTemp(temp: number, toFixed = 0) {
  const { unit } = useAppState();

  if (unit.toLowerCase() === "f") {
    return ((temp * 9) / 5 + 32).toFixed(toFixed);
  }

  return temp.toFixed(toFixed);
}

export default useTemp;
