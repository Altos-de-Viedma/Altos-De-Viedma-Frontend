import { Icons } from '../../../shared';

export const cardOptions = [
  { title: 'Emergencias', Icon: Icons.IoMegaphoneOutline, route: '/emergencias', type: 'emergencies' as const },
  { title: 'Paquetes', Icon: Icons.IoCubeOutline, route: '/paquetes', type: 'packages' as const },
  { title: 'Visitantes', Icon: Icons.IoManOutline, route: '/visitantes', type: 'visitors' as const },
  { title: 'Propiedades', Icon: Icons.IoHomeOutline, route: '/propiedades' },
  { title: 'Usuarios', Icon: Icons.IoIdCardOutline, route: '/usuarios' }
];