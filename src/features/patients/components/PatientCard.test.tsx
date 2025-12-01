import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PatientCard } from './PatientCard';
import { type IPaciente } from '@/types';

const pacienteMock: IPaciente = {
  id: '1',
  name: 'Jane Doe',
  avatar: 'https://example.com/avatar.png',
  description: 'Paciente con antecedentes de chequeos anuales correctos.',
  website: 'https://example.com',
  createdAt: '2025-01-01T00:00:00.000Z',
};

describe('PatientCard', () => {
  it('no muestra el detalle cuando no está expandida', () => {
    render(<PatientCard paciente={pacienteMock} onEditar={() => {}} onToggle={() => {}} expandida={false} />);

    // El link existe en el DOM pero está oculto con clase 'invisible' en el contenedor
    const link = screen.getByRole('link', { name: pacienteMock.website });
    // Buscar el div contenedor con clase invisible
    const hiddenContainer = link.closest('.invisible');
    expect(hiddenContainer).toBeInTheDocument();
    expect(screen.getByText(/ver detalles/i)).toBeInTheDocument();
  });

  it('muestra el detalle cuando está expandida', () => {
    render(<PatientCard paciente={pacienteMock} onEditar={() => {}} onToggle={() => {}} expandida />);

    // La descripción aparece dos veces (expandida y colapsada), verificamos que la versión expandida sea visible
    const descriptions = screen.getAllByText(pacienteMock.description);
    const visibleDescription = descriptions.find((el) => !el.closest('.invisible'));
    expect(visibleDescription).toBeInTheDocument();

    const link = screen.getByRole('link', { name: pacienteMock.website });
    const visibleContainer = link.closest('.invisible');
    expect(visibleContainer).toBeNull();
  });

  it('dispara onToggle con el id del paciente', async () => {
    const onToggle = vi.fn();

    render(<PatientCard paciente={pacienteMock} onEditar={() => {}} onToggle={onToggle} expandida={false} />);

    await userEvent.click(screen.getByRole('button', { name: /ver detalles/i }));
    expect(onToggle).toHaveBeenCalledWith(pacienteMock.id);
  });
});
