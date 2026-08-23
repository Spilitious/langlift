export const getActionImagePath = (
  image: number,
  type: string
) => {
  return `/ui/actions/${type}${image}.png`;
};