import { useCallback, useState, useEffect } from 'react';

import { Box, Button, Typography, CircularProgress } from '@mui/material';
import { FaSearch, FaRegTrashAlt, FaSave } from 'react-icons/fa';
import { IoPersonAdd } from 'react-icons/io5';
import { CiEdit } from 'react-icons/ci';
import { IoMdClose } from 'react-icons/io';
import { MdNavigateNext, MdNavigateBefore } from 'react-icons/md';
import { toast } from 'react-toastify';

import { employeeService } from '../../services/employeeService';
import { roleService } from '../../services/roleService';
import { employeeTypeService } from '../../services/employeeTypeService';

import CustomTextField from '../../components/CustomTextField';
import CustomSelect from '../../components/CustomSelect';
import ConfirmDialog from '../../components/ConfirmDialog';
import {
  BorderBottomContainer,
  FormContainer,
  MainBox,
  ContainerBox,
} from '../../components/StyledComponents';
import {
  CATALOG_ERROR,
  DELETE_DIALOG_TEXT,
  DELETE_DIALOG_TITLE,
  ERROR_DELETE,
  ERROR_SAVE,
  FOUND_VALUES,
  IS_REQUIRED,
  NO_FOUND_VALUES,
  SUCCESS_DELETE,
  SUCCESS_INSERT,
  SUCCESS_UPDATE,
} from '../../config/messages';

const INITIAL_FORM_STATE = {
  ID: null,
  EmployeeCode: '',
  FullName: '',
  RoleID: '',
  EmployeeTypeID: '',
};
const INITIAL_ERRORS_STATE = {
  FullName: false,
  RoleID: false,
  EmployeeTypeID: false,
};

