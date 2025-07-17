// L1 - Tax Types
export enum TaxType {
  IVA = "01", // Impuesto sobre el Valor Añadido
  IPSI = "02", // Impuesto sobre la Producción, los Servicios y la Importación
  IGIC = "03", // Impuesto General Indirecto Canario
  OTROS = "05", // Otros
}

// L2 - Invoice Types
export enum InvoiceType {
  FACTURA = "F1", // Factura (art. 6, 7.2 y 7.3 del RD 1619/2012)
  FACTURA_SIMPLIFICADA = "F2", // Factura Simplificada
  FACTURA_SUSTITUCION = "F3", // Factura emitida en sustitución
  RECTIFICATIVA_1 = "R1", // Error fundado en derecho y Art. 80 Uno Dos y Seis LIVA
  RECTIFICATIVA_2 = "R2", // Art. 80.3
  RECTIFICATIVA_3 = "R3", // Art. 80.4
  RECTIFICATIVA_4 = "R4", // Resto
  RECTIFICATIVA_5 = "R5", // Factura Rectificativa en facturas simplificadas
}

// L3 - Substitution Types
export enum SubstitutionType {
  SUSTITUCION = "S", // Por sustitución
  DIFERENCIAS = "I", // Por diferencias
}

// L4/L5 - Common Yes/No flags
export enum YesNo {
  YES = "S",
  NO = "N",
}
// L6 - Entity Types
export enum EntityType {
  DESTINATARIO = "D", // Destinatario
  TERCERO = "T", // Tercero
}
// L7 - ID Types
export enum IDType {
  NIF_IVA = "02", // NIF-IVA
  PASAPORTE = "03", // Pasaporte
  DOC_OFICIAL = "04", // Documento oficial de identificación
  CERT_RESIDENCIA = "05", // Certificado de residencia
  OTRO_DOC = "06", // Otro documento probatorio
  NO_CENSADO = "07", // No censado
}
// L8A - IVA Regime Types
export enum IVARegimeType {
  REGIMEN_GENERAL = "01",
  EXPORTACION = "02",
  BIENES_USADOS = "03",
  ORO_INVERSION = "04",
  AGENCIAS_VIAJES = "05",
  GRUPO_ENTIDADES = "06",
  CRITERIO_CAJA = "07",
  IPSI_IGIC = "08",
  // ... (other values)
}
// L9 - Operation Types
export enum OperationType {
  SUJETA_NO_EXENTA = "S1",
  SUJETA_NO_EXENTA_INV = "S2",
  NO_SUJETA_ART = "N1",
  NO_SUJETA_LOC = "N2",
}

// L10 - Exemption Types
export enum ExemptionType {
  ART_20 = "E1",
  ART_21 = "E2",
  ART_22 = "E3",
  ART_23_24 = "E4",
  ART_25 = "E5",
  OTROS = "E6",
}
// L12 - Hash Algorithm Types
export enum HashAlgorithmType {
  SHA_256 = "01",
}
// L16 - Invoice Generator Types
export enum InvoiceGeneratorType {
  EXPEDIDOR = "E",
  DESTINATARIO = "D",
  TERCERO = "T",
}
// L1E - Anomaly Types
export enum AnomalyType {
  INTEGRIDAD_HUELLA = "01",
  INTEGRIDAD_FIRMA = "02",
  INTEGRIDAD_OTROS = "03",
  TRAZABILIDAD_CADENA_REGISTRO_NO_PRIMERO = "04",
  TRAZABILIDAD_CADENA_REGISTRO_NO_ULTIMO = "05",
  TRAZABILIDAD_CADENA_REGISTRO_OTROS = "06",
  // ... other anomaly types
  OTROS = "90",
}
// L2E - Event Types
export enum EventType {
  INICIO_NO_VERIFACTU = "01",
  FIN_NO_VERIFACTU = "02",
  LANZAMIENTO_DETECCION_ANOMALIAS = "03",
  DETECCION_ANOMALIAS_INTEGRIDAD = "04",
  LANZAMIENTO_DETECCION_ANOMALIAS_EVENTO = "05",
  DETECCION_ANOMALIAS_EVENTO = "06",
  RESTAURACION_COPIA = "07",
  EXPORTACION_REGISTROS = "08",
  EXPORTACION_EVENTOS = "09",
  REGISTRO_RESUMEN = "10",
  OTROS = "90",
}

