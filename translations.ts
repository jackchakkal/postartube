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
    }
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
    }
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
    }
  }
};