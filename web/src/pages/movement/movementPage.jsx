import { useCallback, useState, useEffect } from 'react';

import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { FaSearch, FaSave } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { MdNavigateNext, MdNavigateBefore, MdCleaningServices } from 'react-icons/md';
import { toast } from 'react-toastify';

import { movementService } from '../../services/movementsService';
import { roleService } from '../../services/roleService';

import CustomTextField from '../../components/CustomTextField';
import CustomSelect from '../../components/CustomSelect';
import CustomDatePicker from '../../components/CustomDatePicker';
import ConfirmDialog from '../../components/ConfirmDialog';
import {
  BorderBottomContainer,
  FormContainer,
  MainBox,
  ContainerBox,
} from '../../components/StyledComponents';
import {
  CATALOG_ERROR,
  ERROR_SAVE,
  FOUND_VALUES,
  IS_REQUIRED,
  NO_FOUND_VALUES,
  SUCCESS_INSERT,
  SUCCESS_UPDATE,
  OVERWRITE_DIALOG_TITLE,
  OVERWRITE_DIALOG_TEXT,
  INVALID_HOURS,
  ZERO_DELIVERIES_DIALOG_TEXT,
  ZERO_DELIVERIES_DIALOG_TITLE,
} from '../../config/messages';
import RolesEnum from '../../enums/RolesEnum';

const INITIAL_FORM_STATE = {
  EmployeeID: null,
  EmployeeCode: '',
  FullName: '',
  RoleID: '',
  RoleName: '',
  EmployeeTypeID: '',
  EmployeeTypeName: '',
  Date: new Date().toISOString().split('T')[0],
  HoursWorked: '8.00',
  DeliveriesCount: '0',
  IsCoveringShift: false,
  CoveringRoleID: '',
};
const INITIAL_ERRORS_STATE = {
  Date: false,
  HoursWorked: false,
  DeliveriesCount: false,
  CoveringRoleID: false,
};
const DIALOG_TYPES = {
  OVERWRITE: 'overwrite',
  ZERO_DELIVERIES: 'zeroDeliveries',
};

