package model

type Medicine struct {
	ID           string `json:"id"`
	Name         string `json:"name"`
	GenericName  string `json:"generic_name"`
	Manufacturer string `json:"manufacturer"`
	Strength     string `json:"strength"`
	DosageForm   string `json:"dosage_form"`
	Category     string `json:"category"`
	IsOTC        bool   `json:"is_otc"`
}
