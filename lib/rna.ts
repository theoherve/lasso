interface RnaResult {
  valid: boolean
  name?: string
}

export async function verifyRna(rnaNumber: string): Promise<RnaResult> {
  if (process.env.NODE_ENV === "development") {
    return { valid: true, name: "Association Mock" }
  }

  try {
    const response = await fetch(
      `https://entreprise.api.gouv.fr/v3/insee/sirene/unites_legales/${rnaNumber}`,
    )

    if (!response.ok) {
      return { valid: false }
    }

    const data = await response.json()
    return {
      valid: true,
      name: data?.data?.denomination ?? undefined,
    }
  } catch {
    return { valid: false }
  }
}