const MovementPage = () => {
  const [isFormDisabled, setIsFormDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState(null);
  const [errors, setErrors] = useState(INITIAL_ERRORS_STATE);

  // Form data
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  // Search results for navigation
  const [employeesFound, setEmployeesFound] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Catalog data
  const [roles, setRoles] = useState([]);
  const [catalogsLoading, setCatalogsLoading] = useState(true);

  // Check if employee is auxiliary (can cover shifts)
  const isAuxiliary = formData.RoleID === RolesEnum.AUXILIAR;

  // Reset form
  const resetForm = () => {
    setFormData(INITIAL_FORM_STATE);
    setErrors(INITIAL_ERRORS_STATE);
    setIsFormDisabled(true);
    setEmployeesFound([]);
    setCurrentIndex(0);
    setSearchValue('');
  };

  // Handle search
  const handleSearch = useCallback(async () => {
    const searchTxt = searchValue.trim();
    if (!searchTxt) return;
    setLoading(true);

    const employees = await movementService.search(searchTxt);
    const totalEmployees = employees.length;

    if (totalEmployees === 0) {
      toast.error(NO_FOUND_VALUES);
      resetForm();
      setLoading(false);
      return;
    }

    if (totalEmployees > 0) {
      setEmployeesFound(employees);
      setCurrentIndex(0);
      loadEmployeeData(employees[0]);

      if (totalEmployees > 1) {
        toast.info(FOUND_VALUES(totalEmployees, 'empleados'));
      }
    }
    setLoading(false);
  }, [searchValue]);

  // Load employee data into form
  const loadEmployeeData = (employee) => {
    const data = {
      EmployeeID: employee.ID,
      EmployeeCode: employee.EmployeeCode,
      FullName: employee.FullName,
      RoleID: String(employee.RoleID),
      RoleName: employee.Role?.Name || '',
      EmployeeTypeID: String(employee.EmployeeTypeID),
      EmployeeTypeName: employee.EmployeeType?.Name || '',
      Date: new Date().toISOString().split('T')[0],
      HoursWorked: '8.00',
      DeliveriesCount: '0',
      IsCoveringShift: false,
      CoveringRoleID: '',
    };

    setFormData(data);
    setIsFormDisabled(false);
    setErrors(INITIAL_ERRORS_STATE);
  };

  // Navigate between search results
  const handleNavigate = (direction) => {
    const newIndex =
      direction === 'next'
        ? Math.min(currentIndex + 1, employeesFound.length - 1)
        : Math.max(currentIndex - 1, 0);

    setCurrentIndex(newIndex);
    loadEmployeeData(employeesFound[newIndex]);
  };

  // Handle cancel
  const handleCancel = () => {
    resetForm();
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {
      Date: !formData.Date,
      HoursWorked: false,
      DeliveriesCount: false,
      CoveringRoleID: formData.IsCoveringShift && !formData.CoveringRoleID,
    };

    // Validate hours worked
    const hours = parseFloat(formData.HoursWorked);
    if (isNaN(hours) || hours < 0 || hours > 24) {
      newErrors.HoursWorked = true;
    }

    // Validate deliveries count
    const deliveries = parseInt(formData.DeliveriesCount);
    if (isNaN(deliveries) || deliveries < 0) {
      newErrors.DeliveriesCount = true;
    }

    setErrors(newErrors);

    return Object.values(newErrors).some((error) => error);
  };

  // Check if movement exists for this date
  const checkMovementExists = async () => {
    const checkData = {
      EmployeeID: formData.EmployeeID,
      Date: formData.Date,
    };

    const existsResponse = await movementService.checkExists(checkData);
    return existsResponse;
  };

  // Handle save
  // Handle save - Consolidated function
  const handleSave = async () => {
    if (validateForm()) return;

    setLoading(true);

    // Check if deliveries are zero
    const deliveries = parseInt(formData.DeliveriesCount);
    if (deliveries === 0) {
      setLoading(false);
      setDialogType(DIALOG_TYPES.ZERO_DELIVERIES);
      setOpenDialog(true);
      return;
    }

    // Check if movement exists for this date
    const existsResponse = await checkMovementExists();

    if (existsResponse.exists) {
      setLoading(false);
      setDialogType(DIALOG_TYPES.OVERWRITE);
      setOpenDialog(true);
      return;
    }

    // Proceed to save
    const dataToSend = {
      EmployeeID: formData.EmployeeID,
      Date: formData.Date,
      HoursWorked: parseFloat(formData.HoursWorked),
      DeliveriesCount: parseInt(formData.DeliveriesCount),
      CoveringRoleID: formData.IsCoveringShift ? parseInt(formData.CoveringRoleID) : null,
    };

    // Create new movement
    const result = await movementService.create(dataToSend);

    if (!result) {
      toast.error(ERROR_SAVE);
      setLoading(false);
      return;
    }

    toast.success(SUCCESS_INSERT('Movimiento'));

    // Reload form with same employee
    const currentEmployee = employeesFound[currentIndex];
    loadEmployeeData(currentEmployee);

    setLoading(false);
  };

  // Handle dialog confirm based on type
  const handleDialogConfirm = async () => {
    setLoading(true);
    setOpenDialog(false);

    if (dialogType === DIALOG_TYPES.ZERO_DELIVERIES) {
      const existsResponse = await checkMovementExists();

      if (existsResponse.exists) {
        setLoading(false);
        setDialogType(DIALOG_TYPES.OVERWRITE);
        setOpenDialog(true);
        return;
      }
    }

    // Prepare data
    const dataToSend = {
      EmployeeID: formData.EmployeeID,
      Date: formData.Date,
      HoursWorked: parseFloat(formData.HoursWorked),
      DeliveriesCount: parseInt(formData.DeliveriesCount),
      CoveringRoleID: formData.IsCoveringShift ? parseInt(formData.CoveringRoleID) : null,
    };

    // Check if we need to update or create
    const existsResponse = await checkMovementExists();

    if (existsResponse.exists) {
      // Update existing movement
      const result = await movementService.update(existsResponse.movement.ID, dataToSend);

      if (!result) {
        toast.error(ERROR_SAVE);
        setLoading(false);
        return;
      }

      toast.success(SUCCESS_UPDATE('Movimiento'));
      resetForm();
    } else {
      // Create new movement
      const result = await movementService.create(dataToSend);

      if (!result) {
        toast.error(ERROR_SAVE);
        setLoading(false);
        return;
      }

      toast.success(SUCCESS_INSERT('Movimiento'));
    }

    // Reload form with same employee
    const currentEmployee = employeesFound[currentIndex];
    loadEmployeeData(currentEmployee);

    setLoading(false);
  };

  // Handle dialog close
  const handleDialogClose = () => {
    setOpenDialog(false);
    setDialogType(null);
    setLoading(false);
  };

  // Get dialog content based on type
  const getDialogContent = () => {
    if (dialogType === DIALOG_TYPES.ZERO_DELIVERIES) {
      return {
        title: ZERO_DELIVERIES_DIALOG_TITLE,
        message: ZERO_DELIVERIES_DIALOG_TEXT(formData.FullName),
      };
    }
    if (dialogType === DIALOG_TYPES.OVERWRITE) {
      return {
        title: OVERWRITE_DIALOG_TITLE,
        message: OVERWRITE_DIALOG_TEXT(formData.FullName, formData.Date),
      };
    }
    return { title: '', message: '' };
  };

  // Handle input change
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: false }));
    }
  };

  // Handle checkbox change
  const handleCheckboxChange = (event) => {
    const isChecked = event.target.checked;
    setFormData((prev) => ({
      ...prev,
      IsCoveringShift: isChecked,
      CoveringRoleID: isChecked ? prev.CoveringRoleID : '',
    }));

    if (!isChecked && errors.CoveringRoleID) {
      setErrors((prev) => ({ ...prev, CoveringRoleID: false }));
    }
  };

  // Handle Enter key on search
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Load catalogs on component mount
  useEffect(() => {
    const loadCatalogs = async () => {
      setCatalogsLoading(true);

      const rolesData = await roleService.getAll();

      if (!rolesData) {
        toast.error(CATALOG_ERROR);
        setCatalogsLoading(false);
        return;
      }

      setRoles(
        rolesData.flatMap((role) => {
          if (role.ID === parseInt(RolesEnum.AUXILIAR, 10)) return [];

          return {
            value: String(role.ID),
            label: role.Name,
          };
        })
      );

      setCatalogsLoading(false);
    };

    loadCatalogs();
  }, []);

  if (catalogsLoading) {
    return (
      <MainBox>
        <CircularProgress />
      </MainBox>
    );
  }

  const dialogContent = getDialogContent();

  return (
    <MainBox>
      <ContainerBox>
        <BorderBottomContainer>
          <Typography variant="h4" sx={{ textAlign: 'start', fontWeight: 500 }}>
            Captura de Movimientos
          </Typography>
        </BorderBottomContainer>

        {/* Search bar */}
        <Box sx={{ display: 'flex', width: '100%', gap: 3 }}>
          <CustomTextField
            id="search"
            label="Buscar Empleado"
            placeholder="Búsqueda por código o nombre"
            icon={<FaSearch />}
            onIconClick={handleSearch}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyPress={handleSearchKeyPress}
            disabled={loading}
            fullWidth
          />
          <Button sx={{ maxHeight: '36px' }} variant="outlined" onClick={() => resetForm()}>
            <MdCleaningServices size={20} />
          </Button>
        </Box>

        {/* Form */}
        <FormContainer>
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            {loading ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '400px',
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <>
                <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column', padding: 2 }}>
                  {/* Employee Info Section */}
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: 2,
                    }}
                  >
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Typography sx={{ textAlign: 'start' }}>Código de empleado:</Typography>
                      <CustomTextField
                        id="employeeCode"
                        placeholder="Código de empleado"
                        value={formData.EmployeeCode}
                        disabled
                        fullWidth
                      />
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Typography sx={{ textAlign: 'start' }}>Nombre completo:</Typography>
                      <CustomTextField
                        id="fullName"
                        placeholder="Nombre completo"
                        value={formData.FullName}
                        disabled
                        fullWidth
                      />
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Typography sx={{ textAlign: 'start' }}>Rol:</Typography>
                      <CustomTextField
                        id="roleName"
                        placeholder="Rol"
                        value={formData.RoleName}
                        disabled
                        fullWidth
                      />
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Typography sx={{ textAlign: 'start' }}>Tipo de empleado:</Typography>
                      <CustomTextField
                        id="employeeTypeName"
                        placeholder="Tipo de empleado"
                        value={formData.EmployeeTypeName}
                        disabled
                        fullWidth
                      />
                    </Box>
                  </Box>

                  {/* Movement Data Section */}
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: 2,
                      marginTop: 2,
                    }}
                  >
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Typography sx={{ textAlign: 'start' }}>Fecha:</Typography>
                      <CustomDatePicker
                        id="date"
                        label="Fecha"
                        value={formData.Date}
                        onChange={(e) => handleInputChange('Date', e.target.value)}
                        disabled={isFormDisabled}
                        error={errors.Date}
                        helperText={errors.Date ? IS_REQUIRED : ''}
                        fullWidth
                      />
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Typography sx={{ textAlign: 'start' }}>Horas trabajadas:</Typography>
                      <CustomTextField
                        id="hoursWorked"
                        placeholder="8.00"
                        type="number"
                        value={formData.HoursWorked}
                        onChange={(e) => handleInputChange('HoursWorked', e.target.value)}
                        disabled={isFormDisabled}
                        error={errors.HoursWorked}
                        helperText={errors.HoursWorked ? INVALID_HOURS : ''}
                        fullWidth
                        inputProps={{ min: 0, max: 24, step: 0.5 }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Typography sx={{ textAlign: 'start' }}>Entregas:</Typography>
                      <CustomTextField
                        id="deliveriesCount"
                        placeholder="0"
                        type="number"
                        value={formData.DeliveriesCount}
                        onChange={(e) => handleInputChange('DeliveriesCount', e.target.value)}
                        disabled={isFormDisabled}
                        error={errors.DeliveriesCount}
                        helperText={errors.DeliveriesCount ? IS_REQUIRED : ''}
                        fullWidth
                        inputProps={{ min: 0 }}
                      />
                    </Box>
                  </Box>

                  {/* Covering Shift Section - Only for Auxiliaries */}
                  {isAuxiliary && (
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', marginTop: 2 }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.IsCoveringShift}
                            onChange={handleCheckboxChange}
                            disabled={isFormDisabled}
                          />
                        }
                        label="Cubrió turno"
                      />

                      {formData.IsCoveringShift && (
                        <Box sx={{ flex: 1, maxWidth: '300px' }}>
                          <CustomSelect
                            id="coveringRole"
                            placeholder="Selecciona el rol que cubrió"
                            value={formData.CoveringRoleID}
                            onChange={(e) => handleInputChange('CoveringRoleID', e.target.value)}
                            options={roles}
                            disabled={isFormDisabled}
                            error={errors.CoveringRoleID}
                            helperText={errors.CoveringRoleID ? IS_REQUIRED : ''}
                          />
                        </Box>
                      )}
                    </Box>
                  )}
                </Box>

                {/* Action Buttons */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2,
                    padding: 2,
                  }}
                >
                  {/* Navigation buttons */}
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {employeesFound.length > 1 && (
                      <>
                        <Button
                          variant="contained"
                          sx={{ maxHeight: '36px', minWidth: '100px' }}
                          startIcon={<MdNavigateBefore />}
                          onClick={() => handleNavigate('prev')}
                          disabled={currentIndex === 0 || loading}
                        >
                          Anterior
                        </Button>
                        <Button
                          variant="contained"
                          sx={{ maxHeight: '36px', minWidth: '100px' }}
                          endIcon={<MdNavigateNext />}
                          onClick={() => handleNavigate('next')}
                          disabled={currentIndex === employeesFound.length - 1 || loading}
                        >
                          Siguiente
                        </Button>
                        <Typography sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                          {currentIndex + 1} de {employeesFound.length}
                        </Typography>
                      </>
                    )}
                  </Box>

                  {/* Action buttons */}
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      sx={{
                        maxHeight: '36px',
                        minWidth: '120px',
                        background: '#1976d2',
                        '&:hover': {
                          background: '#115293',
                        },
                      }}
                      startIcon={<FaSave />}
                      onClick={handleSave}
                      disabled={loading || isFormDisabled || !formData.EmployeeID}
                    >
                      Guardar
                    </Button>
                    <Button
                      variant="contained"
                      sx={{
                        maxHeight: '36px',
                        minWidth: '120px',
                        background: '#CC1534',
                        '&:hover': {
                          background: '#ad122c',
                        },
                      }}
                      startIcon={<IoMdClose />}
                      onClick={handleCancel}
                      disabled={loading || isFormDisabled}
                    >
                      Cancelar
                    </Button>
                  </Box>
                </Box>
              </>
            )}
          </Box>
        </FormContainer>
      </ContainerBox>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={openDialog}
        onClose={handleDialogClose}
        onConfirm={handleDialogConfirm}
        title={dialogContent.title}
        message={dialogContent.message}
      />
    </MainBox>
  );
};

export default MovementPage;
