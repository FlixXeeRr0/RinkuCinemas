export function generateEmployeeCode(code) {
  let nextNumber = 1;

  const lastNumber = parseInt(code.replace('EMP', ''));
  nextNumber = lastNumber + 1;

  return `EMP${String(nextNumber).padStart(3, '0')}`;
}
