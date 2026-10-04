/**
 * Utilitários Oficiais para E-commerce Brasileiro (pt-BR)
 * Validações de CPF, máscaras de CEP e Telefone, Formatação de Moeda BRL
 * e Gerador de Payload Pix EMVCo (Padrão Banco Central do Brasil - BACEN)
 */

// 1. Formatação de Moeda Brasileira (R$)
export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

// 2. Validador Oficial de CPF (Algoritmo Módulo 11 da Receita Federal)
export function validateCPF(cpfRaw: string): boolean {
  const cpf = cpfRaw.replace(/\D/g, '');

  if (cpf.length !== 11) return false;

  // Rejeita CPFs com todos os dígitos iguais (ex: 111.111.111-11)
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  // Validação do 1º dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i), 10) * (10 - i);
  }
  let rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(cpf.charAt(9), 10)) return false;

  // Validação do 2º dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i), 10) * (11 - i);
  }
  rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(cpf.charAt(10), 10)) return false;

  return true;
}

// 3. Máscara de CPF: 000.000.000-00
export function maskCPF(value: string): string {
  return value
    .replace(/\D/g, '')
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

// 4. Máscara de CEP: 00000-000
export function maskCEP(value: string): string {
  return value
    .replace(/\D/g, '')
    .slice(0, 8)
    .replace(/(\d{5})(\d{1,3})$/, '$1-$2');
}

// 5. Máscara de Telefone/Celular com DDD: (00) 00000-0000
export function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 10) {
    return digits
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d{1,4})$/, '$1-$2');
  }
  return digits
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d{1,4})$/, '$1-$2');
}

// 6. Cálculo de Parcelas Brasileiras
export interface InstallmentOption {
  installments: number;
  installmentValue: number;
  totalValue: number;
  hasInterest: boolean;
  label: string;
}

export function calculateInstallments(amount: number, maxInstallments = 12): InstallmentOption[] {
  const options: InstallmentOption[] = [];
  const minInstallmentValue = 20.0; // Valor mínimo por parcela no Brasil

  for (let i = 1; i <= maxInstallments; i++) {
    if (i > 1 && amount / i < minInstallmentValue) {
      break;
    }

    // Até 6x sem juros; acima disso juros moderado de 1.99% a.m. se configurado, ou sem juros padrão
    const hasInterest = false; // Política padrão do lojista: até 12x sem juros para máxima conversão
    const totalValue = amount;
    const installmentValue = Number((totalValue / i).toFixed(2));

    options.push({
      installments: i,
      installmentValue,
      totalValue,
      hasInterest,
      label:
        i === 1
          ? `1x de ${formatBRL(amount)} à vista`
          : `${i}x de ${formatBRL(installmentValue)} sem juros`,
    });
  }

  return options;
}

// 7. Cálculo de CRC16-CCITT (Polinômio 0x1021) para Pix EMVCo
function crc16(str: string): string {
  let crc = 0xffff;
  const polynomial = 0x1021;

  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    crc ^= charCode << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ polynomial) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, '0');
}

function emvField(id: string, value: string): string {
  const len = value.length.toString().padStart(2, '0');
  return `${id}${len}${value}`;
}

export interface PixPayloadParams {
  key: string;
  name: string;
  city: string;
  amount: number;
  txid?: string;
  description?: string;
}

// 8. Gerador Oficial de Código Pix "Copia e Cola" (Padrão BACEN / EMVCo)
export function generatePixEMVCo({
  key,
  name,
  city,
  amount,
  txid = 'LOJA001',
  description = 'Compra Loja Virtual',
}: PixPayloadParams): { copiaECola: string; qrCodeUrl: string } {
  // Limpeza de caracteres especiais para padrão BACEN
  const cleanName = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .slice(0, 25);
  const cleanCity = city
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .slice(0, 15);
  const cleanTxid = txid.replace(/[^a-zA-Z0-9]/g, '').slice(0, 25) || '***';

  // Subcampos do Merchant Account Information (ID 26)
  const gui = emvField('00', 'br.gov.bcb.pix');
  const chave = emvField('01', key);
  const desc = description ? emvField('02', description.slice(0, 40)) : '';
  const merchantAccountInfo = emvField('26', `${gui}${chave}${desc}`);

  // Subcampos do Additional Data Field (ID 62)
  const txidField = emvField('05', cleanTxid);
  const additionalData = emvField('62', txidField);

  // Formato do valor com duas casas decimais
  const amountStr = amount.toFixed(2);

  // Montagem do payload EMVCo sem CRC
  const payloadWithoutCrc =
    emvField('00', '01') + // Format Indicator
    emvField('01', '12') + // Point of Initiation Method (12 = dinâmico / pontual)
    merchantAccountInfo +
    emvField('52', '0000') + // Merchant Category Code
    emvField('53', '986') + // Currency Code (986 = Real BRL)
    emvField('54', amountStr) + // Amount
    emvField('58', 'BR') + // Country Code
    emvField('59', cleanName) + // Merchant Name
    emvField('60', cleanCity) + // Merchant City
    additionalData +
    '6304'; // CRC Header

  // Adicionar o checksum CRC16
  const checksum = crc16(payloadWithoutCrc);
  const copiaECola = `${payloadWithoutCrc}${checksum}`;

  // Gerar URL do QR Code
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=10&data=${encodeURIComponent(
    copiaECola
  )}`;

  return { copiaECola, qrCodeUrl };
}
