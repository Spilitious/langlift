export const executeConsequence = async (
  id: number
): Promise<void> => {
  const response = await fetch(
    "http://localhost:3001/api/consequence/add",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        consequenceId: id,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Impossible d'ajouter la conséquence ${id}`
    );
  }
};