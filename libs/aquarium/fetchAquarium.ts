export const fetchAquariums = async (
  contractAddress: string
): Promise<string[]> => {
  if (!contractAddress) throw new Error("Contract address is required")

  try {
    const response = await fetch(
      `/api/aquarium/getAquariums?contractAddress=${contractAddress}`,
      {
        method: "GET",
      }
    )

    if (!response.ok) {
      throw new Error("Network response was not ok")
    }

    const data = await response.json()
    return data.aquariums || []
  } catch (error) {
    console.error("Error fetching aquariums:", error)
    return []
  }
}