export interface ObligadoEmision {
  nombreRazon: string; // Max length 120
  nif: string; // Length 9
}

// Interfaces for Representante (Representative)
export interface Representante {
  nombreRazon: string; // Max length 120
  nif: string; // Length 9
}

// Interfaces for RemisionVoluntaria (Voluntary Submission)
export interface RemisionVoluntaria {
  fechaFinVeriFactu?: string;
  incidencia?: YesNo; // Using YesNo enum instead of YesNo
}

// Interfaces for RemisionRequerimiento (Requirement Submission)
export interface RemisionRequerimiento {
  refRequerimiento: string;
  finRequerimiento?: YesNo; // Using YesNo enum
}

// Interface for Cabecera (Header)
export interface Cabecera {
  obligadoEmision: ObligadoEmision;
  representante?: Representante;
  remisionVoluntaria?: RemisionVoluntaria;
  remisionRequerimiento?: RemisionRequerimiento;
}

// Interfaces for RegistroAlta sub-structures
interface IDFactura {
  idEmisorFactura: string; // FormatoNIF (9)
  numSerieFactura: string; // Alfanumérico (60)
  fechaExpedicionFactura: string; // Fecha (dd-mm-yyyy)
}

interface IDOtro {
  codigoPais: string; // Alfanumérico (2) ISO 3166-1 alpha-2
  idType: string; // Alfanumérico (2)
  id: string; // Alfanumérico (20)
}

interface Tercero {
  nombreRazon: string; // Alfanumérico (120)
  nif: string; // FormatoNIF (9)
  idOtro?: IDOtro;
}

interface IDDestinatario {
  nombreRazon: string; // Alfanumérico (120)
  nif?: string; // FormatoNIF (9)
  idOtro?: IDOtro;
}

interface DetalleDesglose {
  impuesto?: TaxType; // Using TaxType enum instead of string
  claveRegimen: IVARegimeType; // Using IVARegimeType enum
  calificacionOperacion: OperationType; // Using OperationType enum
  operacionExenta?: string; // Alfanumérico (2)
  tipoImpositivo?: number; // Decimal (3,2)
  baseImponibleOimporteNoSujeto: number; // Decimal (12,2)
  baseImponibleACoste?: number; // Decimal (12,2)
  cuotaRepercutida?: number; // Decimal (12,2)
  tipoRecargoEquivalencia?: number; // Decimal (3,2)
  cuotaRecargoEquivalencia?: number; // Decimal (12,2)
}

interface RegistroAnterior extends IDFactura {
  huella: string; // Alfanumérico (64)
}

interface ImporteRectificacion {
  baseRectificada: number; // Decimal (12,2)
  cuotaRectificada: number; // Decimal (12,2)
  cuotaRecargoRectificado?: number; // Decimal (12,2)
}

export interface SistemaInformatico {
  nombreRazon: string; // Alfanumérico (120)
  nif: string; // FormatoNIF (9)
  idOtro?: IDOtro;
  nombreSistemaInformatico: string; // Alfanumérico (30)
  idSistemaInformatico: string; // Alfanumérico (2)
  version: string; // Alfanumérico (50)
  numeroInstalacion: string; // Alfanumérico (100)
  tipoUsoPosibleSoloVerifactu?: YesNo; // Alfanumérico (1)
  tipoUsoPosibleMultiOT?: YesNo; // Alfanumérico (1)
  indicadorMultiplesOT?: YesNo; // Alfanumérico (1)
}

