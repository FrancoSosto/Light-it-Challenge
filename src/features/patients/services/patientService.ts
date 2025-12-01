import api from '@/lib/axios';
import { type IPaciente, type IPacientePayload } from '@/types';

const recurso = '/users';

export async function obtenerPacientes(): Promise<IPaciente[]> {
  const respuesta = await api.get<IPaciente[]>(recurso);
  return respuesta.data;
}

export async function crearPaciente(payload: IPacientePayload): Promise<IPaciente> {
  const respuesta = await api.post<IPaciente>(recurso, payload);
  return respuesta.data;
}

export async function actualizarPaciente(id: string, payload: IPacientePayload): Promise<IPaciente> {
  const respuesta = await api.put<IPaciente>(`${recurso}/${id}`, payload);
  return respuesta.data;
}
