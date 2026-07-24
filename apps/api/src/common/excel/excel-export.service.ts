import { Injectable } from '@nestjs/common';
import { CellValue, Workbook } from 'exceljs';

export interface ExcelColumn {
  header: string;
  key: string;
  width?: number;
}

// Mirrors legacy crudPlainController::excelAction()/generateSpreadSheet():
// bold title row, header row, one row per record — generic across entities.
@Injectable()
export class ExcelExportService {
  async build(title: string, columns: ExcelColumn[], rows: Record<string, unknown>[]): Promise<Buffer> {
    const workbook = new Workbook();
    const sheet = workbook.addWorksheet(title.substring(0, 31));

    sheet.mergeCells(1, 1, 1, columns.length);
    const titleCell = sheet.getCell(1, 1);
    titleCell.value = title;
    titleCell.font = { bold: true, size: 14 };

    sheet.getRow(3).values = columns.map((c) => c.header);
    sheet.getRow(3).font = { bold: true };
    sheet.columns = columns.map((c) => ({ key: c.key, width: c.width ?? 25 }));

    rows.forEach((row, i) => {
      sheet.getRow(4 + i).values = columns.map((c) => (row[c.key] ?? '') as CellValue);
    });

    return Buffer.from(await workbook.xlsx.writeBuffer());
  }
}
