export const wait = (delay: number, abortSignal?: AbortSignal) => {
  return new Promise((resolve, reject) => {
    const t = setTimeout(resolve, delay);

    abortSignal && (abortSignal.addEventListener("abort", () => {
      clearTimeout(t);

      reject(new Error("Cancelled"));
    }));
  });
};
