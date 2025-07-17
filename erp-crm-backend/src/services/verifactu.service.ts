import {
  RegistroFactura,
  YesNo,
  InvoiceType,
  TaxType,
  IVARegimeType,
  OperationType,
  HashAlgorithmType,
  InvoiceGeneratorType,
} from "../config/types/verifactu"; // Adjust the import path as needed

// Ejemplo de Alta de Registro
const ejemploAlta: RegistroFactura = {
  registroAlta: {
    idVersion: "1.0",
    idFactura: {
      idEmisorFactura: "B12345678", // NIF ejemplo
      numSerieFactura: "FACT2024-001",
      fechaExpedicionFactura: "14-02-2024",
    },
    nombreRazonEmisor: "Empresa Ejemplo S.L.",
    subsanacion: YesNo.NO,
    rechazoPrevio: YesNo.NO,
    tipoFactura: InvoiceType.FACTURA, // F1
    descripcionOperacion: "Venta de productos informáticos",
    facturaSimplificadaArt7273: YesNo.NO,
    facturaSinIdentifDestinatarioArt61d: YesNo.NO,
    macrodato: YesNo.NO,
    destinatarios: [
      {
        nombreRazon: "Cliente Ejemplo S.A.",
        nif: "A87654321",
      },
    ],
    desglose: [
      {
        impuesto: TaxType.IVA,
        claveRegimen: IVARegimeType.REGIMEN_GENERAL,
        calificacionOperacion: OperationType.SUJETA_NO_EXENTA,
        baseImponibleOimporteNoSujeto: 1000.0,
        tipoImpositivo: 21.0,
        cuotaRepercutida: 210.0,
      },
    ],
    cuotaTotal: 210.0,
    importeTotal: 1210.0,
    encadenamiento: {
      primerRegistro: "S",
    },
    sistemaInformatico: "SI001",
    fechaHoraHusoGenRegistro: "2024-02-14T10:30:00Z",
    tipoHuella: HashAlgorithmType.SHA_256,
    huella: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  },
};

// Ejemplo de Anulación de Registro
const ejemploAnulacion: RegistroFactura = {
  registroAnulacion: {
    idVersion: "1.0",
    idFactura: {
      idEmisorFacturaAnulada: "B12345678",
      numSerieFacturaAnulada: "FACT2024-001",
      fechaExpedicionFacturaAnulada: "14-02-2024",
    },
    refExterna: "ANUL2024-001",
    sinRegistroPrevio: YesNo.NO,
    rechazoPrevio: YesNo.NO,
    generadoPor: InvoiceGeneratorType.EXPEDIDOR,
    generador: {
      nombreRazon: "Empresa Ejemplo S.L.",
      nif: "B12345678",
    },
    encadenamiento: {
      primerRegistro: "S",
    },
    sistemaInformatico: "SI001",
    fechaHoraHusoGenRegistro: "2024-02-14T11:30:00Z",
    tipoHuella: HashAlgorithmType.SHA_256,
    huella: "f4b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  },
};

// Ejemplo de validación básica siguiendo el flujo del diagrama
function validarAlta(registro: RegistroFactura): boolean {
  if (!registro.registroAlta) return false;

  // Validar si es VERI*FACTU
  const esVerifactu = true; // Esto vendría de la configuración del sistema

  // Validar registro previo en AEAT
  if (
    registro.registroAlta.subsanacion === YesNo.NO &&
    registro.registroAlta.rechazoPrevio === YesNo.YES
  ) {
    return false; // No se admiten operaciones de alta con estos valores
  }

  return true;
}

function validarAnulacion(registro: RegistroFactura): boolean {
  if (!registro.registroAnulacion) return false;

  // Validar si existe registro previo cuando es requerido
  if (registro.registroAnulacion.sinRegistroPrevio === YesNo.NO) {
    // Aquí iría la lógica para verificar el registro previo
  }

  return true;
}

// Uso de los ejemplos:
console.log("Validación Alta:", validarAlta(ejemploAlta));
console.log("Validación Anulación:", validarAnulacion(ejemploAnulacion));