export interface RegistroAlta {
  idVersion: string; // Alfanumérico (3)
  idFactura: IDFactura;
  refExterna?: string; // Alfanumérico (60)
  nombreRazonEmisor: string; // Alfanumérico (120)
  subsanacion?: YesNo; // Default "N"
  rechazoPrevio?: YesNo; // Default "N"
  tipoFactura: InvoiceType; // Alfanumérico (2)
  tipoRectificativa?: string; // Alfanumérico (1)
  facturasRectificadas?: IDFactura[]; // Array 1-1000
  facturasSustituidas?: IDFactura[]; // Array 1-1000
  importeRectificacion?: ImporteRectificacion;
  fechaOperacion?: string; // Fecha (dd-mm-yyyy)
  descripcionOperacion: string; // Alfanumérico (500)
  facturaSimplificadaArt7273?: YesNo; // Default "N"
  facturaSinIdentifDestinatarioArt61d?: YesNo; // Default "N"
  macrodato?: YesNo; // Default "N"
  emitidaPorTerceroODestinatario?: EntityType; // Alfanumérico (1)
  tercero?: Tercero;
  destinatarios?: IDDestinatario[]; // Array 1-1000
  cupon?: YesNo; // Default "N"
  desglose: DetalleDesglose[]; // Array 1-12
  cuotaTotal: number; // Decimal (12,2)
  importeTotal: number; // Decimal (12,2)
  encadenamiento: {
    primerRegistro: YesNo; // If true, registroAnterior is not required
    registroAnterior: RegistroAnterior;
  };
  sistemaInformatico: SistemaInformatico; // Reference to SistemaInformatico block
  fechaHoraHusoGenRegistro: string; // DateTime ISO 8601
  numRegistroAcuerdoFacturacion?: string; // Alfanumérico (15)
  idAcuerdoSistemaInformatico?: string; // Alfanumérico (16)
  tipoHuella: string; // Alfanumérico (2)
  huella: string; // Alfanumérico (64)
  signature?: string; // XML Signature
}

// Interface for IDFacturaAnulada
interface IDFacturaAnulada {
  idEmisorFacturaAnulada: string; // FormatoNIF (9)
  numSerieFacturaAnulada: string; // Alfanumérico (60)
  fechaExpedicionFacturaAnulada: string; // Fecha (dd-mm-yyyy)
}

// Interface for Generador
interface Generador {
  nombreRazon: string; // Alfanumérico (120)
  nif?: string; // FormatoNIF (9)
  idOtro?: IDOtro;
}

export interface RegistroAnulacion {
  idVersion: string; // Alfanumérico (3)
  idFactura: IDFacturaAnulada;
  refExterna?: string; // Alfanumérico (60)
  sinRegistroPrevio?: YesNo; // Default "N"
  rechazoPrevio?: YesNo; // Default "N"
  generadoPor?: string; // Alfanumérico (1)
  generador?: Generador;
  encadenamiento: {
    primerRegistro?: "S"; // If true, registroAnterior is not required
    registroAnterior?: RegistroAnterior;
  };
  sistemaInformatico: string; // Reference to SistemaInformatico block
  fechaHoraHusoGenRegistro: string; // DateTime ISO 8601
  tipoHuella: string; // Alfanumérico (2)
  huella: string; // Alfanumérico (64)
  signature?: string; // XML Signature
}

export interface RegistroFactura {
  registroAlta: RegistroAlta;
  registroAnulacion: RegistroAnulacion;
}

// Interfaces for RegistroEvento
interface ObligadoEmisionEvento {
  nombreRazon: string; // Alfanumérico (120)
  nif: string; // FormatoNIF (9)
}

interface TerceroODestinatario {
  nombreRazon: string; // Alfanumérico (120)
  nif: string; // FormatoNIF (9)
  idOtro?: IDOtro;
}

interface RegistroFacturacionPeriodo {
  idEmisorFactura: string; // FormatoNIF (9)
  numSerieFactura: string; // Alfanumérico (60)
  fechaExpedicionFactura: string; // Fecha (dd-mm-yyyy)
  huella: string; // Alfanumérico (64)
}

interface RegistroEventoPeriodo {
  tipoEvento: string; // Alfanumérico (2)
  fechaHoraHusoEvento: string; // DateTime ISO 8601
  huellaEvento: string; // Alfanumérico (64)
}

interface ProcesoDeteccionAnomalias {
  realizadoProcesoSobreIntegridadHuellas: YesNo;
  numeroDeRegistrosProcesadosSobreIntegridadHuellas?: number;
  realizadoProcesoSobreIntegridadFirmas: YesNo;
  numeroDeRegistrosProcesadosSobreIntegridadFirmas?: number;
  realizadoProcesoSobreTrazabilidadCadena: YesNo;
  numeroDeRegistrosProcesadosSobreTrazabilidadCadena?: number;
  realizadoProcesoSobreTrazabilidadFechas: YesNo;
  numeroDeRegistrosProcesadosSobreTrazabilidadFechas?: number;
}

