export const fetchHistory = async (id: string) => {
  const res = await fetch(`/api/requests/${id}`);
  const data = await res.json();
  return data.requests || [];
};
