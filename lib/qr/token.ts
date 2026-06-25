const QR_PREFIX = "NULLL:";

export function encodeMemberQrToken(token: string) {
  return `${QR_PREFIX}${token}`;
}

export function decodeMemberQrToken(value: string) {
  if (!value.startsWith(QR_PREFIX)) {
    return null;
  }

  const token = value.slice(QR_PREFIX.length).trim();
  return token.length > 0 ? token : null;
}

export { QR_PREFIX };
