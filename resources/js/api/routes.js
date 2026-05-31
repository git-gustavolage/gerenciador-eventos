const localidadesRoutes = {
    store: "", //safeRoute("localidades.store"),
};

const eventosRoutes = {
    store: (params = {}) => route("eventos.store", params),
    update: (params = {}) => route("eventos.update", params),
};

const organizadoresRoutes = {
    index: (params = {}) => route("organizador.organizadores.index", params),
    destroy: (params = {}) => route("organizador.organizadores.destroy", params),
};

export { localidadesRoutes, eventosRoutes, organizadoresRoutes };
