import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

export class Base64Utils {
  static base64ToFile(base64String: string) {
    const commaIndex = base64String.indexOf(',') + 1;
    const base64Data = base64String.substring(commaIndex);
    const buffer = Buffer.from(base64Data, 'base64');
    const fileName = uuidv4();
    const tempDir = os.tmpdir();
    const filePath = path.join(tempDir, fileName);
    fs.writeFileSync(filePath, buffer);
    return filePath;
  }

  static base64FileExtension(base64String: string) {
    const partes = base64String.split(';');
    if (partes.length > 0) {
      const tipoArchivo = partes[0].replace('data:', '').replace('base64,', '');

      const tipoPartes = tipoArchivo.split('/');
      if (tipoPartes.length === 2) {
        return tipoPartes[1];
      }
    }

    throw new Error('No se detectó el tipo de archivo');
  }
}
