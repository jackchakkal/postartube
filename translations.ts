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
    // New Channel Manager Translations
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
  };
};

export const translations: Translations = {
  en: {
    appTitle: "PostarTube",
    configTitle: "Configuration",
    channelName: "Channel Name",
    channelPlaceholder: "e.g. Daily Tech Tips",
    format: "Format",
    longVideo: "Long Video",
    shorts: "Shorts",
    videosPerDay: "Videos Per Day",
    slots: "slots",
    shortsHint: "Great for high volume (e.g., 90/day).",
    longHint: "Standard long-form content.",
    firstVideo: "First Video",
    lastVideo: "Last Video",
    generateBtn: "Generate Schedule",
    generateHint: "Preserves existing slots if times match.",
    statsCompletion: "Completion",
    statsReady: "Ready/Published",
    statsEdit: "In Edit",
    statsProd: "Production",
    exportCsv: "Export Excel (CSV)",
    exportTxt: "Export Text",
    clearAll: "Clear All",
    confirmClear: "Are you sure you want to clear all slots?",
    confirmHighVolume: "That is a lot of videos! Are you sure?",
    endTimeError: "End time must be after start time",
    aiCoachTitle: "AI Coach",
    aiCoachDesc: "Ready to analyze your schedule for optimization opportunities?",
    aiCoachBtn: "Analyze Flow",
    aiCoachBtnActive: "Refresh Analysis",
    shortsModeTitle: "High Volume Mode",
    shortsModeDesc: "Shorts mode uses a checklist layout optimized for managing quantity. AI generation is disabled.",
    noScheduleTitle: "No schedule generated yet.",
    noScheduleDesc: "Configure your settings and click Generate.",
    headerTime: "Time",
    headerDone: "Done",
    headerTopic: "Topic",
    headerStatus: "Status",
    topicLabel: "Topic / Concept",
    topicPlaceholder: "e.g., Minecraft Survival Ep. 1",
    shortsTopicPlaceholder: "Shorts Idea...",
    status: {
      [VideoStatus.PLANNING]: "Planning",
      [VideoStatus.SCRIPTING]: "Scripting",
      [VideoStatus.FILMING]: "Filming",
      [VideoStatus.EDITING]: "Editing",
      [VideoStatus.REVIEW]: "Review",
      [VideoStatus.READY]: "Ready",
      [VideoStatus.PUBLISHED]: "Published",
    },
    channelsBtn: "Channels",
    channelsTitle: "My Channels",
    createNewChannel: "Create New Channel",
    switchChannel: "Switch",
    deleteChannel: "Delete",
    confirmDeleteChannel: "Are you sure you want to delete this channel and all its data?",
    importExportTitle: "Cloud Sync / Backup",
    importExportDesc: "To access your channels on another device, copy this code and paste it there.",
    copyCode: "Copy Access Code",
    pasteCode: "Paste Access Code here...",
    loadCodeBtn: "Load Data (Login)",
    codeCopied: "Code copied to clipboard!",
    invalidCode: "Invalid code. Please check and try again.",
    noChannels: "No channels found. Create one!"
  },
  pt: {
    appTitle: "PostarTube",
    configTitle: "Configuração",
    channelName: "Nome do Canal",
    channelPlaceholder: "ex: Dicas de Tech",
    format: "Formato",
    longVideo: "Vídeo Longo",
    shorts: "Shorts",
    videosPerDay: "Vídeos por Dia",
    slots: "espaços",
    shortsHint: "Ideal para alto volume (ex: 90/dia).",
    longHint: "Conteúdo padrão de longa duração.",
    firstVideo: "Primeiro Vídeo",
    lastVideo: "Último Vídeo",
    generateBtn: "Gerar Cronograma",
    generateHint: "Preserva slots existentes se o horário bater.",
    statsCompletion: "Conclusão",
    statsReady: "Pronto/Postado",
    statsEdit: "Editando",
    statsProd: "Produção",
    exportCsv: "Exportar Excel (CSV)",
    exportTxt: "Exportar Texto",
    clearAll: "Limpar Tudo",
    confirmClear: "Tem certeza que deseja limpar todos os slots?",
    confirmHighVolume: "São muitos vídeos! Tem certeza?",
    endTimeError: "Horário final deve ser após o inicial",
    aiCoachTitle: "Treinador IA",
    aiCoachDesc: "Pronto para analisar seu cronograma e buscar melhorias?",
    aiCoachBtn: "Analisar Fluxo",
    aiCoachBtnActive: "Atualizar Análise",
    shortsModeTitle: "Modo Alto Volume",
    shortsModeDesc: "O modo Shorts usa um layout de checklist otimizado para quantidade. Geração de IA desativada.",
    noScheduleTitle: "Nenhum cronograma gerado.",
    noScheduleDesc: "Configure suas opções e clique em Gerar.",
    headerTime: "Hora",
    headerDone: "Ok",
    headerTopic: "Tópico",
    headerStatus: "Status",
    topicLabel: "Tópico / Conceito",
    topicPlaceholder: "ex: Minecraft Sobrevivência Ep. 1",
    shortsTopicPlaceholder: "Ideia do Short...",
    status: {
      [VideoStatus.PLANNING]: "Planejando",
      [VideoStatus.SCRIPTING]: "Roteiro",
      [VideoStatus.FILMING]: "Gravando",
      [VideoStatus.EDITING]: "Editando",
      [VideoStatus.REVIEW]: "Revisão",
      [VideoStatus.READY]: "Pronto",
      [VideoStatus.PUBLISHED]: "Publicado",
    },
    channelsBtn: "Canais",
    channelsTitle: "Meus Canais",
    createNewChannel: "Criar Novo Canal",
    switchChannel: "Trocar",
    deleteChannel: "Excluir",
    confirmDeleteChannel: "Tem certeza que deseja excluir este canal e todos os dados dele?",
    importExportTitle: "Sincronização / Backup",
    importExportDesc: "Para acessar seus canais em outro dispositivo, copie este código e cole lá.",
    copyCode: "Copiar Código de Acesso",
    pasteCode: "Cole o Código de Acesso aqui...",
    loadCodeBtn: "Carregar Dados (Login)",
    codeCopied: "Código copiado!",
    invalidCode: "Código inválido. Verifique e tente novamente.",
    noChannels: "Nenhum canal encontrado. Crie um!"
  },
  es: {
    appTitle: "PostarTube",
    configTitle: "Configuración",
    channelName: "Nombre del Canal",
    channelPlaceholder: "ej. Tips de Tecnología",
    format: "Formato",
    longVideo: "Video Largo",
    shorts: "Shorts",
    videosPerDay: "Videos por Día",
    slots: "espacios",
    shortsHint: "Ideal para alto volumen (ej. 90/día).",
    longHint: "Contenido estándar de larga duración.",
    firstVideo: "Primer Video",
    lastVideo: "Último Video",
    generateBtn: "Generar Horario",
    generateHint: "Preserva slots existentes si la hora coincide.",
    statsCompletion: "Completado",
    statsReady: "Listo/Publicado",
    statsEdit: "Editando",
    statsProd: "Producción",
    exportCsv: "Exportar Excel (CSV)",
    exportTxt: "Exportar Texto",
    clearAll: "Borrar Todo",
    confirmClear: "¿Estás seguro de querer borrar todo?",
    confirmHighVolume: "¡Son muchos videos! ¿Seguro?",
    endTimeError: "La hora final debe ser después de la inicial",
    aiCoachTitle: "Entrenador IA",
    aiCoachDesc: "¿Listo para analizar tu horario y optimizar?",
    aiCoachBtn: "Analizar Flujo",
    aiCoachBtnActive: "Actualizar Análisis",
    shortsModeTitle: "Modo Alto Volumen",
    shortsModeDesc: "El modo Shorts usa una lista optimizada para cantidad. Generación IA desactivada.",
    noScheduleTitle: "Sin horario generado.",
    noScheduleDesc: "Configura tus opciones y haz clic en Generar.",
    headerTime: "Hora",
    headerDone: "Ok",
    headerTopic: "Tema",
    headerStatus: "Estado",
    topicLabel: "Tema / Concepto",
    topicPlaceholder: "ej. Minecraft Supervivencia Ep. 1",
    shortsTopicPlaceholder: "Idea del Short...",
    status: {
      [VideoStatus.PLANNING]: "Planeando",
      [VideoStatus.SCRIPTING]: "Guion",
      [VideoStatus.FILMING]: "Grabando",
      [VideoStatus.EDITING]: "Editando",
      [VideoStatus.REVIEW]: "Revisión",
      [VideoStatus.READY]: "Listo",
      [VideoStatus.PUBLISHED]: "Publicado",
    },
    channelsBtn: "Canales",
    channelsTitle: "Mis Canales",
    createNewChannel: "Crear Nuevo Canal",
    switchChannel: "Cambiar",
    deleteChannel: "Eliminar",
    confirmDeleteChannel: "¿Estás seguro de que quieres eliminar este canal y todos sus datos?",
    importExportTitle: "Sincronización / Backup",
    importExportDesc: "Para acceder a tus canales en otro dispositivo, copia este código y pégalo allí.",
    copyCode: "Copiar Código de Acceso",
    pasteCode: "Pega el Código de Acceso aquí...",
    loadCodeBtn: "Cargar Datos (Login)",
    codeCopied: "¡Código copiado!",
    invalidCode: "Código inválido. Por favor verifica e intenta de nuevo.",
    noChannels: "No se encontraron canales. ¡Crea uno!"
  }
};