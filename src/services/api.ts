export async function fetchServerRecordings() {
  const res = await fetch("/api/recordings");

  if (!res.ok) {
    throw new Error("Failed to fetch server recordings");
  }

  return res.json();
}
