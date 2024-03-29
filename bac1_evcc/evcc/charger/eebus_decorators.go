package charger

// Code generated by github.com/evcc-io/evcc/cmd/tools/decorate.go. DO NOT EDIT.

import (
	"github.com/evcc-io/evcc/api"
)

func decorateEEBus(base *EEBus, meter func() (float64, error), meterCurrent func() (float64, float64, float64, error), chargeRater func() (float64, error)) api.Charger {
	switch {
	case chargeRater == nil && meter == nil && meterCurrent == nil:
		return base

	case chargeRater == nil && meter != nil && meterCurrent == nil:
		return &struct {
			*EEBus
			api.Meter
		}{
			EEBus: base,
			Meter: &decorateEEBusMeterImpl{
				meter: meter,
			},
		}

	case chargeRater == nil && meter == nil && meterCurrent != nil:
		return &struct {
			*EEBus
			api.MeterCurrent
		}{
			EEBus: base,
			MeterCurrent: &decorateEEBusMeterCurrentImpl{
				meterCurrent: meterCurrent,
			},
		}

	case chargeRater == nil && meter != nil && meterCurrent != nil:
		return &struct {
			*EEBus
			api.Meter
			api.MeterCurrent
		}{
			EEBus: base,
			Meter: &decorateEEBusMeterImpl{
				meter: meter,
			},
			MeterCurrent: &decorateEEBusMeterCurrentImpl{
				meterCurrent: meterCurrent,
			},
		}

	case chargeRater != nil && meter == nil && meterCurrent == nil:
		return &struct {
			*EEBus
			api.ChargeRater
		}{
			EEBus: base,
			ChargeRater: &decorateEEBusChargeRaterImpl{
				chargeRater: chargeRater,
			},
		}

	case chargeRater != nil && meter != nil && meterCurrent == nil:
		return &struct {
			*EEBus
			api.ChargeRater
			api.Meter
		}{
			EEBus: base,
			ChargeRater: &decorateEEBusChargeRaterImpl{
				chargeRater: chargeRater,
			},
			Meter: &decorateEEBusMeterImpl{
				meter: meter,
			},
		}

	case chargeRater != nil && meter == nil && meterCurrent != nil:
		return &struct {
			*EEBus
			api.ChargeRater
			api.MeterCurrent
		}{
			EEBus: base,
			ChargeRater: &decorateEEBusChargeRaterImpl{
				chargeRater: chargeRater,
			},
			MeterCurrent: &decorateEEBusMeterCurrentImpl{
				meterCurrent: meterCurrent,
			},
		}

	case chargeRater != nil && meter != nil && meterCurrent != nil:
		return &struct {
			*EEBus
			api.ChargeRater
			api.Meter
			api.MeterCurrent
		}{
			EEBus: base,
			ChargeRater: &decorateEEBusChargeRaterImpl{
				chargeRater: chargeRater,
			},
			Meter: &decorateEEBusMeterImpl{
				meter: meter,
			},
			MeterCurrent: &decorateEEBusMeterCurrentImpl{
				meterCurrent: meterCurrent,
			},
		}
	}

	return nil
}

type decorateEEBusChargeRaterImpl struct {
	chargeRater func() (float64, error)
}

func (impl *decorateEEBusChargeRaterImpl) ChargedEnergy() (float64, error) {
	return impl.chargeRater()
}

type decorateEEBusMeterImpl struct {
	meter func() (float64, error)
}

func (impl *decorateEEBusMeterImpl) CurrentPower() (float64, error) {
	return impl.meter()
}

type decorateEEBusMeterCurrentImpl struct {
	meterCurrent func() (float64, float64, float64, error)
}

func (impl *decorateEEBusMeterCurrentImpl) Currents() (float64, float64, float64, error) {
	return impl.meterCurrent()
}
