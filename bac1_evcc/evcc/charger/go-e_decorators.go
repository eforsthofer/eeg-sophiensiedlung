package charger

// Code generated by github.com/andig/cmd/tools/decorate.go. DO NOT EDIT.

import (
	"github.com/evcc-io/evcc/api"
)

func decorateGoE(base *GoE, meterEnergy func() (float64, error), phaseSwitcher func(phases int) error) api.Charger {
	switch {
	case phaseSwitcher == nil && meterEnergy == nil:
		return base

	case phaseSwitcher == nil && meterEnergy != nil:
		return &struct {
			*GoE
			api.MeterEnergy
		}{
			GoE: base,
			MeterEnergy: &decorateGoEMeterEnergyImpl{
				meterEnergy: meterEnergy,
			},
		}

	case phaseSwitcher != nil && meterEnergy == nil:
		return &struct {
			*GoE
			api.PhaseSwitcher
		}{
			GoE: base,
			PhaseSwitcher: &decorateGoEPhaseSwitcherImpl{
				phaseSwitcher: phaseSwitcher,
			},
		}

	case phaseSwitcher != nil && meterEnergy != nil:
		return &struct {
			*GoE
			api.PhaseSwitcher
			api.MeterEnergy
		}{
			GoE: base,
			PhaseSwitcher: &decorateGoEPhaseSwitcherImpl{
				phaseSwitcher: phaseSwitcher,
			},
			MeterEnergy: &decorateGoEMeterEnergyImpl{
				meterEnergy: meterEnergy,
			},
		}
	}

	return nil
}

type decorateGoEPhaseSwitcherImpl struct {
	phaseSwitcher func(int) error
}

func (impl *decorateGoEPhaseSwitcherImpl) Phases1p3p(phases int) error {
	return impl.phaseSwitcher(phases)
}

type decorateGoEMeterEnergyImpl struct {
	meterEnergy func() (float64, error)
}

func (impl *decorateGoEMeterEnergyImpl) TotalEnergy() (float64, error) {
	return impl.meterEnergy()
}