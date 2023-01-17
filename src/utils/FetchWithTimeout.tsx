type OptionsType = {
  timeout: number;
};
export default async function fetchWithTimeout(
  resource: RequestInfo | URL,
  options: OptionsType
): Promise<Response> {
  const { timeout = 4000 } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const response = await fetch(resource, {
    ...options,
    signal: controller.signal,
  });
  clearTimeout(id);
  return response;
}
