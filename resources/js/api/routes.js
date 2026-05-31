const localidades = {
    store: '',//route("localidades.store"),
};

const eventos = {
    store: route("eventos.store"),
    update: route("eventos.update"),
};

const ambientesRoutes = {
    store: (params) => route("ambientes.store", params),
};

export { localidades, eventos, ambientesRoutes };
