import React from "react";
import Pagination from "@mui/material/Pagination";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import { Typography } from "@mui/material";

interface CustomPaginationProps {
  count: number; // Total number of pages
  page: number; // Current page
  pageSize: number; // Current page size
  onPageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
  onPageSizeChange: (size: number) => void;
}

export const CustomPagination: React.FC<CustomPaginationProps> = ({
  count,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  return (
    <div className="flex justify-between items-center p-4 bg-gray-100 rounded-lg shadow-md w-full">
      <Typography variant="body2" className="text-lg font-medium">
        Page {page} of {count}
      </Typography>

      <FormControl className="min-w-[120px]">
        <InputLabel>Items per page</InputLabel>
        <Select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          label="Items per page"
        >
          {[5, 10, 15, 20].map((size) => (
            <MenuItem key={size} value={size}>
              {size}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Pagination
        count={count} // Total pages
        page={page}
        onChange={onPageChange}
        color="primary"
      />
    </div>
  );
};
