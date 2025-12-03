import { Language, VideoStatus } from "./types";

type Translations = {
  [key in Language]: {
    appTitle: string;
    configTitle: string;
    channelName: string;
    channelPlaceholder: string;
    format: string;
    longVideo: string;
    shorts: string;
    videosPerDay: string;
    slots: string;
    shortsHint: string;
    longHint: string;
    firstVideo: string;
    lastVideo: string;
    generateBtn: string;
    generateHint: string;
    statsCompletion: string;
    statsReady: string;
    statsEdit: string;
    statsProd: string;
    exportCsv: string;
    exportTxt: string;
    clearAll: string;
    confirmClear: string;
    confirmHighVolume: string;
    endTimeError: string;
    aiCoachTitle: string;
    aiCoachDesc: string;
    aiCoachBtn: string;
    aiCoachBtnActive: string;
    shortsModeTitle: string;
    shortsModeDesc: string;
    noScheduleTitle: string;
    noScheduleDesc: string;
    headerTime: string;
    headerDone: string;
    headerTopic: string;
    headerStatus: string;
    topicLabel: string;
    topicPlaceholder: string;
    shortsTopicPlaceholder: string;
    status: Record<VideoStatus, string>;
    channelsBtn: string;
    channelsTitle: string;
    createNewChannel: string;
    switchChannel: string;
    deleteChannel: string;
    confirmDeleteChannel: string;
    importExportTitle: string;
    importExportDesc: string;
    copyCode: string;
    pasteCode: string;
    loadCodeBtn: string;
    codeCopied: string;
    invalidCode: string;
    noChannels: string;
    platform: string;
    logout: string;
  };
};

