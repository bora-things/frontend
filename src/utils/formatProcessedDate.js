export function formatProcessedDate(dateString) {
  if (!dateString) return null;

  const date = new Date(dateString);
  const now = new Date();

  // Zera as horas para comparar apenas as datas
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const processedDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const diffTime = today - processedDay;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    // Hoje - mostra "Hoje" + hora
    const time = date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `Hoje às ${time}`;
  } else if (diffDays === 1) {
    // Ontem - mostra hora também
    const time = date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `Ontem às ${time}`;
  } else if (diffDays <= 7) {
    // Até 7 dias
    return `${diffDays} dias atrás`;
  } else {
    // Mais de 7 dias - mostra a data completa com hora
    const dateStr = date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    });
    const time = date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${dateStr} às ${time}`;
  }
}