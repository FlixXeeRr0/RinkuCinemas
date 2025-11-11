import { TextField, InputAdornment, IconButton } from '@mui/material';

const CustomTextField = ({
  id,
  label,
  placeholder,
  type = 'text',
  size = 'small',
  icon,
  onIconClick,
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
      InputProps={{
        endAdornment: icon ? (
          <InputAdornment position="end" sx={{ padding: 0 }}>
            <IconButton
              onClick={onIconClick}
              color="primary"
              sx={{ padding: 1 }}
            >
              {icon}
            </IconButton>
          </InputAdornment>
        ) : null,
      }}
      sx={{
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
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
