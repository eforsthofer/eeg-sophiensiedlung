// Charge modes
export const ChareModes = {
    ModeEmpty: { ChargeMode: "" },
    ModeOff: { ChargeMode: "off" },
    ModeNow: { ChargeMode: "now" },
    ModeMinPV: { ChargeMode: "minpv" },
    ModePV: { ChargeMode: "pv" }
};
// Charging states
export const ChargeStatuses = {
    StatusNone: "",
    StatusA: "A",
    StatusB: "B",
    StatusC: "C",
    StatusD: "D",
    StatusE: "E",
    StatusF: "F" // Fzg. angeschlossen:   ja    Laden aktiv: nein    - Fehler (Ausfall Wallbox)
};
/* // Resurrector provides wakeup calls to the vehicle with an API call or a CP interrupt from the charger
interface Resurrector {
    WakeUp() error
}

// Tariff is the grid tariff
interface Tariff {
    IsCheap() (bool, error)
    CurrentPrice() (float64, error) // EUR/kWh, CHF/kWh, ...
}

// AuthProvider is the ability to provide OAuth authentication through the ui
interface AuthProvider {
    SetCallbackParams(baseURL, redirectURL string, authenticated chan<- bool)
    LoginHandler() http.HandlerFunc
    LogoutHandler() http.HandlerFunc
}

// FeatureDescriber optionally provides a list of supported non-api features
interface FeatureDescriber {
    Features() []Feature
    Has(Feature) bool
}

// CsvWriter converts to csv
interface CsvWriter {
    WriteCsv(context.Context, io.Writer)
}
 */ 
