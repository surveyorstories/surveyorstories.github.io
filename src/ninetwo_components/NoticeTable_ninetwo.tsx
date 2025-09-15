import React from 'react';
import { decodeHTMLEntities } from '../lib/sanitize';

interface TableField {
  en: string;
  te: string;
  mappedIndex?: number;
}

interface NoticeTableProps {
  fields: TableField[];
  rows: string[][];
  hasSubdivision: boolean;
  isMerged: boolean;
}

const sanitizeData = (data: string): string => {
  const decodedData = decodeHTMLEntities(data);
  return decodedData.replace(/['"` ]/g, (match) => (match === ',' ? ',' : ''));
};

const NoticeTable: React.FC<NoticeTableProps> = React.memo(({ fields, rows, hasSubdivision, isMerged }) => {
  const rowSpans: Record<number, number> = {};
  let sortedRows = rows;

  if (!isMerged) {
    const lpmColumn = fields.find((field) => field.en === 'LPM Number');
    const lpmIndex = lpmColumn?.mappedIndex;

    sortedRows =
      lpmIndex !== undefined
        ? [...rows].sort((a, b) => (a[lpmIndex] || '').localeCompare(b[lpmIndex] || ''))
        : rows;

    if (lpmIndex !== undefined) {
      let groupStartIndex = 0;
      for (let i = 1; i <= sortedRows.length; i++) {
        if (
          i === sortedRows.length ||
          sortedRows[i][lpmIndex] !== sortedRows[groupStartIndex][lpmIndex]
        ) {
          const groupSize = i - groupStartIndex;
          if (groupSize > 1) {
            rowSpans[groupStartIndex] = groupSize;
            for (let j = 1; j < groupSize; j++) {
              rowSpans[groupStartIndex + j] = 0; // Mark as part of a span
            }
          }
          groupStartIndex = i;
        }
      }
    }
  }

  return (
    <div className="table-container table w-full overflow-x-auto">
      <table className="khata-table9 mt-2 w-full border-collapse">
        <thead>
          <tr className="font-gautami border border-black p-1 text-center align-middle font-bold">
            <th colSpan={1} scope="col" className="align-middle">
              ప్రస్తుత రీ సర్వే
            </th>
            <th colSpan={hasSubdivision ? 4 : 3} scope="col" className="align-middle">
              రికార్డ్స్ అఫ్ రైట్స్ ప్రకారం
            </th>
            <th colSpan={2} scope="col" className="align-middle">
              ప్రస్తుత రీ సర్వే ప్రకారము
            </th>
            <th rowSpan={3} scope="col" className="align-middle">
              రిమార్కులు
            </th>
          </tr>
          <tr className="font-gautami border border-black p-1 text-center align-middle font-bold">
            <th rowSpan={2} scope="col" className="align-middle">
              ల్యాండ్ పార్సెల్ నెంబర్
            </th>
            <th rowSpan={2} scope="col" className="align-middle">
              {hasSubdivision ? 'సర్వే నెంబరు' : 'సర్వే నెంబరు-సబ్ డివిజన్'}
            </th>
            {hasSubdivision && (
              <th rowSpan={2} scope="col" className="align-middle">
                సబ్ డివిజన్ నెం లేదా లెటర్
              </th>
            )}
            <th colSpan={2} scope="col" className="align-middle">
              విస్తీర్ణము
            </th>
            <th colSpan={2} scope="col" className="align-middle">
              విస్తీర్ణము
            </th>
          </tr>
          <tr className="font-gautami border border-black p-1 text-center align-middle font-bold">
            <th scope="col" className="align-middle">
              ఎ. సెంట్లు
            </th>
            <th scope="col" className="align-middle">
              హె.ఏర్లు. చ.మీ
            </th>
            <th scope="col" className="align-middle">
              ఎ. సెంట్లు
            </th>
            <th scope="col" className="align-middle">
              హె.ఏర్లు. చ.మీ
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedRows.map((row, rowIndex) => {
            const span = rowSpans[rowIndex];

            return (
              <tr key={`row-${rowIndex}`}>
                {fields.map((field) => {
                  if (isMerged) {
                    return (
                      <td
                        key={`cell-${rowIndex}-${field.en}`}
                        className="border border-black p-1 text-center align-middle"
                      >
                        {field.mappedIndex !== undefined && row[field.mappedIndex] !== undefined
                          ? sanitizeData(row[field.mappedIndex])
                          : ''}
                      </td>
                    );
                  }

                  const isLpmColumn = field.en === 'LPM Number';
                  const isResurveyAcresColumn = field.en === 'Resurvey extent (Acres)';
                  const isResurveyHectColumn = field.en === 'Resurvey extent (Hect)';
                  const shouldMerge = isLpmColumn || isResurveyAcresColumn || isResurveyHectColumn;

                  if (shouldMerge) {
                    if (span === 0) {
                      return null; // This cell is spanned over
                    }
                    return (
                      <td
                        key={`cell-${rowIndex}-${field.en}`}
                        rowSpan={span > 1 ? span : 1}
                        className="border border-black p-1 text-center align-middle"
                      >
                        {field.mappedIndex !== undefined && row[field.mappedIndex] !== undefined
                          ? sanitizeData(row[field.mappedIndex])
                          : ''}
                      </td>
                    );
                  }

                  return (
                    <td
                      key={`cell-${rowIndex}-${field.en}`}
                      className="border border-black p-1 text-center align-middle"
                    >
                      {field.mappedIndex !== undefined && row[field.mappedIndex] !== undefined
                        ? sanitizeData(row[field.mappedIndex])
                        : ''}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
});

export default NoticeTable;
