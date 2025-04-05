import { Group } from '@prisma/client';

export function getNewsGenerationContext(group: Group, title: string) {
  return `Egy hírt kell írnod plain text formátumban, nem lehet formázni, dupla sortöréssel elválasztva a bekezdéseket. A hírt egy csoportnak kell írni, a csoport neve: ${group.name}, a csoport leírása: ${group.description}. A hír címe: ${title}, ezt már nem kell beleírni a tartalomba.`;
}

export function getEventGenerationContext(
  group: Group,
  name: string,
  location: string,
  startDate: string,
  endDate: string,
  isPrivate: boolean
) {
  return `Egy esemény leírását kell generálnod plain text formátumban, nem lehet formázni, dupla sortöréssel elválasztva a bekezdéseket.
  Az eseményt egy csoportnak kell írni, a csoport neve: ${group.name}, a csoport leírása: ${group.description}.
  Az esemény neve: ${name}, helyszín: ${location}, kezdés dátuma: ${startDate}, befejezés dátuma: ${endDate}, privát esemény: ${isPrivate ? 'igen' : 'nem'}`;
}
