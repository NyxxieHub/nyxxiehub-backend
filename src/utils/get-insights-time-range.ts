export function getInsightsTimeRange(lastSyncedAt: Date | null) {
  const today = new Date();
  const until = today.toISOString().split("T")[0]; // formato: YYYY-MM-DD

  // Se nunca sincronizou antes, pega os últimos 6 meses
  if (!lastSyncedAt) {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const since = sixMonthsAgo.toISOString().split("T")[0];

    return { since, until };
  }

  // Se já sincronizou antes, puxa desde o último sync até hoje
  const since = new Date(lastSyncedAt).toISOString().split("T")[0];

  return { since, until };
}
