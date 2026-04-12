export default function EventsApi() {

  const evento1 = {
    uuid: "asd-asd-111",
    image_url: "/images/placeholder/eventos/banner.png",
    title: "IX Congresso Brasileiro de Fisioterapia e Oncologia",
    date: "06/05/2025",
    format: "Híbrido",
    description: "Consequuntur repudiandae eaque optio cum, nisi beatae eius sit eos? Aperiam magni eius incidunt officiis aspernatur, doloremque non accusantium perferendis rerum voluptatum molestiae illo? Incidunt, cumque qui! Neque molestias perspiciatis minima qui quae, dolor doloribus? Blanditiis, dicta labore aut aperiam ducimus magni ad incidunt quaerat corporis, possimus inventore nemo maiores tempore laboriosam repudiandae quia excepturi obcaecati expedita provident? Molestias alias et, nemo facilis laboriosam.",
    activities: [
      { uuid: "1", title: "Palestra: Cyber Security aplicada na cozinha. Vamos Cozynhar!", end_date: "", start_date: "20/02/2025", start_time: "19:00", end_time: "21:00" },
      { uuid: "2", title: "Oficina: IFRO na cozinha. Vamos fritar um ovo!", end_date: "", start_date: "20/02/2025", start_time: "20:00", end_time: "21:00" },
      { uuid: "3", title: "Atividade de teste!", end_date: "", start_date: "20/02/2025", start_time: "21:30", end_time: "22:30" },
      { uuid: "4", title: "Minicurso: Docker.", end_date: "", start_date: "23/02/2025", start_time: "19:00", end_time: "21:00" },
      { uuid: "5", title: "Palestra: Como identificar um stalker.", end_date: "", start_date: "20/02/2025", start_time: "19:00", end_time: "21:00" },
      { uuid: "6", title: "Palestra: Como utilizar IA para criar imagens do Seu Madruga só de calcinha.", end_date: "", start_date: "20/02/2025", start_time: "19:00", end_time: "21:00" },
      { uuid: "7", title: "Palestra: Como saber se sou um ser humano ou um alienígena?", end_date: "", start_date: "22/02/2025", start_time: "19:00", end_time: "21:00" },
      { uuid: "8", title: "Minicurso: Ensinando a contar até 10.", end_date: "", start_date: "21/02/2025", start_time: "19:00", end_time: "21:00" },
    ],
    guests: [
      { name: "Nome Bem Feito Costa e Silva ", email: "NomeBemLegaldaSilva@gmail.com" },
      { name: "Outro Nome dos Bem Bacanas ", email: "OhNomeBacanaEin@gmail.com" },
    ],
    tickets: [
      { category: "Estudante", is_limited: false, subscribers: 0, is_expired: false, type: "Gratuita", starts_in: "20/02/2025", expires_in: "25/03/2025" },
      { category: "Público Externo", is_limited: true, limit: 100, subscribers: 100, is_expired: true, type: "Paga", starts_in: "20/02/2025", expires_in: "25/03/2025" },
      { category: "Professor", is_limited: true, limit: 100, subscribers: 100, is_expired: true, type: "Gratuita", starts_in: "20/02/2025", expires_in: "25/03/2025" },
    ],
  };

  const evento2 = {
    uuid: "asd-asd-222",
    image_url: "/images/placeholder/eventos/banner3.png",
    title: "I Semana Nacional de Ciência e Tecnologia",
    date: "13/13/1313",
    format: "Online",
    description: "Consequuntur repudiandae eaque optio cum, nisi beatae eius sit eos? Aperiam magni eius incidunt officiis aspernatur, doloremque non accusantium perferendis rerum voluptatum molestiae illo? Incidunt, cumque qui! Neque molestias perspiciatis minima qui quae, dolor doloribus? Blanditiis, dicta labore aut aperiam ducimus magni ad incidunt quaerat corporis, possimus inventore nemo maiores tempore laboriosam repudiandae quia excepturi obcaecati expedita provident? Molestias alias et, nemo facilis laboriosam.",
    activities: [
      { uuid: "1", title: "Palestra: Cyber Security aplicada na cozinha. Vamos Cozynhar!", end_date: "", start_date: "20/02/2025", start_time: "19:00", end_time: "21:00" },
      { uuid: "2", title: "Oficina: IFRO na cozinha. Vamos fritar um ovo!", end_date: "", start_date: "20/02/2025", start_time: "20:00", end_time: "21:00" },
      { uuid: "3", title: "Atividade de teste!", end_date: "", start_date: "20/02/2025", start_time: "21:30", end_time: "22:30" },
      { uuid: "4", title: "Minicurso: Docker.", end_date: "", start_date: "23/02/2025", start_time: "19:00", end_time: "21:00" },
      { uuid: "5", title: "Palestra: Como identificar um stalker.", end_date: "", start_date: "20/02/2025", start_time: "19:00", end_time: "21:00" },
      { uuid: "6", title: "Palestra: Como utilizar IA para criar imagens do Seu Madruga só de calcinha.", end_date: "", start_date: "20/02/2025", start_time: "19:00", end_time: "21:00" },
      { uuid: "7", title: "Palestra: Como saber se sou um ser humano ou um alienígena?", end_date: "", start_date: "22/02/2025", start_time: "19:00", end_time: "21:00" },
      { uuid: "8", title: "Minicurso: Ensinando a contar até 10.", end_date: "", start_date: "21/02/2025", start_time: "19:00", end_time: "21:00" },
    ],
    guests: [
      { name: "Nome Bem Feito Costa e Silva ", email: "NomeBemLegaldaSilva@gmail.com" },
      { name: "Outro Nome dos Bem Bacanas ", email: "OhNomeBacanaEin@gmail.com" },
    ],
    tickets: [
      { category: "Estudante", is_limited: false, subscribers: 0, is_expired: false, type: "Gratuita", starts_in: "20/02/2025", expires_in: "25/03/2025" },
      { category: "Público Externo", is_limited: true, limit: 100, subscribers: 100, is_expired: true, type: "Paga", starts_in: "20/02/2025", expires_in: "25/03/2025" },
      { category: "Professor", is_limited: true, limit: 100, subscribers: 100, is_expired: true, type: "Gratuita", starts_in: "20/02/2025", expires_in: "25/03/2025" },
    ],
  };

  const events = [evento1, evento2];

  function getEvents() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(events);
      }, 1000);
    });
  }


  return {
    getEvents,
  };
}
