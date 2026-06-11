export const routes = {
    eventos: {
        store: (params = {}) => route("eventos.store", params),
        update: (params = {}) => route("eventos.update", params),
        cancel: (params = {}) => route("eventos.cancel", params),
        publish: (params = {}) => route("eventos.publish", params),
    },
    inscricoes: {
        store: (params = {}) => route("inscricoes.store", params),
        atividades: {
            store: (params = {}) => route("inscricoes.atividades.store", params),
            destroy: (params = {}) => route("inscricoes.atividades.destroy", params),
        },
    },
    convites: {
        invite: (params = {}) => route("convites.invite", params),
        accept: (params = {}) => route("convites.accept", params),
        pending: (params = {}) => route("convites.pending", params),
        cancel: (params = {}) => route("convites.cancel", params),
    },
    organizadores: {
        index: (params = {}) => route("organizadores.index", params),
        destroy: (params = {}) => route("organizadores.destroy", params),
    },
    atividades: {
        index: (params = {}) => route("atividades.index", params),
        store: (params = {}) => route("atividades.store", params),
        update: (params = {}) => route("atividades.update", params),
        cancel: (id) => route("atividades.cancel", { id }),
        addMinistrante: (params = {}) => route("atividades.ministrantes.store", params),
        removeMinistrante: (params = {}) => route("atividades.ministrantes.destroy", params),
    },
    ambientes: {
        store: (params = {}) => route("ambientes.store", params),
    },
};
