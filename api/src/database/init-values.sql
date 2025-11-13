
INSERT INTO Role (Name, HourlyBonus) VALUES
('Chofer', 10.00),
('Cargador', 5.00),
('Auxiliar', 0.00);

INSERT INTO EmployeeType (Name) VALUES
('Interno'),
('Subcontratado');

INSERT INTO Employee (EmployeeCode, FullName, RoleID, EmployeeTypeID, Status)
VALUES
  ('EMP001', 'Agustin Cardoza', 1, 1, TRUE),
  ('EMP002', 'Grecia Esmeralda Mendez', 2, 1, TRUE),
  ('EMP003', 'Francisco Abraham Perez', 3, 2, TRUE),
  ('EMP004', 'Alfonso Zazueta', 1, 2, TRUE),
  ('EMP005', 'Cesar Agustin Cardoza', 2, 1, TRUE);
  