import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
} from '@mui/material';

const CustomSelect = ({
  id,
  label,
  value,
  onChange,
  options = [],
  size = 'small',
  icon,
  onIconClick,
  placeholder,
  ...props
}) => {
  return (
    <FormControl
      size={size}
      sx={{
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        minWidth: '200px',
        '& .MuiOutlinedInput-root': {
          padding: 0,
        },
      }}
    >
      <InputLabel id={`${id}-label`}>{label}</InputLabel>
      <Select
        fullWidth
        labelId={`${id}-label`}
        id={id}
        value={value}
        onChange={onChange}
        label={label}
        displayEmpty
        renderValue={
          value !== ''
            ? (selected) => (
                <span style={{ textAlign: 'left', width: '100%', display: 'block' }}>
                  {options.find((opt) => opt.value === selected)?.label}
                </span>
              )
            : () => (
                <span
                  style={{
                    color: '#A5C5ED',
                    textAlign: 'left',
                    width: '100%',
                    display: 'block',
                  }}
                >
                  {placeholder}
                </span>
              )
        }
        sx={{
          textAlign: 'left',
          '& .MuiSelect-select': {
            textAlign: 'left',
          },
        }}
        endAdornment={
          icon ? (
            <InputAdornment position="end" sx={{ padding: 0 }}>
              <IconButton onClick={onIconClick} color="primary" sx={{ padding: 1 }}>
                {icon}
              </IconButton>
            </InputAdornment>
          ) : null
        }
        {...props}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value} sx={{ textAlign: 'left' }}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CustomSelect;