interface DeteccionAnomalias {
  tipoAnomalia: AnomalyType; // Alfanumérico (2)
  otrosDatosAnomalia?: string; // Alfanumérico (100)
  registroFacturacionAnomalo?: {
    idEmisorFactura: string; // FormatoNIF (9)
    numSerieFactura: string; // Alfanumérico (60)
    fechaExpedicionFactura: string; // Fecha (dd-mm-yyyy)
  };
}

interface ExportacionPeriodo {
  fechaHoraHusoInicioPeriodoExport: string; // DateTime ISO 8601
  fechaHoraHusoFinPeriodoExport: string; // DateTime ISO 8601
  registroFacturacionInicial: RegistroFacturacionPeriodo;
  registroFacturacionFinal: RegistroFacturacionPeriodo;
  numeroDeRegistrosFacturacionAltaExportados: number;
  sumaCuotaTotalAlta: number;
  sumaImporteTotalAlta: number;
  numeroDeRegistrosFacturacionAnulacionExportados: number;
  registrosFacturacionExportadosDejanDeConservarse: YesNo;
}

interface ExportacionEventoPeriodo {
  fechaHoraHusoInicioPeriodoExport: string;
  fechaHoraHusoFinPeriodoExport: string;
  registroEventoInicial: RegistroEventoPeriodo;
  registroEventoFinal: RegistroEventoPeriodo;
  numeroDeRegEventoExportados: number;
  regEventoExportadosDejanDeConservarse: YesNo;
}

interface ResumenEventosTipo {
  tipoEvento: string; // Alfanumérico (2)
  numeroDeEventos: number; // Numérico (4)
  registroFacturacionInicial: RegistroFacturacionPeriodo;
  registroFacturacionFinal: RegistroFacturacionPeriodo;
  numeroDeRegistrosFacturacionAltaGenerados: number;
  sumaCuotaTotalAlta: number;
  sumaImporteTotalAlta: number;
  numeroDeRegistrosFacturacionAnulacionGenerados: number;
}

interface EventoAnterior {
  tipoEvento: string; // Alfanumérico (2)
  fechaHoraHusoGenEvento: string; // DateTime ISO 8601
  huellaEvento: string; // Alfanumérico (64)
}

export interface RegistroEvento {
  idVersion: string; // Alfanumérico (3)
  evento: {
    sistemaInformatico: string;
    obligadoEmision: ObligadoEmisionEvento;
    emitidaPorTerceroODestinatario?: string; // Alfanumérico (1)
    terceroODestinatario?: TerceroODestinatario;
    fechaHoraHusoGenEvento: string; // DateTime ISO 8601
    tipoEvento: EventType; // Alfanumérico (2)
    datosPropiosEvento?: {
      lanzamientoProcesoDeteccionAnomaliasRegFacturacion?: ProcesoDeteccionAnomalias;
      deteccionAnomaliasRegFacturacion?: DeteccionAnomalias;
      lanzamientoProcesoDeteccionAnomaliasRegEvento?: ProcesoDeteccionAnomalias;
      deteccionAnomaliasRegEvento?: DeteccionAnomalias;
      exportacionRegFacturacionPeriodo?: ExportacionPeriodo;
      exportacionRegEventoPeriodo?: ExportacionEventoPeriodo;
      resumenEventos?: ResumenEventosTipo[];
    };
    otrosDatosEvento?: string; // Alfanumérico (100)
    encadenamiento: {
      primerEvento?: "S";
      eventoAnterior?: EventoAnterior;
    };
    tipoHuella: HashAlgorithmType; // Alfanumérico (2)
    huellaEvento: string; // Alfanumérico (64)
    signature?: string; // XML Signature
  };
}

// Main interface that represents the complete structure
export interface FacturacionData {
  cabecera: Cabecera;
  registrosFactura: RegistroFactura[]; // Array of 1-1000 records
}
