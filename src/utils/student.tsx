import { TutorJufoParticipationIndication } from '../types/Student';

export const getJufoParticipantStatus = (
  status?: TutorJufoParticipationIndication
) => {
  if (status === TutorJufoParticipationIndication.NO) return 'Nein';
  if (status === TutorJufoParticipationIndication.YES) return 'Ja';
  if (status === TutorJufoParticipationIndication.IDK) return 'Keine Ahnung';

  return 'Keine Ahnung';
};
