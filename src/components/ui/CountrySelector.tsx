import { useEffect, useState } from "react"

interface CountryOption {
  value: string
  label: string
}

interface CountrySelectorProps {
  selectedCountry: string
  setSelectedCountry: (country: string) => void
}

interface RestCountry {
  name?: {
    common?: string
  }
}

const CountrySelector: React.FC<CountrySelectorProps> = ({
  selectedCountry,
  setSelectedCountry,
}) => {
  const [countries, setCountries] = useState<CountryOption[]>([])

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all?fields=name")
        const data: RestCountry[] = await response.json()

        const countryOptions: CountryOption[] =
          data
            ?.map((country: RestCountry) => {
              const label = country.name?.common ?? ""
              return {
                value: label,
                label,
              }
            })
            .filter((country: CountryOption) => Boolean(country.value)) || []

        setCountries(
          countryOptions.sort((a, b) => a.label.localeCompare(b.label)),
        )
      } catch (error) {
        console.error("Error fetching countries:", error)
      }
    }

    fetchCountries()
  }, [])

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountry(event.target.value)
  }

  return (
    <select
      id="country"
      value={selectedCountry}
      onChange={handleChange}
      className="flex h-10 w-full rounded-md border outline-none border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none mt-1 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <option value="" disabled>
        Select country
      </option>
      {countries.map((country) => (
        <option key={country.value} value={country.value}>
          {country.label}
        </option>
      ))}
    </select>
  )
}

export default CountrySelector
