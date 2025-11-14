import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import theme from '../../themes/defaultTheme';

const CustomTable = ({ columns = [], rows = [], minWidth = 650 }) => {
  return (
    <TableContainer
      component={Paper}
      sx={{
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        borderRadius: '8px',
        maxHeight: '500px',
        overflow: 'scroll',
      }}
    >
      <Table sx={{ minWidth }} aria-label="custom table" stickyHeader>
        <TableHead>
          <TableRow>
            {columns.map((col, index) => (
              <TableCell
                key={index}
                align={col.align || 'left'}
                sx={{
                  fontWeight: 'bold',
                  backgroundColor: theme.palette.background.default,
                  color: '#333',
                  textTransform: 'capitalize',
                }}
              >
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.length > 0 ? (
            rows.map((row, rowIndex) => (
              <TableRow
                key={row.id || rowIndex}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                  '&:hover': { backgroundColor: '#fafafa' },
                }}
              >
                {columns.map((col, colIndex) => (
                  <TableCell key={colIndex} align={col.align || 'left'}>
                    {row[col.field]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} align="center">
                No hay datos disponibles
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CustomTable;