const EmployeePage = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isNewMode, setIsNewMode] = useState(false);
  const [isFormDisabled, setIsFormDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [errors, setErrors] = useState(INITIAL_ERRORS_STATE);

  // Form data
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  // Search results for navigation
  const [employeesFound, setEmployeesFound] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Original data for cancel
  const [originalData, setOriginalData] = useState(INITIAL_FORM_STATE);

  // Catalog data
  const [roles, setRoles] = useState([]);
  const [employeeTypes, setEmployeeTypes] = useState([]);
  const [catalogsLoading, setCatalogsLoading] = useState(true);

  // Reset form
  const resetForm = () => {
    setFormData(INITIAL_FORM_STATE);
    setOriginalData(INITIAL_FORM_STATE);
    setErrors(INITIAL_ERRORS_STATE);
    setIsEditMode(false);
    setIsNewMode(false);
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

    const employees = await employeeService.search(searchTxt);
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
      ID: employee.ID,
      EmployeeCode: employee.EmployeeCode,
      FullName: employee.FullName,
      RoleID: String(employee.RoleID),
      EmployeeTypeID: String(employee.EmployeeTypeID),
    };

    setFormData(data);
    setOriginalData(data);
    setIsFormDisabled(true);
    setIsEditMode(false);
    setIsNewMode(false);
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

  // Handle new employee
  const handleNewEmployee = () => {
    resetForm();
    setIsNewMode(true);
    setIsFormDisabled(false);
    setFormData({ ...INITIAL_FORM_STATE, EmployeeCode: 'Auto-generado' });
  };

  // Handle edit
  const handleEdit = () => {
    setIsEditMode(true);
    setIsFormDisabled(false);
  };

  // Handle cancel
  const handleCancel = () => {
    if (isNewMode) {
      resetForm();
    } else {
      setFormData(originalData);
      setErrors(INITIAL_ERRORS_STATE);
      setIsEditMode(false);
      setIsFormDisabled(true);
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {
      FullName: !formData.FullName.trim(),
      RoleID: !formData.RoleID,
      EmployeeTypeID: !formData.EmployeeTypeID,
    };

    setErrors(newErrors);

    return Object.values(newErrors).some((error) => error);
  };

  // Handle save
  const handleSave = async () => {
    if (validateForm()) return;

    setLoading(true);

    const checkData = {
      FullName: formData.FullName,
      excludeID: formData.ID,
    };

    const existsResponse = await employeeService.checkExists(checkData);

    if (existsResponse.exists) {
      toast.error(existsResponse.message);
      setLoading(false);
      return;
    }

    // Create or update
    const dataToSend = {
      FullName: formData.FullName,
      RoleID: parseInt(formData.RoleID),
      EmployeeTypeID: parseInt(formData.EmployeeTypeID),
    };

    let response;
    if (isNewMode) {
      response = await employeeService.create(dataToSend);
      if (response.code === 200) {
        toast.success(SUCCESS_INSERT('Empleado'));
        resetForm();
      }
    } else {
      response = await employeeService.update(formData.ID, dataToSend);
      if (response.code === 200) {
        toast.success(SUCCESS_UPDATE('Empleado'));

        // Reload employee data
        const updated = await employeeService.getById(formData.ID);
        loadEmployeeData(updated);
      }
    }

    if (response.code !== 200) {
      toast.error(ERROR_SAVE);
    }
    setLoading(false);
  };

  // Handle delete
  const handleDelete = async () => {
    setLoading(true);

    const result = await employeeService.delete(formData.ID);

    if (result.success) {
      toast.success(SUCCESS_DELETE('Empleado'));
      resetForm();
    } else {
      toast.error(ERROR_DELETE('empleado'));
    }
    setLoading(false);
    setOpenDeleteDialog(false);
  };

  // Handle input change
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: false }));
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
      try {
        const [rolesData, typesData] = await Promise.all([
          roleService.getAll(),
          employeeTypeService.getAll(),
        ]);

        // Transform data for select options
        setRoles(
          rolesData.map((role) => ({
            value: String(role.ID),
            label: role.Name,
          }))
        );
        setEmployeeTypes(
          typesData.map((type) => ({
            value: String(type.ID),
            label: type.Name,
          }))
        );
      } catch (error) {
        toast.error(CATALOG_ERROR);
      } finally {
        setCatalogsLoading(false);
      }
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

  return (
    <MainBox>
      <ContainerBox>
        <BorderBottomContainer>
          <Typography variant="h4" sx={{ textAlign: 'start', fontWeight: 500 }}>
            Empleados
          </Typography>
        </BorderBottomContainer>

        {/* Search bar */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 10, width: '100%' }}>
          <CustomTextField
            id="search"
            label="Buscar"
            placeholder="Búsqueda por código o nombre"
            icon={<FaSearch />}
            onIconClick={handleSearch}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyPress={handleSearchKeyPress}
            disabled={loading || isEditMode || isNewMode}
            fullWidth
          />
          <Button
            variant="contained"
            size="large"
            startIcon={<IoPersonAdd />}
            sx={{ maxHeight: '36px', minWidth: '200px' }}
            onClick={handleNewEmployee}
            disabled={loading || isEditMode || isNewMode}
          >
            Nuevo Empleado
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
                  height: '300px',
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <>
                <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column', padding: 2 }}>
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
                      onChange={(e) => handleInputChange('FullName', e.target.value)}
                      disabled={isFormDisabled}
                      fullWidth
                      error={errors.FullName}
                      helperText={errors.FullName ? IS_REQUIRED : ''}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', gap: 3, marginTop: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography sx={{ textAlign: 'start' }}>Rol:</Typography>
                      <CustomSelect
                        id="role"
                        placeholder="Selecciona un rol"
                        value={formData.RoleID}
                        onChange={(e) => handleInputChange('RoleID', e.target.value)}
                        options={roles}
                        disabled={isFormDisabled}
                        error={errors.RoleID}
                        helperText={errors.RoleID ? IS_REQUIRED : ''}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography sx={{ textAlign: 'start' }}>Tipo:</Typography>
                      <CustomSelect
                        id="employeeType"
                        placeholder="Selecciona un tipo"
                        value={formData.EmployeeTypeID}
                        onChange={(e) => handleInputChange('EmployeeTypeID', e.target.value)}
                        options={employeeTypes}
                        disabled={isFormDisabled}
                        error={errors.EmployeeTypeID}
                        helperText={errors.EmployeeTypeID ? IS_REQUIRED : ''}
                      />
                    </Box>
                  </Box>
                </Box>

                {/* Action Buttons */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: '100%',
                    gap: 2,
                    padding: 2,
                  }}
                >
                  {/* Navigation buttons (only show when multiple results) */}
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {employeesFound.length > 1 && !isEditMode && !isNewMode && (
                      <>
                        <Button
                          variant="contained"
                          sx={{ maxHeight: '36px', minWidth: '100px' }}
                          startIcon={<MdNavigateBefore />}
                          onClick={() => handleNavigate('prev')}
                          disabled={currentIndex === 0}
                        >
                          Anterior
                        </Button>
                        <Button
                          variant="contained"
                          sx={{ maxHeight: '36px', minWidth: '100px' }}
                          endIcon={<MdNavigateNext />}
                          onClick={() => handleNavigate('next')}
                          disabled={currentIndex === employeesFound.length - 1}
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
                        background: isEditMode || isNewMode ? '#1976d2' : '#FFAB00',
                        '&:hover': {
                          background: isEditMode || isNewMode ? '#115293' : '#d99100',
                        },
                      }}
                      startIcon={isEditMode || isNewMode ? <FaSave /> : <CiEdit />}
                      onClick={isEditMode || isNewMode ? handleSave : handleEdit}
                      disabled={loading || (!formData.ID && !isNewMode)}
                    >
                      {isEditMode || isNewMode ? 'Guardar' : 'Editar'}
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
                      startIcon={isEditMode || isNewMode ? <IoMdClose /> : <FaRegTrashAlt />}
                      onClick={
                        isEditMode || isNewMode ? handleCancel : () => setOpenDeleteDialog(true)
                      }
                      disabled={loading || (!formData.ID && !isNewMode)}
                    >
                      {isEditMode || isNewMode ? 'Cancelar' : 'Eliminar'}
                    </Button>
                  </Box>
                </Box>
              </>
            )}
          </Box>
        </FormContainer>
      </ContainerBox>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleDelete}
        title={DELETE_DIALOG_TITLE}
        message={DELETE_DIALOG_TEXT('empleado', formData.FullName)}
      />
    </MainBox>
  );
};

export default EmployeePage;
