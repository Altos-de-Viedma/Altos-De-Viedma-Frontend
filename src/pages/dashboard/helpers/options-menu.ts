import { Icons } from '../../../shared';

export const cardOptions = [
  { title: 'Emergencias', Icon: Icons.IoMegaphoneOutline, route: '/emergencias', type: 'emergencies' as const },
  { title: 'Paquetes', Icon: Icons.IoCubeOutline, route: '/paquetes', type: 'packages' as const },
  { title: 'Visitantes', Icon: Icons.IoManOutline, route: '/visitantes', type: 'visitors' as const },
  { title: 'Expensas', Icon: Icons.IoReceiptOutline, route: '/facturas', type: 'invoices' as const },
  { title: 'Caja', Icon: Icons.IoCashOutline, route: '/caja', type: 'cash' as const },
  { title: 'Seguros Empleados', Icon: Icons.IoReaderOutline, route: '/seguros-empleados', type: 'insurance' as const },
  { title: 'Propiedades', Icon: Icons.IoHomeOutline, route: '/propiedades' },
  { title: 'Usuarios', Icon: Icons.IoIdCardOutline, route: '/usuarios' },
  { title: 'Mensajes Masivos', Icon: Icons.IoChatbubblesOutline, route: '/mensajes-masivos' }
];