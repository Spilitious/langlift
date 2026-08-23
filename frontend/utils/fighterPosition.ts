export const getNpcPosition = (
  position: number
): [number, number] => {
  switch (position) {
    case 1: return [50, 10];
    case 2: return [50, 40];
    case 3: return [50, 70];

    case 4: return [65, 10];
    case 5: return [65, 40];
    case 6: return [65, 70];

    case 7: return [80, 10];
    case 8: return [80, 40];
    case 9: return [80, 70];

    default: return [65, 24];
  }
};

export const getPjPosition = (
  position: number
): [number, number] => {
  switch (position) {
    case 1: return [10, 10];
    case 2: return [10, 40];
    case 3: return [10, 70];

    case 4: return [25, 10];
    case 5: return [25, 40];
    case 6: return [25, 70];

    case 7: return [40, 10];
    case 8: return [40, 40];
    case 9: return [40, 70];

    default: return [25, 10];
  }
};