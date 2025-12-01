export interface IPaciente {
  id: string;
  name: string;
  avatar: string;
  description: string;
  website: string;
  createdAt: string;
}

export interface IPacientePayload {
  name: string;
  avatar: string;
  description: string;
  website: string;
}
