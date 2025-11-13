import { TextField } from '@mui/material';

const CustomDatePicker = ({
  id,
  label,
  value,
  onChange,
  disabled = false,
  error = false,
  helperText = '',
  fullWidth = false,
  ...props
}) => {
  return (
    <TextField
      id={id}
      label={label}
      type="date"
      value={value}
      onChange={onChange}
      disabled={disabled}
      error={error}
      helperText={helperText}
      fullWidth={fullWidth}
      size="small"
      InputLabelProps={{
        shrink: true,
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          padding: 0,
        },
      }}
      {...props}
    />
  );
};

export default CustomDatePicker;
