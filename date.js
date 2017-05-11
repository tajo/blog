const months = [
  'Leden',
  'Únor',
  'Březen',
  'Duben',
  'Květen',
  'Červen',
  'Červenec',
  'Srpen',
  'Září',
  'Říjen',
  'Listopad',
  'Prosinec',
];

const months2 = [
  'Ledna',
  'Února',
  'Března',
  'Dubna',
  'Května',
  'Června',
  'Červenece',
  'Srpna',
  'Září',
  'Října',
  'Listopadu',
  'Prosince',
];

export const dateWithDay = date => {
  if (!date) return '';
  const parts = date.split('T')[0].split('-');
  return `${parseInt(parts[2], 10)}. ${months2[parseInt(parts[1], 10) - 1]}, ${parts[0]}`;
};

export const dateJustMonth = date => {
  if (!date) return '';
  const parts = date.split('T')[0].split('-');
  return `${months[parseInt(parts[1], 10) - 1]} ${parts[0]}`;
};
