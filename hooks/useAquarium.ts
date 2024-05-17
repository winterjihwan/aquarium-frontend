import { useEffect, useState } from "react"
import { listenToCreatorCreation } from "@/libs/creator"
import { fetchAquariums } from "@/libs/aquarium/fetchAquarium"
import { fetchStakedPools } from "@/libs/aquarium/fetchStakedPools"

export const useAquariums = (account: string | undefined) => {
  const [aquariums, setAquariums] = useState<string[]>([])

  useEffect(() => {
    if (account) {
      fetchAquariums(account)
        .then((data) => setAquariums(data))
        .catch((error) => console.error("Error fetching aquariums:", error))
    }
  }, [account])

  return aquariums
}

export const useStakedPools = (
  aquariums: string[],
  account: string | undefined
) => {
  const [stakedPools, setStakedPools] = useState<{ [key: string]: string[] }>(
    {}
  )

  useEffect(() => {
    const fetchStakedPoolsForAquariums = async () => {
      const stakedPoolsMap: { [key: string]: string[] } = {}
      for (const aquarium of aquariums) {
        const pools = await fetchStakedPools(aquarium, account!)
        stakedPoolsMap[aquarium] = pools
      }
      setStakedPools(stakedPoolsMap)
    }

    if (aquariums.length > 0) {
      fetchStakedPoolsForAquariums()
    }
  }, [aquariums, account])

  return stakedPools
}
