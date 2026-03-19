import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

export interface TableColumn<T> {
  field: keyof T;
  headerName: string;
  render?: (row: T) => React.ReactNode;
}

interface Props<T> {
  columns: TableColumn<T>[];
  rows: T[];
  getRowId: (row: T) => string | number;
}

export default function ReusableTable<T>({
  columns,
  rows,
  getRowId,
}: Props<T>) {
  return (
    <TableContainer
      component={Paper}
      sx={{ borderRadius: 3, boxShadow: "none" }}
    >
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={String(col.field)}>{col.headerName}</TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((row) => (
            <TableRow key={getRowId(row)} hover>
              {columns.map((col) => (
                <TableCell key={String(col.field)}>
                  {col.render
                    ? col.render(row)
                    : (row[col.field] as React.ReactNode)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
