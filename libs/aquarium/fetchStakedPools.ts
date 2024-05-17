export const fetchStakedPools = async (
  aquariumName: string,
  contractAddress: string
): Promise<string[]> => {
  if (!aquariumName || !contractAddress)
    throw new Error("Both aquarium name and contract address are required")

  try {
    const response = await fetch(
      `/api/aquarium/getStakedPools?aquariumName=${aquariumName}&contractAddress=${contractAddress}`,
      {
        method: "GET",
      }
    )

    if (!response.ok) {
      throw new Error("Network response was not ok")
    }

    const data = await response.json()
    return data.stakedPools || []
  } catch (error) {
    console.error("Error fetching staked pools:", error)
    return []
  }
}
