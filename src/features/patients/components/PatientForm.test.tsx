import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PatientForm } from './PatientForm';
import { type IPaciente } from '@/types';

const pacienteMock: IPaciente = {
  id: '1',
  name: 'Jane Doe',
  avatar: 'https://example.com/avatar.png',
  description: 'Paciente con antecedentes de chequeos anuales correctos.',
  website: 'https://example.com',
  createdAt: '2025-01-01T00:00:00.000Z',
};

describe('PatientForm', () => {
  describe('Modo crear', () => {
    it('renderiza formulario vacío', () => {
      render(<PatientForm modo="crear" alEnviar={vi.fn()} />);

      expect(screen.getByLabelText(/nombre completo/i)).toHaveValue('');
      expect(screen.getByLabelText(/foto \(url\)/i)).toHaveValue('');
      expect(screen.getByLabelText(/descripción/i)).toHaveValue('');
      expect(screen.getByLabelText(/sitio web/i)).toHaveValue('');
      expect(screen.getByRole('button', { name: /crear paciente/i })).toBeInTheDocument();
    });

    it('muestra errores de validación cuando se envía vacío', async () => {
      const user = userEvent.setup();
      render(<PatientForm modo="crear" alEnviar={vi.fn()} />);

      await user.click(screen.getByRole('button', { name: /crear paciente/i }));

      await waitFor(() => {
        expect(screen.getByText('El nombre es obligatorio')).toBeInTheDocument();
        expect(screen.getByText('La descripción es obligatoria')).toBeInTheDocument();
        // Ambos campos de URL muestran el error, así que verificamos que al menos uno esté presente
        const urlErrors = screen.getAllByText('Debe ser una URL válida');
        expect(urlErrors.length).toBeGreaterThan(0);
      });
    });

    it('valida URLs correctamente', async () => {
      const user = userEvent.setup();
      render(<PatientForm modo="crear" alEnviar={vi.fn()} />);

      const avatarInput = screen.getByLabelText(/foto \(url\)/i);
      const websiteInput = screen.getByLabelText(/sitio web/i);

      await user.type(avatarInput, 'no-es-url');
      await user.type(websiteInput, 'tampoco-url');
      await user.click(screen.getByRole('button', { name: /crear paciente/i }));

      await waitFor(() => {
        const errorMessages = screen.getAllByText(/debe ser una url válida/i);
        expect(errorMessages).toHaveLength(2);
      });
    });

    it('llama a alEnviar con datos válidos', async () => {
      const user = userEvent.setup();
      const mockAlEnviar = vi.fn();
      render(<PatientForm modo="crear" alEnviar={mockAlEnviar} />);

      await user.type(screen.getByLabelText(/nombre completo/i), 'John Smith');
      await user.type(screen.getByLabelText(/foto \(url\)/i), 'https://example.com/photo.jpg');
      await user.type(screen.getByLabelText(/descripción/i), 'Test description');
      await user.type(screen.getByLabelText(/sitio web/i), 'https://example.com');

      await user.click(screen.getByRole('button', { name: /crear paciente/i }));

      await waitFor(() => {
        expect(mockAlEnviar).toHaveBeenCalledWith({
          name: 'John Smith',
          avatar: 'https://example.com/photo.jpg',
          description: 'Test description',
          website: 'https://example.com',
        });
      });
    });
  });

  describe('Modo editar', () => {
    it('renderiza formulario con datos del paciente', () => {
      render(<PatientForm modo="editar" paciente={pacienteMock} alEnviar={vi.fn()} />);

      expect(screen.getByLabelText(/nombre completo/i)).toHaveValue(pacienteMock.name);
      expect(screen.getByLabelText(/foto \(url\)/i)).toHaveValue(pacienteMock.avatar);
      expect(screen.getByLabelText(/descripción/i)).toHaveValue(pacienteMock.description);
      expect(screen.getByLabelText(/sitio web/i)).toHaveValue(pacienteMock.website);
      expect(screen.getByRole('button', { name: /guardar cambios/i })).toBeInTheDocument();
    });

    it('actualiza datos correctamente', async () => {
      const user = userEvent.setup();
      const mockAlEnviar = vi.fn();
      render(<PatientForm modo="editar" paciente={pacienteMock} alEnviar={mockAlEnviar} />);

      const nombreInput = screen.getByLabelText(/nombre completo/i);
      await user.clear(nombreInput);
      await user.type(nombreInput, 'Nombre Actualizado');

      await user.click(screen.getByRole('button', { name: /guardar cambios/i }));

      await waitFor(() => {
        expect(mockAlEnviar).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'Nombre Actualizado',
          }),
        );
      });
    });
  });

  describe('Estado de carga', () => {
    it('deshabilita el botón cuando está cargando', () => {
      render(<PatientForm modo="crear" alEnviar={vi.fn()} estaCargando={true} />);

      const button = screen.getByRole('button', { name: /crear paciente/i });
      expect(button).toBeDisabled();
    });

    it('muestra indicador de carga', () => {
      render(<PatientForm modo="crear" alEnviar={vi.fn()} estaCargando={true} />);

      // El botón con loading muestra un spinner
      expect(screen.getByRole('button')).toContainHTML('animate-spin');
    });
  });
});
