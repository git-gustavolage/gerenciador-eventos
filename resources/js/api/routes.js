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

const convitesRoutes = {
    invite: (params = {}) => route("convites.invite", params),
    accept: (params = {}) => route("convites.accept", params),
};

export { localidadesRoutes, eventosRoutes, organizadoresRoutes, convitesRoutes };
