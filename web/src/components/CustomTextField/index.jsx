import { TextField, InputAdornment, IconButton } from '@mui/material';

const CustomTextField = ({
  id,
  label,
  placeholder,
  type = 'text',
  size = 'small',
  icon,
  onIconClick,
  error = false,
  helperText = '',
  ...props
}) => {
  return (
    <TextField
      id={id}
      label={label}
      placeholder={placeholder}
      variant="outlined"
      type={type}
      size={size}
      error={error}
      helperText={helperText}
      InputProps={{
        endAdornment: icon ? (
          <InputAdornment position="end" sx={{ padding: 0 }}>
            <IconButton onClick={onIconClick} color="primary" sx={{ padding: 1 }}>
              {icon}
            </IconButton>
          </InputAdornment>
        ) : null,
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          padding: 0,
          minWidth: '200px',
        },
      }}
      {...props}
    />
  );
};

export default CustomTextField;
