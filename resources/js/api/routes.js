export const localidadesRoutes = {
    store: "", //safeRoute("localidades.store"),
};

export const eventosRoutes = {
    store: (params = {}) => route("eventos.store", params),
    update: (params = {}) => route("eventos.update", params),
};

export const organizadoresRoutes = {
    index: (params = {}) => route("organizadores.index", params),
    destroy: (params = {}) => route("organizadores.destroy", params),
};

export const convitesRoutes = {
    invite: (params = {}) => route("convites.invite", params),
    accept: (params = {}) => route("convites.accept", params),
    pending: (params = {}) => route("convites.pending", params),
    cancel: (params = {}) => route("convites.cancel", params),
};

export const ambientesRoutes = {
    store: (params = {}) => route("ambientes.store", params),
};
