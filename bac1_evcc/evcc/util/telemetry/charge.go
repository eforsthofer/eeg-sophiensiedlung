package telemetry

import (
	"errors"
	"fmt"
	"net/http"

	"github.com/evcc-io/evcc/util"
	"github.com/evcc-io/evcc/util/machine"
	"github.com/evcc-io/evcc/util/request"
	"github.com/evcc-io/evcc/util/sponsor"
)

const api = "https://api.evcc.io"

var instanceID string

func Enabled() bool {
	return instanceID != ""
}

func Create(token, machineID string) error {
	if token == "" {
		return errors.New("telemetry requires sponsorship")
	}

	if machineID == "" {
		var err error
		if machineID, err = machine.ProtectedID("evcc-api"); err != nil {
			return err
		}
	}

	instanceID = machineID

	return nil
}

func UpdateChargeProgress(log *util.Logger, power, deltaCharged, deltaGreen float64) {
	log.DEBUG.Printf("telemetry: charge: Δ%.0f/%.0fWh @ %.0fW", deltaGreen*1e3, deltaCharged*1e3, power)

	data := InstanceChargeProgress{
		InstanceID: instanceID,
		ChargeProgress: ChargeProgress{
			ChargePower:  power,
			GreenPower:   power * deltaGreen / deltaCharged,
			ChargeEnergy: deltaCharged,
			GreenEnergy:  deltaGreen,
		},
	}

	uri := fmt.Sprintf("%s/v1/charge", api)
	req, err := request.New(http.MethodPost, uri, request.MarshalJSON(data), map[string]string{
		"Authorization": "Bearer " + sponsor.Token,
	})

	var res struct {
		Error string
	}

	if err == nil {
		client := request.NewHelper(log)
		if err = client.DoJSON(req, &res); err == nil && res.Error != "" {
			err = errors.New(res.Error)
		}
	}

	if err != nil {
		log.ERROR.Printf("telemetry: charge: %v", err)
	}
}