export const translations: Translations = {
  en: {
    appTitle: "PostarTube",
    configTitle: "Configuration",
    channelName: "Profile Name",
    channelPlaceholder: "e.g. Daily Tech Tips",
    format: "Content Type",
    longVideo: "Long/Post",
    shorts: "Shorts/Reels",
    videosPerDay: "Posts Per Day",
    slots: "slots",
    shortsHint: "Great for high volume.",
    longHint: "Standard detailed content.",
    firstVideo: "Start Time",
    lastVideo: "End Time",
    generateBtn: "Generate (Randomized)",
    generateHint: "Generates random times within range.",
    statsCompletion: "Completion",
    statsReady: "Ready/Published",
    statsEdit: "In Edit",
    statsProd: "Production",
    exportCsv: "Export Excel (CSV)",
    exportTxt: "Export Text",
    clearAll: "Clear Day",
    confirmClear: "Clear all slots for this day?",
    confirmHighVolume: "High volume detected. Continue?",
    endTimeError: "End time must be after start time",
    aiCoachTitle: "AI Coach",
    aiCoachDesc: "Ready to analyze your schedule?",
    aiCoachBtn: "Analyze Flow",
    aiCoachBtnActive: "Refresh Analysis",
    shortsModeTitle: "High Volume Mode",
    shortsModeDesc: "Checklist layout optimized for quantity.",
    noScheduleTitle: "No schedule for this day.",
    noScheduleDesc: "Configure and click Generate to start planning.",
    headerTime: "Time",
    headerDone: "Done",
    headerTopic: "Topic",
    headerStatus: "Status",
    topicLabel: "Topic / Concept",
    topicPlaceholder: "e.g., Minecraft Survival Ep. 1",
    shortsTopicPlaceholder: "Post Idea...",
    status: {
      [VideoStatus.PLANNING]: "Planning",
      [VideoStatus.SCRIPTING]: "Scripting",
      [VideoStatus.FILMING]: "Filming",
      [VideoStatus.EDITING]: "Editing",
      [VideoStatus.REVIEW]: "Review",
      [VideoStatus.READY]: "Ready",
      [VideoStatus.PUBLISHED]: "Published",
    },
    channelsBtn: "Profiles",
    channelsTitle: "My Profiles",
    createNewChannel: "Add New Profile",
    switchChannel: "Switch",
    deleteChannel: "Delete",
    confirmDeleteChannel: "Delete this profile and all its schedules?",
    importExportTitle: "Settings",
    importExportDesc: "Manage your account settings here.",
    copyCode: "Copy Access Code",
    pasteCode: "Paste Access Code here...",
    loadCodeBtn: "Load Data",
    codeCopied: "Copied!",
    invalidCode: "Invalid code.",
    noChannels: "No profiles found.",
    platform: "Platform",
    logout: "Logout"
  },
  pt: {
    appTitle: "PostarTube",
    configTitle: "Configuração",
    channelName: "Nome do Perfil",
    channelPlaceholder: "ex: Dicas de Tech",
    format: "Tipo de Conteúdo",
    longVideo: "Longo/Post",
    shorts: "Shorts/Reels",
    videosPerDay: "Posts por Dia",
    slots: "espaços",
    shortsHint: "Ideal para alto volume.",
    longHint: "Conteúdo detalhado padrão.",
    firstVideo: "Início",
    lastVideo: "Fim",
    generateBtn: "Gerar (Aleatório)",
    generateHint: "Gera horários aleatórios no intervalo.",
    statsCompletion: "Conclusão",
    statsReady: "Pronto/Postado",
    statsEdit: "Editando",
    statsProd: "Produção",
    exportCsv: "Exportar Excel (CSV)",
    exportTxt: "Exportar Texto",
    clearAll: "Limpar Dia",
    confirmClear: "Limpar todos os agendamentos deste dia?",
    confirmHighVolume: "Alto volume detectado. Continuar?",
    endTimeError: "Horário final deve ser após o inicial",
    aiCoachTitle: "Treinador IA",
    aiCoachDesc: "Pronto para analisar seu cronograma?",
    aiCoachBtn: "Analisar Fluxo",
    aiCoachBtnActive: "Atualizar Análise",
    shortsModeTitle: "Modo Alto Volume",
    shortsModeDesc: "Layout checklist otimizado para quantidade.",
    noScheduleTitle: "Sem agendamentos hoje.",
    noScheduleDesc: "Configure e clique em Gerar.",
    headerTime: "Hora",
    headerDone: "Ok",
    headerTopic: "Tópico",
    headerStatus: "Status",
    topicLabel: "Tópico / Conceito",
    topicPlaceholder: "ex: Minecraft Sobrevivência Ep. 1",
    shortsTopicPlaceholder: "Ideia do Post...",
    status: {
      [VideoStatus.PLANNING]: "Planejando",
      [VideoStatus.SCRIPTING]: "Roteiro",
      [VideoStatus.FILMING]: "Gravando",
      [VideoStatus.EDITING]: "Editando",
      [VideoStatus.REVIEW]: "Revisão",
      [VideoStatus.READY]: "Pronto",
      [VideoStatus.PUBLISHED]: "Publicado",
    },
    channelsBtn: "Perfis",
    channelsTitle: "Meus Perfis",
    createNewChannel: "Adicionar Perfil",
    switchChannel: "Trocar",
    deleteChannel: "Excluir",
    confirmDeleteChannel: "Excluir este perfil e todos os agendamentos?",
    importExportTitle: "Ajustes",
    importExportDesc: "Gerencie sua conta aqui.",
    copyCode: "Copiar Código",
    pasteCode: "Colar Código...",
    loadCodeBtn: "Carregar",
    codeCopied: "Copiado!",
    invalidCode: "Código inválido.",
    noChannels: "Nenhum perfil encontrado.",
    platform: "Plataforma",
    logout: "Sair"
  },
  es: {
    appTitle: "PostarTube",
    configTitle: "Configuración",
    channelName: "Nombre del Perfil",
    channelPlaceholder: "ej. Tips de Tecnología",
    format: "Tipo de Contenido",
    longVideo: "Largo/Post",
    shorts: "Shorts/Reels",
    videosPerDay: "Posts por Día",
    slots: "espacios",
    shortsHint: "Ideal para alto volumen.",
    longHint: "Contenido detallado estándar.",
    firstVideo: "Inicio",
    lastVideo: "Fin",
    generateBtn: "Generar (Aleatorio)",
    generateHint: "Genera horarios aleatorios en el rango.",
    statsCompletion: "Completado",
    statsReady: "Listo/Publicado",
    statsEdit: "Editando",
    statsProd: "Producción",
    exportCsv: "Exportar Excel (CSV)",
    exportTxt: "Exportar Texto",
    clearAll: "Limpiar Día",
    confirmClear: "¿Limpiar todo el día?",
    confirmHighVolume: "Alto volumen detectado. ¿Continuar?",
    endTimeError: "La hora final debe ser después de la inicial",
    aiCoachTitle: "Entrenador IA",
    aiCoachDesc: "¿Listo para analizar tu horario?",
    aiCoachBtn: "Analizar Flujo",
    aiCoachBtnActive: "Actualizar Análisis",
    shortsModeTitle: "Modo Alto Volumen",
    shortsModeDesc: "Lista optimizada para cantidad.",
    noScheduleTitle: "Sin agenda hoy.",
    noScheduleDesc: "Configura y haz clic en Generar.",
    headerTime: "Hora",
    headerDone: "Ok",
    headerTopic: "Tema",
    headerStatus: "Estado",
    topicLabel: "Tema / Concepto",
    topicPlaceholder: "ej. Minecraft Supervivencia Ep. 1",
    shortsTopicPlaceholder: "Idea del Post...",
    status: {
      [VideoStatus.PLANNING]: "Planeando",
      [VideoStatus.SCRIPTING]: "Guion",
      [VideoStatus.FILMING]: "Grabando",
      [VideoStatus.EDITING]: "Editando",
      [VideoStatus.REVIEW]: "Revisión",
      [VideoStatus.READY]: "Listo",
      [VideoStatus.PUBLISHED]: "Publicado",
    },
    channelsBtn: "Perfiles",
    channelsTitle: "Mis Perfiles",
    createNewChannel: "Nuevo Perfil",
    switchChannel: "Cambiar",
    deleteChannel: "Eliminar",
    confirmDeleteChannel: "¿Eliminar perfil y agenda?",
    importExportTitle: "Ajustes",
    importExportDesc: "Gestiona tu cuenta.",
    copyCode: "Copiar Código",
    pasteCode: "Pegar Código...",
    loadCodeBtn: "Cargar",
    codeCopied: "¡Copiado!",
    invalidCode: "Inválido.",
    noChannels: "Sin perfiles.",
    platform: "Plataforma",
    logout: "Cerrar Sesión"
  }
};