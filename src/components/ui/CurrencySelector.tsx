import { useState, useEffect, type ChangeEvent } from "react";

interface CurrencySelectorProps {
	setSelectedCurrency: (currency: string) => void;
	selectedCurrency: string;
	setSelectedCountry: (country: string) => void;
}

interface RestCountryCurrencyInfo {
	name?: {
		common?: string;
	};
	currencies?: Record<string, unknown>;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({
	setSelectedCurrency,
	selectedCurrency,
	setSelectedCountry,
}) => {
	const [currencies, setCurrencies] = useState<string[]>([]);

	useEffect(() => {
		const fetchCurrencies = async () => {
			try {
				const response = await fetch(
					"https://restcountries.com/v3.1/all?fields=name,currencies",
				);
				const data: RestCountryCurrencyInfo[] = await response.json();

				if (!Array.isArray(data)) {
					console.error("Unexpected currencies response shape:", data);
					return;
				}

				const currencyMap: Record<string, string> = {};

				data.forEach((country) => {
					if (country.currencies) {
						for (const currencyCode of Object.keys(country.currencies)) {
							if (!currencyMap[currencyCode]) {
								const countryName = country.name?.common ?? "";
								if (countryName) {
									currencyMap[currencyCode] = countryName;
								}
							}
						}
					}
				});

				setCurrencies(Object.keys(currencyMap).sort());
				setCurrencyToCountryMap(currencyMap);
			} catch (error) {
				console.error("Error fetching countries:", error);
			}
		};

		fetchCurrencies();
	}, []);

	const [currencyToCountryMap, setCurrencyToCountryMap] = useState<
		Record<string, string>
	>({});

	const handleCurrencyChange = (event: ChangeEvent<HTMLSelectElement>) => {
		const currencyCode = event.target.value;
		setSelectedCurrency(currencyCode);
		setSelectedCountry(currencyToCountryMap[currencyCode]); // Automatically get the country from the map
	};

	return (
		<div>
			{/* <h2>Select Your Currency</h2> */}
			{/* <form> */}

			<select
				className='flex h-10  w-full rounded-md border outline-none 
border-input bg-background px-3 py-2 text-sm 
ring-offset-background file:border-0 file:bg-transparent 
file:text-sm file:font-medium 
placeholder:text-muted-foreground 
focus-visible:outline-none mt-2 disabled:cursor-not-allowed 
disabled:opacity-50'
				id='currency'
				value={selectedCurrency}
				onChange={handleCurrencyChange}>
				<option value='' disabled>
					Select a currency
				</option>
				{currencies.map((currency: any) => (
					<option key={currency} value={currency}>
						{currency}
					</option>
				))}
			</select>
			{/* </form> */}
		</div>
	);
};

export default CurrencySelector;
