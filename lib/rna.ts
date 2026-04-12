interface RnaResult {
  valid: boolean
  name?: string
}

export async function verifyRna(rnaNumber: string): Promise<RnaResult> {
  // En dev, on mock pour ne pas dependre de l'API externe
  if (process.env.NODE_ENV === "development") {
    // Simule un delai reseau
    await new Promise((r) => setTimeout(r, 300))
    return {
      valid: rnaNumber.startsWith("W"),
      name: `Association ${rnaNumber}`,
    }
  }

  try {
    // API Repertoire National des Associations (data.gouv.fr)
    const response = await fetch(
      `https://entreprise.data.gouv.fr/api/rna/v1/id/${encodeURIComponent(rnaNumber)}`,
    )

    if (!response.ok) {
      return { valid: false }
    }

    const data = await response.json()
    const asso = data?.association

    if (!asso) {
      return { valid: false }
    }

    return {
      valid: true,
      name: asso.titre ?? asso.titre_court ?? undefined,
    }
  } catch {
    return { valid: false }
  }
}
