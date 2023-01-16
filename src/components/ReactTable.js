import PropTypes from 'prop-types';
import { Table, TableHead, TableBody, TableRow, TableCell, Box, Stack, Typography } from '@mui/material';
import { useTable, useFilters, usePagination } from 'react-table';
import { TablePagination } from 'components/third-party/ReactTable';

export default function ReactTable({ columns, data, top }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    // @ts-ignore
    page,
    prepareRow,
    // @ts-ignore
    gotoPage,
    // @ts-ignore
    setPageSize,
    // @ts-ignore
    state: { pageIndex, pageSize }
  } = useTable(
    {
      columns,
      data,
      // @ts-ignore
      initialState: { pageIndex: 0, pageSize: 5 }
    },
    useFilters,
    usePagination
  );

  return (
    <Stack>
      {top && (
        <Box sx={{ p: 2 }}>
          <TablePagination gotoPage={gotoPage} rows={rows} setPageSize={setPageSize} pageIndex={pageIndex} pageSize={pageSize} />
        </Box>
      )}

      <Table {...getTableProps()}>
        <TableHead sx={{ borderTopWidth: top ? 2 : 1 }}>
          {headerGroups.map((headerGroup, index) => (
            <TableRow key={index} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, i) => (
                <TableCell key={i} {...column.getHeaderProps([{ className: column.className }])}>
                  {column.render('Header')}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <TableRow key={i} {...row.getRowProps()}>
                {row.cells.map((cell, index) => (
                  <TableCell key={index} {...cell.getCellProps([{ className: cell.column.className }])} sx={{ p: 0.5 }}>
                    {cell.render('Cell')}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
          {page?.length === 0 && (
            <TableRow>
              <TableCell colSpan={30}>
                <Typography sx={{ textAlign: 'center' }}>Nothing to show</Typography>
              </TableCell>
            </TableRow>
          )}
          {!top && (
            <TableRow>
              <TableCell sx={{ p: 2 }} colSpan={30}>
                <TablePagination gotoPage={gotoPage} rows={rows} setPageSize={setPageSize} pageIndex={pageIndex} pageSize={pageSize} />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Stack>
  );
}

ReactTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  top: PropTypes.bool
};
